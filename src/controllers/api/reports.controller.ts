import type { RequestHandler } from 'express';
import { Reports } from '../../repository/reports.repository.js';
import type { RequestHandlerWithBody } from '../../middleware/validation.middleware.js';
import type { createReportSchema } from '../../schema/reports.schema.js';
import { Message } from '../../repository/message.repository.js';

const getReports: RequestHandler = async (req, res) => {
  const reports = await Reports.getAll();

  res.json({
    results: reports
  });
};

const postReport: RequestHandlerWithBody<typeof createReportSchema> = async (
  req,
  res
) => {
  const { description, messageId } = req.body;

  const message = await Message.get(messageId);

  const sourceIP = req.ip;
  const userAgent = req.header('user-agent');
  const userId = res.locals.user?.id;

  if (message !== null) {
    await Reports.createReport(
      messageId,
      description,
      sourceIP,
      userAgent,
      userId
    );
  }

  // Prevent leaking soft-deleted post ids by always returning success
  res.status(201).json({
    message:
      'Thank you for your report! If the message ID is correct, it will be reviewed soon™.'
  });
};

export const reportsController = { getReports, postReport };
