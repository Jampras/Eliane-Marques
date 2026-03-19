'use server';

import prisma from '@/lib/core/prisma';
import { runAdminMutation, type ActionResponse } from '@/lib/server/action-runner';
import { requireAdmin } from '@/lib/server/admin-auth';
import { homePageSchema } from '@/lib/validators/admin';
import {
  HOME_PAGE_TAG,
  HOME_SINGLETON_KEY,
  INSTITUTIONAL_REVALIDATE_PATHS,
  normalizeOptionalInstitutionalText,
} from '@/lib/institutional/shared';

export async function upsertInstitutionalHomePage(data: unknown): Promise<ActionResponse> {
  return runAdminMutation({
    context: 'upsertHomePage',
    pathsToRevalidate: [...INSTITUTIONAL_REVALIDATE_PATHS],
    tagsToRevalidate: [HOME_PAGE_TAG],
    mutation: async () => {
      await requireAdmin();
      const validated = homePageSchema.parse(data);

      const baseData = {
        heroEyebrow: normalizeOptionalInstitutionalText(validated.heroEyebrow),
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

      await prisma.homePage.upsert({
        where: { singletonKey: HOME_SINGLETON_KEY },
        create: {
          singletonKey: HOME_SINGLETON_KEY,
          ...baseData,
          audienceItems: {
            create: validated.audienceItems.map((item, index) => ({
              title: item.title,
              description: item.description,
              icon: normalizeOptionalInstitutionalText(item.icon) ?? null,
              sortOrder: index,
            })),
          },
          valueItems: {
            create: validated.valueItems.map((item, index) => ({
              badge: normalizeOptionalInstitutionalText(item.badge) ?? null,
              title: item.title,
              bullets: item.bullets,
              tone: item.tone,
              sortOrder: index,
            })),
          },
          methodSteps: {
            create: validated.methodSteps.map((item, index) => ({
              title: item.title,
              description: item.description,
              sortOrder: index,
            })),
          },
          faqItems: {
            create: validated.faqItems.map((item, index) => ({
              question: item.question,
              answer: item.answer,
              sortOrder: index,
            })),
          },
        },
        update: {
          ...baseData,
          audienceItems: {
            deleteMany: {},
            create: validated.audienceItems.map((item, index) => ({
              title: item.title,
              description: item.description,
              icon: normalizeOptionalInstitutionalText(item.icon) ?? null,
              sortOrder: index,
            })),
          },
          valueItems: {
            deleteMany: {},
            create: validated.valueItems.map((item, index) => ({
              badge: normalizeOptionalInstitutionalText(item.badge) ?? null,
              title: item.title,
              bullets: item.bullets,
              tone: item.tone,
              sortOrder: index,
            })),
          },
          methodSteps: {
            deleteMany: {},
            create: validated.methodSteps.map((item, index) => ({
              title: item.title,
              description: item.description,
              sortOrder: index,
            })),
          },
          faqItems: {
            deleteMany: {},
            create: validated.faqItems.map((item, index) => ({
              question: item.question,
              answer: item.answer,
              sortOrder: index,
            })),
          },
        },
      });
    },
  });
}
