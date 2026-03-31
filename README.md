# Finance API
Backend API for tracking and analyzing financial transactions.

---

## Live API

Base URL:
```http
https://finance-api-ws.onrender.com
```

---

## Overview
A RESTful backend API built with Node.js, Express, PostgreSQL, and Prisma for managing financial transactions.

This project demonstrates backend engineering fundamentals including RESTful API design, database integration, query filtering, analytics endpoints, and cloud deployment. Designed to reflect real-world backend and cloud deployment practices.


## Tech Stack
* Node.js
* Express
* PostgreSQL
* Prisma ORM
* Render (Cloud Deployment)

---

## Features

### Core CRUD
- Create transactions
- Retrieve all transactions
- Retrieve a transaction by ID
- Update transactions
- Delete transactions

### Filtering
- Filter by category
- Filter by minimum amount
- Combine multiple filters

### Analytics
- Total transaction amount
- Spending grouped by category

---

## Project Structure
```bash
finance-api/
│
├── app.js                 # Express app configuration
├── server.js              # Server entry point
│
├── routes/
│   └── transactions.js    # API route handlers
│
├── lib/
│   └── prisma.js          # Prisma client instance
│
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Prisma migrations
│
├── tests/
│   └── app.test.js        # Integration tests (Jest + Supertest)
│
├── prisma.config.ts       # Prisma configuration
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/finance_api"
```
Replace YOUR_PASSWORD with your PostgreSQL password.

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Start the server

```bash
node server.js
```
Server will run at:

```bash
http://localhost:3000
```

---

## Deployment

This API is deployed on Render with a managed PostgreSQL database.

**Architecture:**
- Backend: Render Web Service
- Database: Render PostgreSQL
- Environment variables used for secure configuration

**Production Notes:**
- Uses `DATABASE_URL` environment variable
- Migrations applied using:

  ```bash
  npx prisma migrate deploy
  ```

---

## API Endpoints

### Create Transaction

```http
POST /transactions
```
Request body:

```json
{
  "amount": 50,
  "category": "groceries"
}
```

Example response: 

```json
{
  "message": "Transaction created",
  "data": {
    "id": 1,
    "amount": 50,
    "category": "groceries",
    "createdAt": "2026-03-30T16:48:34.717Z",
    "updatedAt": "2026-03-30T16:48:34.717Z"
  }
}
```

### Get All Transactions

```http
GET /transactions
```

Example response:

```json
{
  "count": 3,
  "data": [
    {
      "id": 2,
      "amount": 50,
      "category": "groceries",
      "createdAt": "2026-03-30T17:09:03.332Z",
      "updatedAt": "2026-03-30T17:09:03.332Z"
    },
    {
      "id": 3,
      "amount": 120,
      "category": "rent",
      "createdAt": "2026-03-30T17:09:38.654Z",
      "updatedAt": "2026-03-30T17:09:38.654Z"
    }
  ]
}
```


### Filtering

```http
GET /transactions?category=groceries
GET /transactions?minAmount=50
GET /transactions?category=groceries&minAmount=40
```

Examples:
- `GET /transactions?category=groceries` returns only grocery transactions
- `GET /transactions?minAmount=50` returns transactions with amount ≥ 50
- `GET /transactions?category=groceries&minAmount=40` combines both filters

### Get Transaction by ID

```http
GET /transactions/:id
```

Example:

```http
GET /transactions/1
```

### Update Transaction

```http
PUT /transactions/:id
```

Request body example:
```json
{
  "amount": 75
}
```

You can update:
- amount
- category
(Partial updates are supported)

### Delete Transaction

```http
DELETE /transactions/:id
```

Example: 

```http
DELETE /transactions/1
```

### Analytics

**Total Amount**

```http
GET /transactions/total
```

Example response:

```json
{
  "totalAmount": 200
}
```

**Spending by Category**

```http
GET /transactions/by-category
```

Example response:

```json
{
  "count": 2,
  "data": [
    { "category": "groceries", "total": 80 },
    { "category": "rent", "total": 120 }
  ]
}
```

---

## Testing
This project includes integration tests using Jest and Supertest.

Tests cover:
- Core CRUD operations
- Filtering logic
- Analytics endpoints

Run tests with:

```bash
npm test
```

---

## Scripts
- `npm start` — start the server
- `npm test` — run integration tests

---


## Key Concepts Demonstrated
- RESTful API design
- Modular routing with Express
- PostgreSQL integration
- Prisma ORM and migrations
- Dynamic query filtering
- Aggregation and grouping logic
- Input validation and error handling
- Cloud-ready backend architecture and environment configuration

---

## Notes
- Data is stored in PostgreSQL, so it persists across server restarts
- Prisma handles database access and schema migrations
- Environment variables are stored in .env and should not be pushed to GitHub

---

## Future Improvements
- Authentication with JWT
- Pagination for larger datasets