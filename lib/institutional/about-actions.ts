'use server';

import prisma from '@/lib/core/prisma';
import { aboutPageSchema } from '@/lib/validators/admin';
import { runAdminMutation, type ActionResponse } from '@/lib/server/action-runner';
import { requireAdmin } from '@/lib/server/admin-auth';
import {
  ABOUT_PAGE_TAG,
  ABOUT_SINGLETON_KEY,
  INSTITUTIONAL_REVALIDATE_PATHS,
} from '@/lib/institutional/shared';
import { buildAboutBaseData, buildAboutNestedCollections } from '@/lib/institutional/about-helpers';

export async function upsertInstitutionalAboutPage(data: unknown): Promise<ActionResponse> {
  return runAdminMutation({
    context: 'upsertAboutPage',
    pathsToRevalidate: [...INSTITUTIONAL_REVALIDATE_PATHS],
    tagsToRevalidate: [ABOUT_PAGE_TAG],
    mutation: async () => {
      await requireAdmin();
      const validated = aboutPageSchema.parse(data);
      const baseData = buildAboutBaseData(validated);
      const nestedCollections = buildAboutNestedCollections(validated);

      await prisma.aboutPage.upsert({
        where: { singletonKey: ABOUT_SINGLETON_KEY },
        create: {
          singletonKey: ABOUT_SINGLETON_KEY,
          ...baseData,
          milestones: {
            create: nestedCollections.milestones,
          },
          specializations: {
            create: nestedCollections.specializations,
          },
          credentials: {
            create: nestedCollections.credentials,
          },
        },
        update: {
          ...baseData,
          milestones: {
            deleteMany: {},
            create: nestedCollections.milestones,
          },
          specializations: {
            deleteMany: {},
            create: nestedCollections.specializations,
          },
          credentials: {
            deleteMany: {},
            create: nestedCollections.credentials,
          },
        },
      });
    },
  });
}
