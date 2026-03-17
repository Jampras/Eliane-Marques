'use server';

import prisma from '@/lib/core/prisma';
import { aboutPageSchema } from '@/lib/validators/admin';
import { runAdminMutation, type ActionResponse } from '@/lib/server/action-runner';
import { requireAdmin } from '@/lib/server/admin-auth';
import {
  ABOUT_PAGE_TAG,
  ABOUT_SINGLETON_KEY,
  INSTITUTIONAL_REVALIDATE_PATHS,
  normalizeOptionalInstitutionalText,
} from '@/lib/institutional/shared';

export async function upsertInstitutionalAboutPage(data: unknown): Promise<ActionResponse> {
  return runAdminMutation({
    context: 'upsertAboutPage',
    pathsToRevalidate: [...INSTITUTIONAL_REVALIDATE_PATHS],
    tagsToRevalidate: [ABOUT_PAGE_TAG],
    mutation: async () => {
      await requireAdmin();
      const validated = aboutPageSchema.parse(data);

      await prisma.aboutPage.upsert({
        where: { singletonKey: ABOUT_SINGLETON_KEY },
        create: {
          singletonKey: ABOUT_SINGLETON_KEY,
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
          whatsappMessageTemplate: normalizeOptionalInstitutionalText(
            validated.whatsappMessageTemplate
          ),
          milestones: {
            create: validated.milestones.map((item, index) => ({
              title: item.title,
              description: item.description,
              year: normalizeOptionalInstitutionalText(item.year) ?? null,
              sortOrder: index,
            })),
          },
          specializations: {
            create: validated.specializations.map((item, index) => ({
              title: item.title,
              description: item.description,
              sortOrder: index,
            })),
          },
          credentials: {
            create: validated.credentials.map((item, index) => ({
              title: item.title,
              issuer: normalizeOptionalInstitutionalText(item.issuer) ?? null,
              year: normalizeOptionalInstitutionalText(item.year) ?? null,
              imageUrl: normalizeOptionalInstitutionalText(item.imageUrl) ?? null,
              kind: item.kind,
              sortOrder: index,
            })),
          },
        },
        update: {
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
          whatsappMessageTemplate: normalizeOptionalInstitutionalText(
            validated.whatsappMessageTemplate
          ),
          milestones: {
            deleteMany: {},
            create: validated.milestones.map((item, index) => ({
              title: item.title,
              description: item.description,
              year: normalizeOptionalInstitutionalText(item.year) ?? null,
              sortOrder: index,
            })),
          },
          specializations: {
            deleteMany: {},
            create: validated.specializations.map((item, index) => ({
              title: item.title,
              description: item.description,
              sortOrder: index,
            })),
          },
          credentials: {
            deleteMany: {},
            create: validated.credentials.map((item, index) => ({
              title: item.title,
              issuer: normalizeOptionalInstitutionalText(item.issuer) ?? null,
              year: normalizeOptionalInstitutionalText(item.year) ?? null,
              imageUrl: normalizeOptionalInstitutionalText(item.imageUrl) ?? null,
              kind: item.kind,
              sortOrder: index,
            })),
          },
        },
      });
    },
  });
}
