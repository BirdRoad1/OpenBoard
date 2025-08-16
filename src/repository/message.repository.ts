import { and, eq, type SQLWrapper } from "drizzle-orm";
import { db } from "../db/db.js";
import { messages, users } from "../db/schema.js";

async function getAll(authorId?: number, showDeleted?: boolean) {
  const query = db
    .select({
      id: messages.id,
      title: messages.title,
      content: messages.content,
      authorName: users.username,
      authorId: users.id,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .leftJoin(users, eq(users.id, messages.authorId));

  const filters: SQLWrapper[] = [];

  if (authorId !== undefined) {
    filters.push(eq(users.id, authorId));
  }

  if (!showDeleted) {
    filters.push(eq(messages.deleted, false));
  }

  query.where(and(...filters));

  return await query;
}

async function get(id: number, authorId?: number, showDeleted?: boolean) {
  const query = db
    .select({
      id: messages.id,
      title: messages.title,
      content: messages.content,
      authorName: users.username,
      authorId: users.id,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .leftJoin(users, eq(users.id, messages.authorId))
    .$dynamic();

  const filters: SQLWrapper[] = [];

  filters.push(eq(messages.id, id));

  if (authorId !== undefined) {
    filters.push(eq(users.id, authorId));
  }

  if (!showDeleted) {
    filters.push(eq(messages.deleted, false));
  }

  query.where(and(...filters));

  const [msg] = await query;

  return msg ?? null;
}

async function deleteMessage(id: number) {
  await db
    .update(messages)
    .set({
      deleted: true,
    })
    .where(eq(messages.id, id));
}

async function create(title?: string, content?: string, authorId?: number) {
  const rows = await db
    .insert(messages)
    .values({
      title,
      content,
      authorId,
    })
    .returning({ id: messages.id });

  const [row] = rows;
  if (!row) {
    throw new Error("Failed to create message");
  }

  return row.id;
}

export const Message = {
  getAll,
  get,
  deleteMessage,
  create,
};
