import { db } from '../db/db.js';
import { reports, users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

async function createReport(
  messageId: number,
  description: string,
  sourceIP?: string,
  sourceUserAgent?: string,
  sourceUserId?: number
) {
  const [row] = await db
    .insert(reports)
    .values({
      messageId,
      description,
      sourceIP,
      sourceUserAgent,
      sourceUserId
    })
    .returning({ id: reports.id });
  if (!row) {
    throw new Error('Failed to create report');
  }

  return row.id;
}

async function getAll() {
  const rows = await db
    .select({
      id: reports.id,
      messageId: reports.messageId,
      description: reports.description,
      sourceIP: reports.sourceIP,
      sourceUserAgent: reports.sourceUserAgent,
      sourceUserId: reports.sourceUserId,
      sourceUserName: users.username,
      createdAt: reports.createdAt
    })
    .from(reports)
    .leftJoin(users, eq(users.id, reports.sourceUserId));

  return rows;
}

export const Reports = { createReport, getAll };
