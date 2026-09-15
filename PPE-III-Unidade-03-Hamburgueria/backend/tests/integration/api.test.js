import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';
import app from '../../src/app.js';
import { validUser } from '../fixtures/users.js';

jest.setTimeout(30000);

let mongo;
let token;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});
afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
afterEach(async () => {
  for (const collection of Object.values(mongoose.connection.collections)) await collection.deleteMany({});
});

async function authenticatedUser() {
  await request(app).post('/users/register').send(validUser).expect(201);
  const response = await request(app).post('/users/login').send({ email: validUser.email, password: validUser.password }).expect(200);
  token = response.body.token;
}

describe('API Hamburgueria', () => {
  test('GET /health retorna status da API', async () => {
    await request(app).get('/health').expect(200).expect({ status: 'ok' });
  });

  test('realiza cadastro e login', async () => {
    await request(app).post('/users/register').send(validUser).expect(201);
    const response = await request(app).post('/users/login').send(validUser).expect(200);
    expect(response.body.token).toBeDefined();
  });

  test('realiza CRUD protegido de tarefas', async () => {
    await authenticatedUser();
    const created = await request(app).post('/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Preparar hambúrguer' }).expect(201);
    await request(app).get('/tasks').set('Authorization', `Bearer ${token}`).expect(200);
    await request(app).put(`/tasks/${created.body._id}`).set('Authorization', `Bearer ${token}`).send({ done: true }).expect(200);
    await request(app).delete(`/tasks/${created.body._id}`).set('Authorization', `Bearer ${token}`).expect(204);
  });

  test('valida cadastro, tarefa e token inválido', async () => {
    await request(app).post('/users/register').send({ name: 'Maria' }).expect(400);
    await authenticatedUser();
    await request(app).post('/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'A' }).expect(400);
    await request(app).get('/tasks').set('Authorization', 'Bearer token-invalido').expect(401);
  });

  test('bloqueia rota sem token', async () => {
    await request(app).get('/tasks').expect(401);
  });

  test('retorna 404 para rota inexistente', async () => {
    await request(app).get('/rota-inexistente').expect(404);
  });
});
