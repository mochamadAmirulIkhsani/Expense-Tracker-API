import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Expense Tracker E2E', () => {
  let app: INestApplication;
  let token: string;
  let testEmail = `test_${Date.now()}@mail.com`;

  let categoryId: number;
  let transactionId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('REGISTER user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: '123456',
          name: 'Test User',
        });
      expect(res.status).toBe(201);
    });

    it('LOGIN user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: '123456',
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('access_token');
      token = res.body.access_token;
    });

    it('GET profile (protected)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe('Categories', () => {
    it('POST /categories - Create a category', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Food & Beverage',
          type: 'EXPENSE',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      categoryId = res.body.id;
    });

    it('GET /categories - Get all categories', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/categories')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('GET /categories/:id - Get specific category', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(categoryId);
    });

    it('PATCH /categories/:id - Update a category', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Food & Drink Updated',
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Food & Drink Updated');
    });
  });

  describe('Transactions', () => {
    it('POST /transactions - Create a transaction', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Makan Siang',
          amount: 50000,
          description: 'Lunch',
          categoryId: categoryId,
          type: 'EXPENSE', 
          date: new Date().toISOString(),
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      transactionId = res.body.id;
    });

    it('GET /transactions - Get all transactions', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('GET /transactions/:id - Get specific transaction', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(transactionId);
    });

    it('PATCH /transactions/:id - Update a transaction', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 75000,
          description: 'Lunch & Coffee',
        });

      expect(res.status).toBe(200);
      expect(res.body.amount).toBe(75000);
    });

    it('DELETE /transactions/:id - Delete a transaction', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });

  describe('Cleanup', () => {
    it('DELETE /categories/:id - Delete the category after transactions are cleared', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });
});