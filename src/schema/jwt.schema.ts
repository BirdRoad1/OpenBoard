import z from 'zod';

export const JWTSchema = z.strictObject({
  iat: z.int(),
  exp: z.int().optional(),
  iss: z.string().optional(),
  sub: z.string().optional(),
  aud: z.string().optional()
});

export const JWTUserDataSchema = z.strictObject({
  id: z.int().min(0),
});

export const JWTUserSchema = JWTSchema.extend(JWTUserDataSchema.shape);
