import request from 'supertest';
import express from 'express';
import { store } from './store.routes';

// Create an express app for testing
const app = express();
app.use(express.json());
app.use('/store', store);

// Mock middleware to always pass
jest.mock('../../common/middlewares/auth', () => ({
  authUser: jest.fn((req, res, next) => next()),
}));

jest.mock('../../common/middlewares/admin.RBAC', () => ({
  adminRBAC: jest.fn((req, res, next) => next()),
}));

// Mock StoreController methods
jest.mock('./store.controller', () => {
  return {
    StoreController: jest.fn().mockImplementation(() => {
      return {
        createStore: jest.fn((req, res) => res.status(201).json({ message: 'Store created' })),
        getStore: jest.fn((req, res) => res.status(200).json({ message: 'Store fetched' })),
        getIventoryByProductId: jest.fn((req, res) =>
          res.status(200).json({ message: 'Store by product fetched' }),
        ),
        updateStore: jest.fn((req, res) => res.status(200).json({ message: 'Store updated' })),
      };
    }),
  };
});

describe('Store Routes', () => {
  it('should create store (POST /store/create)', async () => {
    const response = await request(app)
      .post('/store/create')
      .send({ productId: '123', quantity: 10 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Store created');
  });

  it('should get store (GET /store/:id)', async () => {
    const response = await request(app).get('/store/123');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Store fetched');
  });

  it('should update store (PUT /store/:id)', async () => {
    const response = await request(app).put('/store/123').send({ quantity: 20 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Store updated');
  });
});
