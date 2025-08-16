import type { RequestHandler } from "express";
import type { RequestHandlerWithBody } from "../../middleware/validation.middleware.js";
import type { postMessageSchema } from "../../schema/messages.schema.js";
import { Message } from "../../repository/message.repository.js";

const getMessages: RequestHandler = async (req, res) => {
  let authorId: number | undefined;
  if (typeof req.query.authorId === "string") {
    const converted = Number(req.query.authorId);
    if (!Number.isFinite(converted)) {
      return res.status(400).json({ message: "Invalid author id" });
    }

    authorId = converted;
  }

  const results = await Message.getAll(authorId);

  res.json({ results });
};

const deleteMessage: RequestHandlerWithBody = async (req, res) => {
  const idStr = req.params.id;
  let id;
  if (typeof idStr !== "string" || !Number.isFinite((id = Number(idStr)))) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const msg = await Message.get(id);
  if (!msg) {
    return res.status(404).json({ message: "Message not found" });
  }

  if (
    !res.locals.user ||
    (!res.locals.user.isAdmin &&
      (msg.authorId === null || res.locals.user.id !== msg.authorId))
  ) {
    return res
      .status(403)
      .json({ message: "You do not have permission to delete this message" });
  }

  await Message.deleteMessage(id);

  res.status(200).json({});
};

const getMessage: RequestHandler = async (req, res) => {
  const idStr = req.params.id;
  let id;
  if (typeof idStr !== "string" || !Number.isFinite((id = Number(idStr)))) {
    return res.status(400).json({ message: "Invalid id" });
  }

  let authorId: number | undefined;
  if ("authorId" in req.query && typeof req.query.authorId === "string") {
    const converted = Number(req.query.authorId);
    if (!Number.isFinite(converted)) {
      return res.status(400).json({ message: "Invalid authorId" });
    }

    authorId = converted;
  }

  const message = await Message.get(id, authorId);

  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  res.json(message);
};

const postMessage: RequestHandlerWithBody<typeof postMessageSchema> = async (
  req,
  res
) => {
  return res.status(201).json({
    id: await Message.create(
      req.body.title,
      req.body.content,
      res.locals.user?.id
    ),
  });
};

export const messagesController = {
  getMessages,
  getMessage,
  deleteMessage,
  postMessage,
};
