# trading_algorithm

This repository contains a simple, high-performance **Order Book Matching Engine** built with TypeScript and Express. It simulates a basic trading exchange for a single asset (Google stock) by matching buy orders (bids) and sell orders (asks) based on price-time priority.

---

## 🚀 Features

* **Limit Order Placement**: Users can place `bid` (buy) or `ask` (sell) orders.
* **Automated Matching**: The engine automatically matches incoming orders against existing orders in the book.
* **Balance Management**: Real-time updates of USD and Asset balances for users upon successful trades.
* **Market Depth**: Provides an aggregated view of the order book (Market Depth) grouped by price.

---

## 🛠 Tech Stack

* **Runtime**: Node.js
* **Language**: TypeScript
* **Framework**: Express.js

---

## 📈 How the Algorithm Works

The engine uses two primary arrays to store orders: `bids` and `asks`.

1. **Price Sorting**:
* `bids` are sorted in descending order (highest price first).
* `asks` are sorted in ascending order (lowest price first).


2. **Matching Logic**: When a new order arrives, the `fillOrder` function iterates through the opposite side of the book. If the price conditions are met (), a trade is executed, and user balances are updated via the `flipbalance` utility.
3. **Persistence**: Any remaining quantity that cannot be filled immediately is added to the order book.

---

## 📋 API Reference

### 1. Place an Order

**POST** `/order`

```json
{
  "side": "bid",
  "price": 150,
  "quantity": 5,
  "userid": "1"
}

```

### 2. Get Market Depth

**GET** `/depth`
Returns the aggregated quantities of all bids and asks at each price level.

### 3. Check User Balance

**GET** `/balance/:userId`
Returns the current USD and Asset holdings for a specific user.

---

## ⚙️ Setup and Installation

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/trading_algorithm.git
cd trading_algorithm

```


2. **Install dependencies**:
```bash
npm install

```


3. **Run the server**:
```bash
npm start

```



---

## 🧪 Example Scenario

1. **User 1** places a `bid` for 5 Google shares at $150.
2. **User 2** places an `ask` for 5 Google shares at $150.
3. The engine matches them:
* **User 1**: -750 USD, +5 Google.
* **User 2**: +750 USD, -5 Google.

