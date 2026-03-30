const express = require('express');
const transactionsRouter = require('./routes/transactions');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'finance-api' });
});

app.use('/transactions', transactionsRouter);

module.exports = app;