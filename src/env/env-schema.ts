import z from 'zod';

export const envSchema = z.object({
  PORT: z
    .string()
    .default('8000')
    .transform(z => Number(z))
    .refine(n => n >= 0 && n <= 65535, { error: 'Invalid port number' }),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  DATABASE_URL: z.string(),
  JWT_PRIVATE: z
    .string()
    .min(64)
    .regex(/[a-fA-F0-9]{64,}/, { error: 'must be a hex string' }),
  ADMIN_NAME: z.string(),
  ADMIN_TOKEN: z.string(),
  TRUST_PROXY: z
    .string()
    .default('false')
    .transform(s => s === 'true')
});
