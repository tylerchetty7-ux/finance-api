const express = require('express'); // initialize Express
const transactionsRouter = require('./routes/transactions'); // variable to hold the transactions router module

// store Express in a variable and set the port
const app = express(); 
const PORT = 3000;

app.use(express.json()); // middleware to parse JSON bodies

// simple health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'finance-api' });
});

// mount the transactions router at /transactions
app.use('/transactions', transactionsRouter);

// start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});