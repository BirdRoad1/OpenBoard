import jwt, { type SignOptions } from 'jsonwebtoken';
import type z from 'zod';
import { JWTUserDataSchema, JWTUserSchema } from '../schema/jwt.schema.js';
import { env } from '../env/env.js';

function sign(
  payload: z.infer<typeof JWTUserDataSchema>,
  options?: SignOptions
): string {
  const parsed = JWTUserDataSchema.parse(payload);

  return jwt.sign(parsed, env.JWT_PRIVATE, { ...options, algorithm: 'HS256' });
}

function verify(payload: string): z.infer<typeof JWTUserSchema> {
  const data = jwt.verify(payload, env.JWT_PRIVATE, {
    algorithms: ['HS256']
  });

  return JWTUserSchema.parse(data);
}

export default { sign, verify };
