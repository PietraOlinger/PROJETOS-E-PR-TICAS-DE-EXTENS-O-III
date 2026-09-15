import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { env } from '../config/env.js';

export async function registerUser({ name, email, password }) {
  if (!name || !email || !password) throw new AppError('Nome, e-mail e senha são obrigatórios', 400);
  if (password.length < 6) throw new AppError('A senha deve possuir ao menos 6 caracteres', 400);
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.findOne({ email: normalizedEmail })) throw new AppError('E-mail já cadastrado', 409);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash: await bcrypt.hash(password, 10) });
  return { id: user._id.toString(), name: user.name, email: user.email };
}

export async function loginUser({ email, password }) {
  if (!email || !password) throw new AppError('E-mail e senha são obrigatórios', 400);
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError('Credenciais inválidas', 401);
  return { token: jwt.sign({ sub: user._id.toString(), email: user.email }, env.jwtSecret, { expiresIn: env.jwtExpiresIn }), tokenType: 'Bearer' };
}
