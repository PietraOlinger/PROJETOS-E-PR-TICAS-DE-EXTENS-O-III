import mongoose from 'mongoose';
import Task from '../models/Task.js';
import AppError from '../utils/AppError.js';

function ensureValidId(id) {
  if (!mongoose.isValidObjectId(id)) throw new AppError('Identificador de tarefa inválido', 400);
}

export async function listTasks(userId) {
  return Task.find({ user: userId }).sort({ createdAt: -1 });
}

export async function createTask(userId, { title, done = false }) {
  if (!title || title.trim().length < 2) throw new AppError('Título deve possuir ao menos 2 caracteres', 400);
  return Task.create({ user: userId, title: title.trim(), done: Boolean(done) });
}

export async function updateTask(userId, taskId, data) {
  ensureValidId(taskId);
  const update = {};
  if (data.title !== undefined) {
    if (!data.title || data.title.trim().length < 2) throw new AppError('Título deve possuir ao menos 2 caracteres', 400);
    update.title = data.title.trim();
  }
  if (data.done !== undefined) update.done = Boolean(data.done);
  if (Object.keys(update).length === 0) throw new AppError('Informe título ou situação para atualizar', 400);
  const task = await Task.findOneAndUpdate({ _id: taskId, user: userId }, update, { new: true, runValidators: true });
  if (!task) throw new AppError('Tarefa não encontrada', 404);
  return task;
}

export async function deleteTask(userId, taskId) {
  ensureValidId(taskId);
  const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
  if (!task) throw new AppError('Tarefa não encontrada', 404);
  return task;
}
