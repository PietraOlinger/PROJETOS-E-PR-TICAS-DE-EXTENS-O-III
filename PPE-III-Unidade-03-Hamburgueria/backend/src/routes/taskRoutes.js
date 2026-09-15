import { Router } from 'express';
import { create, index, remove, update } from '../controllers/taskController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
router.use(authMiddleware);
router.get('/', asyncHandler(index));
router.post('/', asyncHandler(create));
router.put('/:id', asyncHandler(update));
router.delete('/:id', asyncHandler(remove));

export default router;
