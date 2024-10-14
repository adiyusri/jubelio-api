# Products and Transactions API

This API allows managing products and transactions using `hapi.js` with PostgreSQL and `pg-promise`.

## Prerequisites

- Node.js (v18.x recommended)
- PostgreSQL

## Getting Started for API

### 1. Clone the Repository

```bash
git clone <repository-url>
cd api
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Create Environment File
Create a .env file in the api directory with by looking at .env.example

### 4. Set Up the Database
Make sure PostgreSQL is running and you have created a database with the name you provided in the .env file.

### 5. Run Migrations
To create the required tables, run:

```bash
npx knex migrate:latest
```
### 6. Start the Server
```bash
npm start
```

The server should start on http://localhost:{YOUR PORT}.

API Endpoints:

Products
```
GET /api/products: Get all products.
GET /api/products/{id}: Get a single product by ID.
POST /api/products: Create a new product.
PATCH /api/products: Update an existing product.
DELETE /api/products/{id}: Delete a product.
GET /api/populate: Populate the database with dummy data.
```
Transactions
```
GET /api/transactions: Get all transactions.
GET /api/transactions/{id}: Get a single transaction by ID.
POST /api/transactions: Create a new transaction.
PATCH /api/transactions/{id}: Update an existing transaction.
DELETE /api/transactions/{id}: Delete a transaction.
```
Or you could import postman.json to your postman.