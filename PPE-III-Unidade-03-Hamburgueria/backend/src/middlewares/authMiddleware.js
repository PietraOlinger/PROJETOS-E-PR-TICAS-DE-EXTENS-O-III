import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import { env } from '../config/env.js';

export default function authMiddleware(request, response, next) {
  const authorization = request.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AppError('Token de autenticação ausente', 401));
  }
  try {
    const payload = jwt.verify(authorization.slice(7), env.jwtSecret);
    request.user = { id: payload.sub, email: payload.email };
    return next();
  } catch {
    return next(new AppError('Token inválido ou expirado', 401));
  }
}
