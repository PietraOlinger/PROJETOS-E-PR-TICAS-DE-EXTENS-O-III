import { loginUser, registerUser } from '../services/userService.js';

export async function register(request, response) {
  response.status(201).json(await registerUser(request.body));
}

export async function login(request, response) {
  response.status(200).json(await loginUser(request.body));
}
