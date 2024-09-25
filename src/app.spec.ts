import request from 'supertest';
import { createApp } from './app';
import { Application } from 'express';

// Mocking dependencies if needed
jest.mock('./common/middlewares/error_handler', () => ({
  errorHandler: jest.fn((err: Error, req: any, res: any, next: any) => {
    res.status(500).send('Error occurred');
  }),
}));

jest.mock('.', () => ({
  router: jest.fn((req: any, res: any) => {
    res.status(200).send('API working');
  }),
}));

describe('createApp', () => {
  let app: Application;

  beforeAll(() => {
    app = createApp();
  });

  test('should return 200 OK with "Hello, Mainstack!" for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, Mainstack!');
  });

  test('should route to /api/v1 and return 200 OK', async () => {
    const response = await request(app).get('/api/v1');
    expect(response.status).toBe(200);
    expect(response.text).toBe('API working');
  });

  test('should handle 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
  });

  test('should use helmet middleware for security headers', async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-dns-prefetch-control']).toBe('off');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['strict-transport-security']).toContain('max-age');
  });

  test('should use cors middleware with correct headers', async () => {
    const response = await request(app).get('/');
    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  test('should handle errors with errorHandler middleware', async () => {
    const response = await request(app).get('/cause-error');
    expect(response.status).toBe(404);
    expect(response.text).toBe('Error occurred');
  });
});
