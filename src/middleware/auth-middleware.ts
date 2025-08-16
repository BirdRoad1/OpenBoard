import type { RequestHandler } from "express";
import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { env } from "../env/env.js";

const jwtKeyBytes = Buffer.from(env.JWT_PRIVATE, "hex");

interface Options {
  adminOnly: boolean;
}

export function authMiddleware(options?: Options): RequestHandler {
  return async (req, res, next) => {
    const header = req.header("authorization");
    if (!header) return next();

    const split = header.split(" ");
    const token = split[1];
    if (token === undefined || split[0]?.toLowerCase() !== "bearer") {
      return res
        .status(400)
        .json({ message: "Only Bearer authentication is supported" });
    }

    let data;
    try {
      data = jwt.verify(token, jwtKeyBytes);
    } catch {
      return res.json({ message: "Invalid token" });
    }

    if (
      typeof data !== "object" ||
      !("id" in data) ||
      typeof data.id !== "number"
    ) {
      return res.status(400).json({ message: "Verification failed" });
    }

    const [user] = await db.select().from(users).where(eq(users.id, data.id));
    if (!user) {
      return res.status(401).json({
        message: "Invalid session",
      });
    }

    if (options?.adminOnly && !user.isAdmin) {
      return res
        .status(401)
        .json({ error: "You are not authorized to access this resource" });
    }

    res.locals.user = user;
    next();
  };
}
