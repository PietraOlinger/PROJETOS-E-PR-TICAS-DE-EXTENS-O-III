import { jest } from '@jest/globals';

const findOne = jest.fn();
const create = jest.fn();
const hash = jest.fn();
const compare = jest.fn();
const sign = jest.fn();

jest.unstable_mockModule('../../src/models/User.js', () => ({ default: { findOne, create } }));
jest.unstable_mockModule('bcrypt', () => ({ default: { hash, compare } }));
jest.unstable_mockModule('jsonwebtoken', () => ({ default: { sign } }));

const { registerUser, loginUser } = await import('../../src/services/userService.js');

describe('userService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('cadastra usuário normalizando e-mail e aplicando hash', async () => {
    findOne.mockResolvedValue(null);
    hash.mockResolvedValue('hash-seguro');
    create.mockResolvedValue({ _id: { toString: () => 'u1' }, name: 'Maria', email: 'maria@example.com' });
    await expect(registerUser({ name: ' Maria ', email: ' MARIA@EXAMPLE.COM ', password: 'senha123' })).resolves.toEqual({ id: 'u1', name: 'Maria', email: 'maria@example.com' });
    expect(hash).toHaveBeenCalledWith('senha123', 10);
  });

  test('recusa dados obrigatórios ausentes', async () => {
    await expect(registerUser({ name: '', email: '', password: '' })).rejects.toMatchObject({ statusCode: 400 });
  });

  test('recusa e-mail duplicado', async () => {
    findOne.mockResolvedValue({ _id: 'existente' });
    await expect(registerUser({ name: 'Maria', email: 'maria@example.com', password: 'senha123' })).rejects.toMatchObject({ statusCode: 409 });
  });

  test('recusa senha curta e login incompleto', async () => {
    await expect(registerUser({ name: 'Maria', email: 'maria@example.com', password: '123' })).rejects.toMatchObject({ statusCode: 400 });
    await expect(loginUser({ email: '', password: 'senha123' })).rejects.toMatchObject({ statusCode: 400 });
  });

  test('realiza login e gera JWT', async () => {
    findOne.mockResolvedValue({ _id: { toString: () => 'u1' }, email: 'maria@example.com', passwordHash: 'hash' });
    compare.mockResolvedValue(true);
    sign.mockReturnValue('jwt-token');
    await expect(loginUser({ email: 'maria@example.com', password: 'senha123' })).resolves.toEqual({ token: 'jwt-token', tokenType: 'Bearer' });
  });

  test('recusa senha incorreta', async () => {
    findOne.mockResolvedValue({ _id: 'u1', email: 'maria@example.com', passwordHash: 'hash' });
    compare.mockResolvedValue(false);
    await expect(loginUser({ email: 'maria@example.com', password: 'errada' })).rejects.toMatchObject({ statusCode: 401 });
  });

  test('recusa usuário inexistente', async () => {
    findOne.mockResolvedValue(null);
    await expect(loginUser({ email: 'x@example.com', password: 'errada' })).rejects.toMatchObject({ statusCode: 401 });
  });
});
