const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const User = require('../src/models/User');
const config = require('../src/config');

let adminToken;
let userToken;

beforeAll(async () => {
  await mongoose.connect(config.mongoUri);
  await User.deleteMany({ email: { $in: ['test-admin@sdrp.test', 'test-user@sdrp.test'] } });

  const hash = await bcrypt.hash('Test@123', 10);
  await User.create({
    name: 'Test Admin',
    email: 'test-admin@sdrp.test',
    password: hash,
    role: 'ADMIN',
    latitude: 14.68,
    longitude: 77.6,
    locationName: 'Test City',
  });
  await User.create({
    name: 'Test User',
    email: 'test-user@sdrp.test',
    password: hash,
    role: 'USER',
    latitude: 14.68,
    longitude: 77.6,
    locationName: 'Test City',
  });

  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test-admin@sdrp.test', password: 'Test@123' });
  adminToken = adminLogin.body.token;

  const userLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test-user@sdrp.test', password: 'Test@123' });
  userToken = userLogin.body.token;
});

afterAll(async () => {
  await User.deleteMany({ email: { $in: ['test-admin@sdrp.test', 'test-user@sdrp.test'] } });
  await mongoose.disconnect();
});

describe('Auth', () => {
  test('registers a user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'New User',
      email: `new-${Date.now()}@sdrp.test`,
      password: 'Test@123',
      role: 'USER',
      latitude: 14.68,
      longitude: 77.6,
      locationName: 'Test City',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  test('logs in', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test-user@sdrp.test', password: 'Test@123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

describe('Authorization', () => {
  test('blocks unauthenticated protected route', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });

  test('blocks user from admin route', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
});

describe('Weather', () => {
  test('returns current weather', async () => {
    const res = await request(app).get('/api/weather/current?lat=14.68&lon=77.6');
    expect(res.status).toBe(200);
    expect(res.body.data.temperature).toBeDefined();
  });
});

describe('Predictions', () => {
  test('creates prediction for authenticated user', async () => {
    const res = await request(app)
      .post('/api/predictions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        latitude: 14.68,
        longitude: 77.6,
        locationName: 'Test City',
      });
    expect([201, 503]).toContain(res.status);
    if (res.status === 201) {
      expect(res.body.data.riskLevel).toBeDefined();
    }
  });
});

describe('Emergencies', () => {
  test('creates emergency report', async () => {
    const res = await request(app)
      .post('/api/emergencies')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        disasterType: 'FLOOD',
        latitude: 14.68,
        longitude: 77.6,
        locationName: 'Test City',
        description: 'Test emergency',
        peopleAffected: 2,
        urgency: 'HIGH',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('PENDING');
  });
});

describe('Sensors', () => {
  test('accepts simulated sensor reading in demo mode', async () => {
    const res = await request(app).post('/api/sensors/readings').send({
      rainfall: 20,
      waterLevel: 1.2,
      humidity: 65,
      temperature: 28,
      latitude: 14.68,
      longitude: 77.6,
      locationName: 'Test City',
      scenario: 'NORMAL',
    });
    expect([201, 503]).toContain(res.status);
    if (res.status === 201) {
      expect(res.body.data.prediction.riskLevel).toBeDefined();
    }
  });
});

describe('Health', () => {
  test('health endpoint works', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
