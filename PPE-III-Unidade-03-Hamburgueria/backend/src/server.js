import mongoose from 'mongoose';
import app from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => console.log(`API ouvindo na porta ${env.port}`));

mongoose.connect(env.mongoUri).catch((error) => {
  console.error('MongoDB indisponível; rotas de usuários e tarefas aguardam o banco.', error.message);
});
