import z from "zod";

export const postUserSchema = z.union([
  z.object({
    username: z.string(),
    bio: z.string().optional(),
  }),
  z.object({
    username: z.string(),
    adminToken: z.string()
  }),
]);

export const editUserSchema = z.object({
  bio: z.string().nullable(),
});
