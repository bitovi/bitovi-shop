import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const dbMock = vi.hoisted(() => ({
  getAllProducts: vi.fn(),
  getFeaturedProduct: vi.fn(),
  getProductById: vi.fn(),
}));

vi.mock('../database/db.js', () => dbMock);

const { default: productsRouter } = await import('./products.js');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/products', productsRouter);
  return app;
}

describe('products routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/products returns product list', async () => {
    dbMock.getAllProducts.mockReturnValue([{ id: 1, name: 'Desk' }]);

    const response = await request(createApp()).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, products: [{ id: 1, name: 'Desk' }] });
  });

  it('GET /api/products/featured returns 404 when no featured product exists', async () => {
    dbMock.getFeaturedProduct.mockReturnValue(null);

    const response = await request(createApp()).get('/api/products/featured');

    expect(response.status).toBe(404);
    expect(response.body.ok).toBe(false);
    expect(response.body.error.code).toBe('FEATURED_PRODUCT_NOT_FOUND');
  });

  it('GET /api/products/featured returns featured product when present', async () => {
    dbMock.getFeaturedProduct.mockReturnValue({ id: 3, name: 'Featured Sofa' });

    const response = await request(createApp()).get('/api/products/featured');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ok: true,
      product: { id: 3, name: 'Featured Sofa' },
    });
  });

  it('GET /api/products/:id returns 400 for invalid id', async () => {
    const response = await request(createApp()).get('/api/products/not-a-number');

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_PRODUCT_ID');
  });

  it('GET /api/products/:id returns 404 when product is missing', async () => {
    dbMock.getProductById.mockReturnValue(null);

    const response = await request(createApp()).get('/api/products/42');

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('PRODUCT_NOT_FOUND');
  });

  it('GET /api/products/:id returns product when it exists', async () => {
    dbMock.getProductById.mockReturnValue({ id: 2, name: 'Chair' });

    const response = await request(createApp()).get('/api/products/2');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, product: { id: 2, name: 'Chair' } });
  });
});
