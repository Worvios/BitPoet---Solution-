import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(256),
  message: z.string().trim().min(12).max(5000)
});

export type ContactPayload = z.infer<typeof contactSchema>;
