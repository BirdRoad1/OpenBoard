// Seed admin user

import { count, eq } from "drizzle-orm";
import { db } from "../src/db/db.js";
import { users } from "../src/db/schema.js";
import { env } from "../src/env/env.js";

const name = process.env.ADMIN_NAME;

if (!name) {
  console.log("Missing ADMIN_NAME");
  process.exit(1);
}

const cnt =
  (
    await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.username, env.ADMIN_NAME))
  )[0]?.count ?? 0;

if (cnt > 0) {
  console.log(`User ${name} already exists!`)
  process.exit(0);
}

await db.insert(users).values({
  username: env.ADMIN_NAME,
  isAdmin: true,
});

process.exit(0);
