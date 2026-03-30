const request = require('supertest');
const app = require('../app');
const prisma = require('../lib/prisma');

describe('Finance API', () => {
  beforeEach(async () => {
    await prisma.transaction.deleteMany();
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.$disconnect();
  });

  test('GET / should return health status', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: 'ok',
      service: 'finance-api',
    });
  });

  test('POST /transactions should create a transaction', async () => {
    const res = await request(app)
      .post('/transactions')
      .send({
        amount: 50,
        category: 'groceries',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Transaction created');
    expect(res.body.data.amount).toBe(50);
    expect(res.body.data.category).toBe('groceries');
    expect(res.body.data.id).toBeDefined();
  });

  test('GET /transactions should return all transactions', async () => {
    await request(app).post('/transactions').send({
      amount: 50,
      category: 'groceries',
    });

    await request(app).post('/transactions').send({
      amount: 120,
      category: 'rent',
    });

    const res = await request(app).get('/transactions');

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
    expect(res.body.data).toHaveLength(2);
  });

  test('GET /transactions/:id should return one transaction', async () => {
    const createRes = await request(app).post('/transactions').send({
      amount: 75,
      category: 'gas',
    });

    const id = createRes.body.data.id;

    const res = await request(app).get(`/transactions/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(id);
    expect(res.body.data.category).toBe('gas');
  });

  test('GET /transactions/:id should return 400 for invalid id', async () => {
    const res = await request(app).get('/transactions/not-a-number');

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('id must be a number');
  });

  test('GET /transactions/:id should return 404 for missing transaction', async () => {
    const res = await request(app).get('/transactions/9999');

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('transaction not found');
  });

  // Filtering test
  test('GET /transactions with category filter should return filtered results', async () => {
    await request(app).post('/transactions').send({
      amount: 50,
      category: 'groceries',
    });

    await request(app).post('/transactions').send({
      amount: 100,
      category: 'rent',
    });

    const res = await request(app).get('/transactions?category=groceries');

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].category).toBe('groceries');
  });

  // Total analytics test
  test('GET /transactions/total should return correct total', async () => {
    await request(app).post('/transactions').send({
      amount: 50,
      category: 'groceries',
    });

    await request(app).post('/transactions').send({
      amount: 100,
      category: 'rent',
    });

    const res = await request(app).get('/transactions/total');

    expect(res.statusCode).toBe(200);
    expect(res.body.totalAmount).toBe(150);
  });

  // Group by category test
  test('GET /transactions/by-category should group correctly', async () => {
    await request(app).post('/transactions').send({
      amount: 50,
      category: 'groceries',
    });

    await request(app).post('/transactions').send({
      amount: 30,
      category: 'groceries',
    });

    await request(app).post('/transactions').send({
      amount: 100,
      category: 'rent',
    });

    const res = await request(app).get('/transactions/by-category');

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);

    const groceries = res.body.data.find(c => c.category === 'groceries');
    expect(groceries.total).toBe(80);
  });

});