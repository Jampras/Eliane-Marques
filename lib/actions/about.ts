'use server';

import prisma from '@/lib/core/prisma';
import { aboutPageSchema } from '@/lib/validators/admin';
import { runAdminMutation, type ActionResponse } from '@/lib/server/action-runner';
import { requireAdmin } from '@/lib/server/admin-auth';

function normalizeOptionalText(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

export async function upsertAboutPage(data: unknown): Promise<ActionResponse> {
  return runAdminMutation({
    context: 'upsertAboutPage',
    pathsToRevalidate: ['/admin/sobre', '/sobre'],
    tagsToRevalidate: ['about-page'],
    mutation: async () => {
      await requireAdmin();
      const validated = aboutPageSchema.parse(data);

      await prisma.aboutPage.upsert({
        where: { singletonKey: 'main' },
        create: {
          singletonKey: 'main',
          heroTitle: validated.heroTitle,
          heroSubtitle: normalizeOptionalText(validated.heroSubtitle),
          introTitle: normalizeOptionalText(validated.introTitle),
          introBody: normalizeOptionalText(validated.introBody),
          manifestoTitle: normalizeOptionalText(validated.manifestoTitle),
          manifestoBody: normalizeOptionalText(validated.manifestoBody),
          heroImage: normalizeOptionalText(validated.heroImage),
          ctaMode: validated.ctaMode,
          ctaUrl: normalizeOptionalText(validated.ctaUrl),
          ctaLabel: normalizeOptionalText(validated.ctaLabel),
          whatsappMessageTemplate: normalizeOptionalText(validated.whatsappMessageTemplate),
          milestones: {
            create: validated.milestones.map((item, index) => ({
              title: item.title,
              description: item.description,
              year: normalizeOptionalText(item.year) ?? null,
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
              issuer: normalizeOptionalText(item.issuer) ?? null,
              year: normalizeOptionalText(item.year) ?? null,
              imageUrl: normalizeOptionalText(item.imageUrl) ?? null,
              kind: item.kind,
              sortOrder: index,
            })),
          },
        },
        update: {
          heroTitle: validated.heroTitle,
          heroSubtitle: normalizeOptionalText(validated.heroSubtitle),
          introTitle: normalizeOptionalText(validated.introTitle),
          introBody: normalizeOptionalText(validated.introBody),
          manifestoTitle: normalizeOptionalText(validated.manifestoTitle),
          manifestoBody: normalizeOptionalText(validated.manifestoBody),
          heroImage: normalizeOptionalText(validated.heroImage),
          ctaMode: validated.ctaMode,
          ctaUrl: normalizeOptionalText(validated.ctaUrl),
          ctaLabel: normalizeOptionalText(validated.ctaLabel),
          whatsappMessageTemplate: normalizeOptionalText(validated.whatsappMessageTemplate),
          milestones: {
            deleteMany: {},
            create: validated.milestones.map((item, index) => ({
              title: item.title,
              description: item.description,
              year: normalizeOptionalText(item.year) ?? null,
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
              issuer: normalizeOptionalText(item.issuer) ?? null,
              year: normalizeOptionalText(item.year) ?? null,
              imageUrl: normalizeOptionalText(item.imageUrl) ?? null,
              kind: item.kind,
              sortOrder: index,
            })),
          },
        },
      });
    },
  });
}
