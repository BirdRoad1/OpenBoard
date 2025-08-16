import z from 'zod';

export const createReportSchema = z.object({
  messageId: z.int(),
  description: z
    .string()
    .min(1, { error: 'Please describe your report.' })
    .max(1000, {error: 'Your report is too long. Keep it <= 1000 characters'})
});
