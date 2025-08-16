import express from 'express';
import { reportsController } from '../../controllers/api/reports.controller.js';
import { authMiddleware } from '../../middleware/auth-middleware.js';

export const reportsRoute = express.Router();

reportsRoute.use(authMiddleware({ adminOnly: true }));

reportsRoute.get('/', reportsController.getReports);
// TODO: post report
// reportsRoute.post(
//   "/",
//   express.json(),
//   validateData(postUserSchema),
//   reportsController.postUser
// );
