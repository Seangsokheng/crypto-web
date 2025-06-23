# 🪙 Crypto Market Platform

A full-stack **Crypto Market Application** that allows users to:

- 🔍 View real-time market data
- 💰 Buy and sell cryptocurrencies
- 🔁 Transfer and swap between coins
- 🧑‍💼 Admin dashboard for user and coin management

Built with:

- **Frontend**: React.js
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Admin Panel**: Managed via database or future UI

---

## 📸 Project Overview

The platform simulates a crypto exchange where users can:

- View available cryptocurrencies and their prices
- Buy/sell coins based on their balance
- Transfer coins to other users
- Swap between different cryptocurrencies
- Admin can manage users, coins, and transactions

---


---

## ⚙️ How to Run the Project Locally

### 1. 📥 Clone the Repository

```bash
git clone https://github.com/Seangsokheng/crypto-web.git
cd crypto-web
```

### 2. Run the backend
```bash
cd backend
npm install
node index.js
```

### 3. Run the frontend

Open the new terminal

```bash
cd frontend
npm install
npm start
```
The frontend will run on http://localhost:3000 by default.

### 4. 🧩 Database setup
A. Create the Database

    1. Open pgAdmin.

    2. Right-click Databases → Create → name it crypto.

B. Restore from Backup
    1. Right-click the crypto database → choose Restore...

    2. Set:

        . Format: Custom

        . Filename: Select the crypto.backup file

    3. Click Restore

This will create all necessary tables and data

## Overall of the application 

Currency Market Price 

![Market Screenshot](images/Screenshot%202025-06-23%20113540.png)


![Market Screenshot](images/Screenshot%202025-06-23%20113557.png)


![Market Screenshot](images/Screenshot%202025-06-23%20113614.png)


![Market Screenshot](images/Screenshot%202025-06-23%20113830.png)


![Market Screenshot](images/Screenshot%202025-06-23%20113930.png)