import type { RequestHandler } from "express";
import { Reports } from "../../repository/reports.repository.js";

const getReports: RequestHandler = async (req, res) => {
  const reports = await Reports.getAll();

  res.json({
    results: reports,
  });
};

export const reportsController = {getReports};
