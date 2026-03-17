import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome').max(120),
  email: z.string().trim().email('Informe um email valido').max(160),
  message: z.string().trim().min(10, 'Explique brevemente seu objetivo').max(1200),
  source: z.string().trim().min(1).max(80).default('contact-page'),
  website: z.string().trim().max(200).optional().default(''),
});
