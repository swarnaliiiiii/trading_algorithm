import express from 'express';

export const app = express();

interface Balances {
    [key: string]: number;
}

interface User {
    id: string;
    balances: Balances;
}

interface Order {
    userId: string;
    price: number;
    quantity: number;
}

export const TICKER = 'Google';

const users: User[] = [
    {
        id: '1',
        balances: {
            "Google": 10,
            "USD": 50000
        }
    },
    {
        id: '2',
        balances: {
            "Google": 10,
            "USD": 50000
        }
    }
];

const bids: Order[] = [];

const asks: Order[] = [];

app.post('/order', (req: any, res: any) => {
    const side = req.body.side;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const userId = req.body.userid;
   
    const RemainingQty = fillOrder(side,price, quantity,userId);

    if(RemainingQty === 0){
        res.json({filledQuantity: quantity});
    }
    if(side === 'bid'){
        bids.push({userId, price, quantity: RemainingQty});
        bids.sort((a, b) => a.price < b.price ? 1 : -1);
    }
    else{
        asks.push({userId, price, quantity: RemainingQty});
        asks.sort((a, b) => a.price > b.price ? -1 : 1);
    }

    res.json({filledQuantity: quantity - RemainingQty});
})

app.get('/depth', (req: any, res: any) => {
    
   const depth: Record<string, { type: "bid" | "ask"; quantity: number }> = {};

   for(let i= 0;i<bids.length;i++){
      if(!depth[bids[i].price]){
        depth[bids[i].price] = {
            quantity: bids[i].quantity,
            type: 'bid'
        }
      }
      else{
        depth[bids[i].price].quantity += bids[i].quantity;
      }
   }

    for(let i= 0;i<asks.length;i++){
        if(!depth[asks[i].price]){
          depth[asks[i].price] = {
                quantity: asks[i].quantity,
                type: 'ask'
          }
        }
        else{
          depth[asks[i].price].quantity += asks[i].quantity;
        }
    }

    res.json({ depth });
})

app.get('/balance/:userId', (req: any, res: any) => {
   const userId = req.params.userId;
   const user = users.find(x => x.id === userId);
   if(!user){
    return res.json({
        USD: 0,
        [TICKER]: 0
    })
   }
   res.json({ balances: user.balances });
})

function fillOrder(side: string, price: number, quantity: number, userId: string): number {
    let remainingQty = quantity;
    if(side === 'bid'){
        for(let i = asks.length - 1; i>= 0;i--){
            if(asks[i].price > price){
                continue;
            }
            if(asks[i].quantity > remainingQty){
                asks[i].quantity -= remainingQty;
                flipbalance(asks[i].userId,userId,remainingQty,asks[i].price);
                return 0;
            }
            else{
                remainingQty -= asks[i].quantity;
                flipbalance(asks[i].userId,userId,asks[i].quantity,asks[i].price);
                asks.pop();
            }
        }
    }
    else{
        for(let i = bids.length - 1; i>= 0;i--){
            if(bids[i].price < price){
                continue;
            }
            if(bids[i].quantity > remainingQty){
                bids[i].quantity -= remainingQty;
                flipbalance(userId,bids[i].userId,remainingQty,bids[i].price);
                return 0;
            }
            else{
                remainingQty -= bids[i].quantity;
                flipbalance(userId,bids[i].userId,bids[i].quantity,bids[i].price);
                bids.pop();
            }
        }
    }
    return remainingQty;
}

function flipbalance(UserId1: string, UserId2: string, quantity: number, price: number) {
    const fromUser = users.find(x => x.id === UserId1);
    const toUser = users.find(x => x.id === UserId2);
    if(!fromUser || !toUser){
        return;
    }

    if(fromUser && toUser){
        fromUser.balances['USD'] += quantity * price;
        toUser.balances['USD'] -= quantity * price;
        fromUser.balances[TICKER] -= quantity;
        toUser.balances[TICKER] += quantity;
    }
}