process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-only-jwt-secret-not-for-production';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/jobconnect-test';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../app');

const app = createApp();

describe('JobConnect API basics', () => {
  it('returns a health check', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });

  it('rejects registration with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'not-an-email' });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(Array.isArray(res.body.errors));
  });

  it('rejects protected profile requests without a token', async () => {
    const res = await request(app).get('/api/users/profile');
    assert.equal(res.status, 401);
  });

  it('rejects admin routes without a token', async () => {
    const res = await request(app).get('/api/admin/stats');
    assert.equal(res.status, 401);
  });

  it('rejects posting a job without authentication', async () => {
    const res = await request(app).post('/api/jobs').send({ title: 'Test' });
    assert.equal(res.status, 401);
  });

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/does-not-exist');
    assert.equal(res.status, 404);
  });
});
