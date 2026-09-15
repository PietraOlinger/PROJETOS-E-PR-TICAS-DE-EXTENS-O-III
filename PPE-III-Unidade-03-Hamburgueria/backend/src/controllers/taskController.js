import { createTask, deleteTask, listTasks, updateTask } from '../services/taskService.js';

export async function index(request, response) {
  response.status(200).json(await listTasks(request.user.id));
}

export async function create(request, response) {
  response.status(201).json(await createTask(request.user.id, request.body));
}

export async function update(request, response) {
  response.status(200).json(await updateTask(request.user.id, request.params.id, request.body));
}

export async function remove(request, response) {
  await deleteTask(request.user.id, request.params.id);
  response.status(204).send();
}
