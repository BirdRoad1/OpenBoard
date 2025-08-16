import express from 'express';
import { messagesRoute } from './messages.route.js';
import { usersRoute } from './users.route.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { reportsRoute } from './reports.route.js';

export const apiRoute = express.Router();

apiRoute.use(authMiddleware());

apiRoute.use('/messages', messagesRoute);

apiRoute.use('/users', usersRoute);

apiRoute.use('/reports', reportsRoute);
