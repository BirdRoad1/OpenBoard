import express from 'express';
import { usersController } from '../../controllers/api/users.controller.js';
import { validateData } from '../../middleware/validation.middleware.js';
import { editUserSchema, postUserSchema } from '../../schema/users.schema.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const usersRoute = express.Router();

usersRoute.get('/', usersController.getUsers);
usersRoute.post(
  '/',
  express.json(),
  validateData(postUserSchema),
  usersController.postUser
);

usersRoute.put(
  '/:id',
  authMiddleware({ requiresLogIn: true }),
  express.json(),
  validateData(editUserSchema),
  usersController.editUser
);

usersRoute.delete(
  '/:id',
  authMiddleware({ requiresLogIn: true }),
  usersController.deleteUser
);
