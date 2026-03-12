import { z } from 'zod';

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Slug deve ter pelo menos 3 caracteres')
  .max(120, 'Slug deve ter no maximo 120 caracteres')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use apenas letras minusculas, numeros e hifens no slug');

const optionalUrlSchema = z
  .union([
    z
      .string()
      .trim()
      .refine(
        (value) => /^https?:\/\//i.test(value) || value.startsWith('/'),
        'Informe uma URL valida ou caminho local (/uploads/...)'
      ),
    z.literal(''),
  ])
  .optional();

export const productSchema = z.object({
  title: z.string().trim().min(3, 'Titulo deve ter pelo menos 3 caracteres').max(120),
  slug: slugSchema,
  shortDesc: z.string().trim().min(10, 'Descricao curta muito breve').max(280),
  longDesc: z.string().trim().max(5000).optional(),
  price: z.coerce.number().min(0),
  type: z.enum(['CONSULTORIA', 'CURSO', 'EBOOK', 'CHECKLIST']),
  audience: z.enum(['PESSOAS', 'EMPRESAS', 'AMBOS']),
  coverImage: optionalUrlSchema,
  ctaMode: z.enum(['WHATSAPP', 'EXTERNAL']).default('WHATSAPP'),
  ctaUrl: optionalUrlSchema,
  ctaLabel: z.string().trim().max(80).optional(),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  whatsappMessageTemplate: z.string().trim().max(300).optional(),
  active: z.boolean().default(true),
});

export const postSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: slugSchema,
  excerpt: z.string().trim().min(10).max(300),
  content: z.string().trim().min(20).max(12000),
  published: z.boolean().default(false),
  coverImage: optionalUrlSchema,
});

export const checklistSchema = z.object({
  title: z.string().trim().min(3).max(120),
  slug: slugSchema,
  description: z.string().trim().max(600).optional(),
  published: z.boolean().default(false),
  items: z
    .array(
      z.object({
        id: z.string().optional(),
        label: z.string().trim().min(1).max(180),
        linkUrl: optionalUrlSchema,
        sortOrder: z.number().default(0),
      })
    )
    .min(1, 'Adicione pelo menos um item'),
});

export const configSchema = z
  .object({
    whatsappNumber: z.string().trim().max(30).optional(),
    whatsappDefaultMessage: z.string().trim().max(400).optional(),
    contactEmail: z.union([z.string().trim().email('Email invalido'), z.literal('')]).optional(),
    heroHeadline: z.string().trim().max(200).optional(),
    heroSubheadline: z.string().trim().max(400).optional(),
    siteName: z.string().trim().max(120).optional(),
    instagramLink: z
      .union([
        z
          .string()
          .trim()
          .url('Instagram URL invalida')
          .refine(
            (value) => /^https?:\/\//i.test(value),
            'Instagram URL deve iniciar com http:// ou https://'
          ),
        z.literal(''),
      ])
      .optional(),
  })
  .strict();
