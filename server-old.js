// initialize Express
const express = require('express');

// store Express in a variable and set the port
const app = express();
const PORT = 3000;

// in-memory storage (resets whenever the server restarts)
const transactions = [];
let nextId = 1;

// middleware to parse JSON bodies
app.use(express.json());

// define root route
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'finance-api' });
});

// example route to test the server
app.get('/hello', (req, res) => {
    res.json({ message: 'hello world' });
});

// route to handle incoming transactions
app.post('/transactions', (req, res) => {
  const { amount, category } = req.body; // destructure amount and category from the request body

  // Validation
  if (amount === undefined || category === undefined) { // validate that both amount and category are provided
    return res.status(400).json({ error: 'amount and category are required' });
  }
  if (typeof amount !== 'number') { // validate that amount is a number
    return res.status(400).json({ error: 'amount must be a number' });
  }
  if (typeof category !== 'string' || category.trim() === '') { // validate that category is a non-empty string
    return res.status(400).json({ error: 'category must be a non-empty string' });
  }

  // Create a new transaction object
  const newTransaction = {
    id: nextId,
    amount,
    category: category.trim(),
    createdAt: new Date().toISOString(), // store the creation time as an ISO string
  };

  // Update our "database"
  transactions.push(newTransaction); // add the new transaction to in-memory array
  nextId += 1; // increment the ID for the next transaction

  console.log('Stored transaction:', newTransaction); 

  return res.status(201).json({ // respond with the created transaction
    message: 'Transaction created',
    data: newTransaction,
  });
});

// route to retrieve all transactions
app.get('/transactions', (req, res) => {
  return res.json({
    count: transactions.length,
    data: transactions,
  });
});

// route to retrieve a specific transaction by ID
app.get('/transactions/:id', (req, res) => {
  const id = Number(req.params.id); // convert the id from the URL parameter to a number

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  const found = transactions.find(t => t.id === id); // search for the transaction with the specified ID

  if (!found) {
    return res.status(404).json({ error: 'transaction not found' });
  }

  return res.json({ data: found });
});

// route to update a transaction by ID
app.put('/transactions/:id', (req, res) => {
  const id = Number(req.params.id); // convert the id from the URL parameter to a number

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  const found = transactions.find(t => t.id === id);
  if (!found) {
    return res.status(404).json({ error: 'transaction not found' });
  }

  const { amount, category } = req.body;

  // we allow partial updates: you can send only amount, only category, or both.
  if (amount !== undefined && typeof amount !== 'number') {
    return res.status(400).json({ error: 'amount must be a number' });
  }

  if (category !== undefined && (typeof category !== 'string' || category.trim() === '')) { // check if category is provided and is a non-empty string
    return res.status(400).json({ error: 'category must be a non-empty string' });
  }

  // Apply updates only if provided
  if (amount !== undefined) found.amount = amount;
  if (category !== undefined) found.category = category.trim();

  found.updatedAt = new Date().toISOString();

  return res.json({
    message: 'transaction updated',
    data: found,
  });
});

// route to delete a transaction by ID
app.delete('/transactions/:id', (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  const index = transactions.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'transaction not found' });
  }

  const deleted = transactions.splice(index, 1)[0];

  return res.json({
    message: 'transaction deleted',
    data: deleted,
  });
});

// start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});