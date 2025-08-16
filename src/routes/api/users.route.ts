import express from "express";
import { usersController } from "../../controllers/api/users.controller.js";
import { validateData } from "../../middleware/validation-middlware.js";
import { editUserSchema, postUserSchema } from "../../schema/users.schema.js";

export const usersRoute = express.Router();

usersRoute.get("/", usersController.getUsers);
usersRoute.post(
  "/",
  express.json(),
  validateData(postUserSchema),
  usersController.postUser
);

usersRoute.put(
  "/:id",
  express.json(),
  validateData(editUserSchema),
  usersController.editUser
);

usersRoute.delete(
  "/:id",
  usersController.deleteUser
);
