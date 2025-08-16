import { db } from '../db/db.js';
import { messages, users } from '../db/schema.js';
import { and, eq, sql, type SQLWrapper } from 'drizzle-orm';

export interface PublicUser {
  id: number;
  username: string;
  bio: string | null;
  createdAt: Date | null;
}

async function createUser(username: string, bio?: string) {
  const rows = await db
    .insert(users)
    .values({
      username,
      bio
    })
    .returning({ id: users.id });

  const [row] = rows;
  if (!row) {
    throw new Error('User creation failed unexpectedly');
  }

  return row.id;
}

async function exists(username: string) {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(sql`lower(${users.username})`, username.toLowerCase()))
    .limit(1);

  return row !== undefined;
}

async function getByUsername(
  username: string,
  isAdmin?: boolean
): Promise<PublicUser | null> {
  const query = db
    .select({
      id: users.id,
      username: users.username,
      bio: users.bio,
      createdAt: users.createdAt
    })
    .from(users)
    .$dynamic();

  const filters: SQLWrapper[] = [];

  filters.push(eq(users.username, username));

  if (isAdmin) {
    filters.push(eq(users.isAdmin, true));
  }

  query.where(and(...filters));

  const rows = await query;

  return rows[0] ?? null;
}

async function get(
  id: number,
  includeIsAdmin: true
): Promise<{
  isAdmin?: boolean;
  id: number;
  username: string;
  bio: string | null;
  createdAt: Date | null;
} | null>;

async function get(
  id: number,
  includeIsAdmin?: false
): Promise<{
  id: number;
  username: string;
  bio: string | null;
  createdAt: Date | null;
} | null>;

async function get(id: number, includeIsAdmin?: boolean) {
  const query = db
    .select({
      id: users.id,
      username: users.username,
      bio: users.bio,
      createdAt: users.createdAt,
      ...(includeIsAdmin && { isAdmin: users.isAdmin })
    })
    .from(users)
    .where(eq(users.id, id))
    .$dynamic();

  const rows = await query;

  return rows[0] ?? null;
}

async function getAll() {
  return await db
    .select({
      id: users.id,
      username: users.username,
      bio: users.bio,
      createdAt: users.createdAt
    })
    .from(users);
}

async function updateUser(id: number, bio: string | null) {
  await db
    .update(users)
    .set({
      bio
    })
    .where(eq(users.id, id));
}

async function deleteUser(id: number) {
  // Soft delete messages
  await db
    .update(messages)
    .set({
      deleted: true
    })
    .where(eq(messages.authorId, id));
  // Delete user
  await db.delete(users).where(eq(users.id, id));
}

export const User = {
  createUser,
  exists,
  getByUsername,
  get,
  updateUser,
  getAll,
  deleteUser
};
