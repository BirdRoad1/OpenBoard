import z from "zod";

export const postMessageSchema = z.object({
  title: z.string().min(1).max(128).optional(),
  content: z.string().min(1).max(500).optional(),
});
