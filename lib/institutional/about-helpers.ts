import { normalizeOptionalInstitutionalText } from '@/lib/institutional/shared';
import type { z } from 'zod';
import type { aboutPageSchema } from '@/lib/validators/admin';

type AboutPageInput = z.infer<typeof aboutPageSchema>;

export function buildAboutBaseData(validated: AboutPageInput) {
  return {
    heroTitle: validated.heroTitle,
    heroSubtitle: normalizeOptionalInstitutionalText(validated.heroSubtitle),
    introTitle: normalizeOptionalInstitutionalText(validated.introTitle),
    introBody: normalizeOptionalInstitutionalText(validated.introBody),
    manifestoTitle: normalizeOptionalInstitutionalText(validated.manifestoTitle),
    manifestoBody: normalizeOptionalInstitutionalText(validated.manifestoBody),
    heroImage: normalizeOptionalInstitutionalText(validated.heroImage),
    ctaMode: validated.ctaMode,
    ctaUrl: normalizeOptionalInstitutionalText(validated.ctaUrl),
    ctaLabel: normalizeOptionalInstitutionalText(validated.ctaLabel),
    whatsappMessageTemplate: normalizeOptionalInstitutionalText(validated.whatsappMessageTemplate),
  };
}

export function buildAboutNestedCollections(validated: AboutPageInput) {
  return {
    milestones: validated.milestones.map((item, index) => ({
      title: item.title,
      description: item.description,
      year: normalizeOptionalInstitutionalText(item.year) ?? null,
      sortOrder: index,
    })),
    specializations: validated.specializations.map((item, index) => ({
      title: item.title,
      description: item.description,
      sortOrder: index,
    })),
    credentials: validated.credentials.map((item, index) => ({
      title: item.title,
      issuer: normalizeOptionalInstitutionalText(item.issuer) ?? null,
      year: normalizeOptionalInstitutionalText(item.year) ?? null,
      imageUrl: normalizeOptionalInstitutionalText(item.imageUrl) ?? null,
      kind: item.kind,
      sortOrder: index,
    })),
  };
}
