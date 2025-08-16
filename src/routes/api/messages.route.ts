import express from "express";
import { messagesController } from "../../controllers/api/messages.controller.js";
import { validateData } from "../../middleware/validation-middlware.js";
import { postMessageSchema } from "../../schema/messages.schema.js";

export const messagesRoute = express.Router();

messagesRoute.get("/", messagesController.getMessages);
messagesRoute.post(
  "/",
  express.json(),
  validateData(postMessageSchema),
  messagesController.postMessage
);

messagesRoute.get("/:id", messagesController.getMessage);
messagesRoute.delete("/:id", messagesController.deleteMessage);

