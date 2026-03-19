import { z } from 'zod';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';

const leadSourceNames = [ANALYTICS_SOURCES.CONTACT_FORM, ANALYTICS_SOURCES.CONTACT_PAGE] as const;

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome').max(120),
  email: z.string().trim().email('Informe um email valido').max(160),
  message: z.string().trim().min(10, 'Explique brevemente seu objetivo').max(1200),
  source: z.enum(leadSourceNames).default(ANALYTICS_SOURCES.CONTACT_FORM),
  website: z.string().trim().max(200).optional().default(''),
});
