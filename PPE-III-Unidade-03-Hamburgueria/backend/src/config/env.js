import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hamburgueria',
  jwtSecret: process.env.JWT_SECRET || 'segredo-apenas-desenvolvimento',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h'
};
