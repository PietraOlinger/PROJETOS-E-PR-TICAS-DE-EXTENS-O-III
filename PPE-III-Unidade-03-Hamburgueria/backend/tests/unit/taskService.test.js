import { jest } from '@jest/globals';

const create = jest.fn();
const findOneAndUpdate = jest.fn();
const findOneAndDelete = jest.fn();
const sort = jest.fn();
const find = jest.fn(() => ({ sort }));

jest.unstable_mockModule('../../src/models/Task.js', () => ({ default: { create, find, findOneAndUpdate, findOneAndDelete } }));
const { createTask, deleteTask, listTasks, updateTask } = await import('../../src/services/taskService.js');

describe('taskService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('lista somente tarefas do usuário', async () => {
    sort.mockResolvedValue([{ title: 'Preparar hambúrguer' }]);
    await listTasks('507f1f77bcf86cd799439011');
    expect(find).toHaveBeenCalledWith({ user: '507f1f77bcf86cd799439011' });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  test('cria tarefa válida', async () => {
    create.mockResolvedValue({ title: 'Preparar hambúrguer', done: false });
    await createTask('507f1f77bcf86cd799439011', { title: ' Preparar hambúrguer ' });
    expect(create).toHaveBeenCalled();
  });

  test('recusa título inválido', async () => {
    await expect(createTask('507f1f77bcf86cd799439011', { title: 'A' })).rejects.toMatchObject({ statusCode: 400 });
  });

  test('recusa atualização inválida ou vazia', async () => {
    await expect(updateTask('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012', {})).rejects.toMatchObject({ statusCode: 400 });
    await expect(updateTask('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012', { title: 'A' })).rejects.toMatchObject({ statusCode: 400 });
  });

  test('atualiza situação da tarefa', async () => {
    findOneAndUpdate.mockResolvedValue({ done: true });
    await expect(updateTask('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012', { done: true })).resolves.toMatchObject({ done: true });
  });

  test('remove tarefa existente', async () => {
    findOneAndDelete.mockResolvedValue({ _id: '507f1f77bcf86cd799439012' });
    await expect(deleteTask('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012')).resolves.toBeTruthy();
  });

  test('recusa ids inválidos e tarefas inexistentes', async () => {
    await expect(updateTask('usuario', 'id-invalido', { done: true })).rejects.toMatchObject({ statusCode: 400 });
    findOneAndUpdate.mockResolvedValue(null);
    await expect(updateTask('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012', { done: true })).rejects.toMatchObject({ statusCode: 404 });
    findOneAndDelete.mockResolvedValue(null);
    await expect(deleteTask('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012')).rejects.toMatchObject({ statusCode: 404 });
  });
});
