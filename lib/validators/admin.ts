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

const aboutMilestoneSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(500),
  year: z.string().trim().max(40).optional(),
  sortOrder: z.number().default(0),
});

const aboutSpecializationSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(500),
  sortOrder: z.number().default(0),
});

const aboutCredentialSchema = z.object({
  title: z.string().trim().min(1).max(140),
  issuer: z.string().trim().max(120).optional(),
  year: z.string().trim().max(40).optional(),
  imageUrl: optionalUrlSchema,
  kind: z.enum(['CERTIFICATE', 'SEAL', 'SPECIALIZATION']),
  sortOrder: z.number().default(0),
});

const homeAudienceItemSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(320),
  icon: z.string().trim().max(12).optional(),
  sortOrder: z.number().default(0),
});

const homeValueItemSchema = z.object({
  badge: z.string().trim().max(80).optional(),
  title: z.string().trim().min(1).max(120),
  bullets: z.array(z.string().trim().min(1).max(180)).min(2).max(4),
  tone: z.enum(['NEGATIVE', 'POSITIVE']).default('NEGATIVE'),
  sortOrder: z.number().default(0),
});

const homeMethodStepSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(320),
  sortOrder: z.number().default(0),
});

const homeFaqItemSchema = z.object({
  question: z.string().trim().min(1).max(180),
  answer: z.string().trim().min(1).max(600),
  sortOrder: z.number().default(0),
});

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

export const aboutPageSchema = z.object({
  heroTitle: z.string().trim().min(3).max(200),
  heroSubtitle: z.string().trim().max(320).optional(),
  introTitle: z.string().trim().max(160).optional(),
  introBody: z.string().trim().max(1600).optional(),
  manifestoTitle: z.string().trim().max(160).optional(),
  manifestoBody: z.string().trim().max(2400).optional(),
  heroImage: optionalUrlSchema,
  ctaMode: z.enum(['WHATSAPP', 'EXTERNAL']).default('WHATSAPP'),
  ctaUrl: optionalUrlSchema,
  ctaLabel: z.string().trim().max(80).optional(),
  whatsappMessageTemplate: z.string().trim().max(320).optional(),
  milestones: z.array(aboutMilestoneSchema).max(12),
  specializations: z.array(aboutSpecializationSchema).max(12),
  credentials: z.array(aboutCredentialSchema).max(20),
});

export const homePageSchema = z.object({
  heroEyebrow: z.string().trim().max(80).optional(),
  heroTitle: z.string().trim().min(3).max(220),
  heroSubtitle: z.string().trim().max(320).optional(),
  heroPrimaryCtaLabel: z.string().trim().max(80).optional(),
  heroSecondaryCtaLabel: z.string().trim().max(80).optional(),
  heroTrustText: z.string().trim().max(160).optional(),
  audienceTitle: z.string().trim().max(180).optional(),
  audienceSubtitle: z.string().trim().max(320).optional(),
  valueTitle: z.string().trim().max(180).optional(),
  valueSubtitle: z.string().trim().max(320).optional(),
  valueCtaLabel: z.string().trim().max(80).optional(),
  methodTitle: z.string().trim().max(180).optional(),
  methodSubtitle: z.string().trim().max(320).optional(),
  methodCtaLabel: z.string().trim().max(80).optional(),
  faqTitle: z.string().trim().max(180).optional(),
  faqSubtitle: z.string().trim().max(320).optional(),
  finalCtaTitle: z.string().trim().max(220).optional(),
  finalCtaSubtitle: z.string().trim().max(320).optional(),
  finalCtaScarcityText: z.string().trim().max(120).optional(),
  finalCtaLabel: z.string().trim().max(80).optional(),
  finalWhatsappMessage: z.string().trim().max(320).optional(),
  audienceItems: z.array(homeAudienceItemSchema).min(2).max(6),
  valueItems: z.array(homeValueItemSchema).length(2),
  methodSteps: z.array(homeMethodStepSchema).min(3).max(6),
  faqItems: z.array(homeFaqItemSchema).min(3).max(8),
});
