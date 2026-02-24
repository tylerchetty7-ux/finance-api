const express = require('express'); // initialize Express
const router = express.Router(); // create a new router instance

// in-memory storage (resets whenever the server restarts)
const transactions = [];
let nextId = 1;

/*
    GET /transactions
*/
router.get('/', (req, res) => {
  return res.json({
    count: transactions.length,
    data: transactions,
  });
});

/*
    GET /transactions/:id
    Returns one transaction by id
*/
router.get('/:id', (req, res) => {
  const id = Number(req.params.id); // convert id from string to number

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  const found = transactions.find(t => t.id === id);

  if (!found) {
    return res.status(404).json({ error: 'transaction not found' });
  }

  return res.json({ data: found });
});

/*
    POST /transactions
    Creates a new transaction
*/
router.post('/', (req, res) => {
  const { amount, category } = req.body;

  // validation
  if (amount === undefined || category === undefined) {
    return res.status(400).json({ error: 'amount and category are required' });
  }

  if (typeof amount !== 'number') {
    return res.status(400).json({ error: 'amount must be a number' });
  }

  if (typeof category !== 'string' || category.trim() === '') {
    return res.status(400).json({ error: 'category must be a non-empty string' });
  }

  // create new transaction object
  const newTransaction = {
    id: nextId,
    amount,
    category: category.trim(),
    createdAt: new Date().toISOString(),
  };

  transactions.push(newTransaction); // add the new transaction to the in-memory array
  nextId += 1;

  return res.status(201).json({
    message: 'Transaction created',
    data: newTransaction,
  });
});

/*
    PUT /transactions/:id
    Updates an existing transaction (partial update allowed)
*/
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);

  // validation
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  const found = transactions.find(t => t.id === id);
  if (!found) {
    return res.status(404).json({ error: 'transaction not found' });
  }

  const { amount, category } = req.body;

  // if amount is provided, it must be a number
  if (amount !== undefined && typeof amount !== 'number') {
    return res.status(400).json({ error: 'amount must be a number' });
  }

  // if category is provided, it must be a non-empty string
  if (category !== undefined && (typeof category !== 'string' || category.trim() === '')) {
    return res.status(400).json({ error: 'category must be a non-empty string' });
  }

  // update the transaction with the provided fields
  if (amount !== undefined) found.amount = amount;
  if (category !== undefined) found.category = category.trim();

  found.updatedAt = new Date().toISOString(); 

  return res.json({
    message: 'transaction updated',
    data: found,
  });
});

/*
    DELETE /transactions/:id
    Deletes a transaction
*/
router.delete('/:id', (req, res) => {
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

module.exports = router; // export the router to be used in server.js