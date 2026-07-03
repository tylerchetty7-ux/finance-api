# Finance API

A production-style RESTful API for tracking and analyzing financial transactions.

---


## Overview

A production-style RESTful API built to demonstrate backend engineering and cloud deployment skills.

The application provides CRUD operations, transaction analytics, query filtering, automated database migrations with Prisma, integration testing using Jest and Supertest, Docker-based local development, and deployment to Render using a managed PostgreSQL database.

---

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- Docker
- Docker Compose
- Jest
- Supertest
- Render (Cloud Deployment)

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
├── app.js
├── server.js
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
│
├── routes/
│   └── transactions.js
│
├── lib/
│   └── prisma.js
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── tests/
│   └── app.test.js
│
├── prisma.config.ts
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

The API is deployed on Render with a managed PostgreSQL database.

### Architecture

- Backend: Render Web Service
- Database: Render PostgreSQL
- Local development: Docker Compose
- Environment variables are used for secure configuration.

### Production Notes

- Uses the `DATABASE_URL` environment variable.
- Prisma migrations are automatically applied during deployment.

Deployment command:

```bash
npx prisma migrate deploy
```

---

## Docker

The project is fully containerized for local development using Docker Compose.

### Build and start

```bash
docker compose up --build
```

This starts:

- Node.js API container
- PostgreSQL database container

The API will be available at:

```text
http://localhost:3000
```

### Stop the application

```bash
docker compose down
```

### Remove containers and database volume

```bash
docker compose down -v
```

---

## Request flow

```text
                HTTP Client
                     │
                     ▼
             Express Application
                     │
                     ▼
          Express Router (/transactions)
                     │
                     ▼
              Prisma ORM Client
                     │
                     ▼
              PostgreSQL Database
                     │
                     ▼
              JSON Response
```

For local development, the API and PostgreSQL run in separate Docker containers managed by Docker Compose.

In production, the API is deployed as a Render Web Service connected to a managed Render PostgreSQL database.

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

- RESTful API development
- Express routing and middleware
- Modular application architecture
- PostgreSQL database integration
- Prisma ORM and database migrations
- Dynamic query filtering
- Aggregate and group-by database queries
- Input validation and error handling
- Integration testing with Jest and Supertest
- Docker containerization
- Docker Compose orchestration
- Cloud deployment with Render
- Environment variable management

---

## Notes
- Transaction data is persisted in PostgreSQL
- Prisma handles database access and schema migrations
- Environment variables are stored in .env and should not be pushed to GitHub

---

## Future Improvements

- JWT authentication and authorization
- Pagination and sorting
- CI/CD pipeline with GitHub Actions
- AWS deployment (ECS, App Runner, or EC2)
- API documentation with Swagger/OpenAPI
