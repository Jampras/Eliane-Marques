import { normalizeOptionalInstitutionalText } from '@/lib/institutional/shared';
import type { z } from 'zod';
import type { homePageSchema } from '@/lib/validators/admin';

type HomePageInput = z.infer<typeof homePageSchema>;

export function buildHomeBaseData(validated: HomePageInput) {
  return {
    heroEyebrow: normalizeOptionalInstitutionalText(validated.heroEyebrow),
    heroPanelImage: normalizeOptionalInstitutionalText(validated.heroPanelImage),
    heroTitle: validated.heroTitle,
    heroSubtitle: normalizeOptionalInstitutionalText(validated.heroSubtitle),
    heroPrimaryCtaLabel: normalizeOptionalInstitutionalText(validated.heroPrimaryCtaLabel),
    heroSecondaryCtaLabel: normalizeOptionalInstitutionalText(validated.heroSecondaryCtaLabel),
    heroTrustText: normalizeOptionalInstitutionalText(validated.heroTrustText),
    audienceTitle: normalizeOptionalInstitutionalText(validated.audienceTitle),
    audienceSubtitle: normalizeOptionalInstitutionalText(validated.audienceSubtitle),
    valueTitle: normalizeOptionalInstitutionalText(validated.valueTitle),
    valueSubtitle: normalizeOptionalInstitutionalText(validated.valueSubtitle),
    valueCtaLabel: normalizeOptionalInstitutionalText(validated.valueCtaLabel),
    methodTitle: normalizeOptionalInstitutionalText(validated.methodTitle),
    methodSubtitle: normalizeOptionalInstitutionalText(validated.methodSubtitle),
    methodCtaLabel: normalizeOptionalInstitutionalText(validated.methodCtaLabel),
    faqTitle: normalizeOptionalInstitutionalText(validated.faqTitle),
    faqSubtitle: normalizeOptionalInstitutionalText(validated.faqSubtitle),
    finalCtaTitle: normalizeOptionalInstitutionalText(validated.finalCtaTitle),
    finalCtaSubtitle: normalizeOptionalInstitutionalText(validated.finalCtaSubtitle),
    finalCtaScarcityText: normalizeOptionalInstitutionalText(validated.finalCtaScarcityText),
    finalCtaLabel: normalizeOptionalInstitutionalText(validated.finalCtaLabel),
    finalWhatsappMessage: normalizeOptionalInstitutionalText(validated.finalWhatsappMessage),
  };
}

export function buildHomeNestedCollections(validated: HomePageInput) {
  return {
    audienceItems: validated.audienceItems.map((item, index) => ({
      title: item.title,
      description: item.description,
      icon: normalizeOptionalInstitutionalText(item.icon) ?? null,
      imageUrl: normalizeOptionalInstitutionalText(item.imageUrl) ?? null,
      sortOrder: index,
    })),
    valueItems: validated.valueItems.map((item, index) => ({
      badge: normalizeOptionalInstitutionalText(item.badge) ?? null,
      title: item.title,
      bullets: item.bullets,
      tone: item.tone,
      imageUrl: normalizeOptionalInstitutionalText(item.imageUrl) ?? null,
      sortOrder: index,
    })),
    methodSteps: validated.methodSteps.map((item, index) => ({
      title: item.title,
      description: item.description,
      imageUrl: normalizeOptionalInstitutionalText(item.imageUrl) ?? null,
      sortOrder: index,
    })),
    faqItems: validated.faqItems.map((item, index) => ({
      question: item.question,
      answer: item.answer,
      sortOrder: index,
    })),
  };
}
