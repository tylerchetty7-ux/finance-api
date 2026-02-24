# Finance API
A RESTful backend API built with Node.js and Express for managing financial transactions.
The project demonstrates RESTful API design, full CRUD operations, modular route architecture, input validation, and proper HTTP status handling.

## Tech Stack
* Node.js
* Express
* JavaScript (CommonJS)
* In-memory data storage (for development)

## Features
* Create transactions
* Retrieve all transactions
* Retrieve a transaction by ID
* Update transactions
* Delete transactions
* Input validation
* Proper HTTP status codes
* Modular route architecture

## Project Structure

```bash
finance-api/
│
├── server.js
├── routes/
│   └── transactions.js
└── package.json
```
* server.js handles application setup and router mounting.
* routes/transactions.js contains all transaction-related endpoints.

## Getting Started

### 1. Install dependencies
npm install

### 2. Run the server
node server.js

Server runs on:
http://localhost:3000

## Development Notes

- Data is currently stored in memory and resets when the server restarts.
- Designed to be extended with persistent storage (PostgreSQL) and authentication.


