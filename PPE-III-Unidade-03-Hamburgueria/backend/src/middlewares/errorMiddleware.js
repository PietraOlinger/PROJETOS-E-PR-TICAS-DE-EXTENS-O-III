import AppError from '../utils/AppError.js';

export default function errorMiddleware(error, request, response, next) {
  if (error instanceof AppError) return response.status(error.statusCode).json({ error: error.message });
  if (error?.code === 11000) return response.status(409).json({ error: 'Registro duplicado' });
  console.error(error);
  return response.status(500).json({ error: 'Erro interno do servidor' });
}
