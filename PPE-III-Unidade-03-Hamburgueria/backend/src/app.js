import express from 'express';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();
app.use(express.json());
app.get('/health', (request, response) => response.status(200).json({ status: 'ok' }));
app.get('/api/menu', (request, response) => response.json([
	{ id: 1, name: 'X-Burger', price: 24.9 },
	{ id: 2, name: 'X-Bacon', price: 29.9 },
	{ id: 3, name: 'Veggie Melt', price: 27.9 }
]));
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use((request, response) => response.status(404).json({ error: 'Rota não encontrada' }));
app.use(errorMiddleware);

export default app;
