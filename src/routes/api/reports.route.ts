import express from 'express';
import { reportsController } from '../../controllers/api/reports.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { validateData } from '../../middleware/validation.middleware.js';
import { createReportSchema } from '../../schema/reports.schema.js';

export const reportsRoute = express.Router();

reportsRoute.get(
  '/',
  authMiddleware({ adminOnly: true }),
  reportsController.getReports
);

reportsRoute.post(
  '/',
  authMiddleware(),
  express.json(),
  validateData(createReportSchema),
  reportsController.postReport
);
