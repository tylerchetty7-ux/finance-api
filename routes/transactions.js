const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

/*
    GET /transactions
*/
router.get('/', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { id: 'asc' },
    });

    return res.json({
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({ error: 'failed to fetch transactions' });
  }
});

/*
    GET /transactions/:id
*/
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'id must be a number' });
    }

    const found = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!found) {
      return res.status(404).json({ error: 'transaction not found' });
    }

    return res.json({ data: found });
  } catch (error) {
    return res.status(500).json({ error: 'failed to fetch transaction' });
  }
});

/*
    POST /transactions
*/
router.post('/', async (req, res) => {
  try {
    const { amount, category } = req.body;

    if (amount === undefined || category === undefined) {
      return res.status(400).json({ error: 'amount and category are required' });
    }

    if (typeof amount !== 'number') {
      return res.status(400).json({ error: 'amount must be a number' });
    }

    if (typeof category !== 'string' || category.trim() === '') {
      return res.status(400).json({ error: 'category must be a non-empty string' });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        amount,
        category: category.trim(),
      },
    });

    return res.status(201).json({
      message: 'Transaction created',
      data: newTransaction,
    });
  } catch (error) {
    return res.status(500).json({ error: 'failed to create transaction' });
  }
});

/*
    PUT /transactions/:id
*/
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'id must be a number' });
    }

    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'transaction not found' });
    }

    const { amount, category } = req.body;

    if (amount !== undefined && typeof amount !== 'number') {
      return res.status(400).json({ error: 'amount must be a number' });
    }

    if (category !== undefined && (typeof category !== 'string' || category.trim() === '')) {
      return res.status(400).json({ error: 'category must be a non-empty string' });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...(amount !== undefined ? { amount } : {}),
        ...(category !== undefined ? { category: category.trim() } : {}),
      },
    });

    return res.json({
      message: 'transaction updated',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ error: 'failed to update transaction' });
  }
});

/*
    DELETE /transactions/:id
*/
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'id must be a number' });
    }

    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'transaction not found' });
    }

    const deleted = await prisma.transaction.delete({
      where: { id },
    });

    return res.json({
      message: 'transaction deleted',
      data: deleted,
    });
  } catch (error) {
    return res.status(500).json({ error: 'failed to delete transaction' });
  }
});

module.exports = router;