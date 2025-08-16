import type { RequestHandler } from "express";
import type { RequestHandlerWithBody } from "../../middleware/validation-middlware.js";
import type {
  editUserSchema,
  postUserSchema,
} from "../../schema/users.schema.js";
import jwt from "jsonwebtoken";
import { env } from "../../env/env.js";
import crypto from "crypto";
import { User } from "../../repository/user.repository.js";

const getUsers: RequestHandler = async (req, res) => {
  const results = await User.getAll();

  res.json({
    results,
  });
};

const postUser: RequestHandlerWithBody<typeof postUserSchema> = async (
  req,
  res
) => {
  if ("adminToken" in req.body) {
    // Admin login
    const { username, adminToken } = req.body;
    const adminUser = await User.getByUsername(username, true);

    if (!adminUser) {
      return res
        .status(500)
        .json({ message: "The specified admin user does not exist" });
    }

    if (
      adminToken.length !== env.ADMIN_TOKEN.length ||
      !crypto.timingSafeEqual(
        Buffer.from(adminToken, "utf-8"),
        Buffer.from(env.ADMIN_TOKEN, "utf-8")
      )
    ) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    const token = jwt.sign(
      {
        id: adminUser.id,
      },
      Buffer.from(env.JWT_PRIVATE, "hex"),
      {
        expiresIn: "10 mins",
      }
    );

    return res.json({ id: adminUser.id, token });
  }

  const { username, bio } = req.body;

  if (await User.exists(username)) {
    return res
      .status(409)
      .json({ message: "The requested username is already in use" });
  }

  const id = await User.createUser(username, bio);

  const token = jwt.sign(
    {
      id,
    },
    Buffer.from(env.JWT_PRIVATE, "hex")
  );

  return res.status(201).json({
    id,
    token,
  });
};

const editUser: RequestHandlerWithBody<typeof editUserSchema> = async (
  req,
  res
) => {
  const idStr = req.params.id;
  let id;
  if (typeof idStr !== "string" || !Number.isFinite((id = Number(idStr)))) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const user = await User.get(id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (
    !res.locals.user ||
    (!res.locals.user.isAdmin && res.locals.user.id !== user.id)
  ) {
    return res
      .status(403)
      .json({ message: "You do not have permission to perform this action" });
  }

  await User.updateUser(user.id, req.body.bio);

  return res.json({});
};

const deleteUser: RequestHandler = async (req, res) => {
  const idStr = req.params.id;
  let id;
  if (typeof idStr !== "string" || !Number.isFinite((id = Number(idStr)))) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const user = await User.get(id, true);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (
    !res.locals.user ||
    (!res.locals.user.isAdmin && res.locals.user.id !== user.id)
  ) {
    return res
      .status(403)
      .json({ message: "You do not have permission to perform this action" });
  }

  if (user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Admin accounts cannot be deleted" });
  }

  await User.deleteUser(id);
  res.json({});
};

export const usersController = { getUsers, postUser, editUser, deleteUser };
