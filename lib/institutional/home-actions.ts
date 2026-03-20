'use server';

import prisma from '@/lib/core/prisma';
import { runAdminMutation, type ActionResponse } from '@/lib/server/action-runner';
import { requireAdmin } from '@/lib/server/admin-auth';
import { homePageSchema } from '@/lib/validators/admin';
import {
  HOME_PAGE_TAG,
  HOME_SINGLETON_KEY,
  INSTITUTIONAL_REVALIDATE_PATHS,
} from '@/lib/institutional/shared';
import { buildHomeBaseData, buildHomeNestedCollections } from '@/lib/institutional/home-helpers';

export async function upsertInstitutionalHomePage(data: unknown): Promise<ActionResponse> {
  return runAdminMutation({
    context: 'upsertHomePage',
    pathsToRevalidate: [...INSTITUTIONAL_REVALIDATE_PATHS],
    tagsToRevalidate: [HOME_PAGE_TAG],
    mutation: async () => {
      await requireAdmin();
      const validated = homePageSchema.parse(data);
      const baseData = buildHomeBaseData(validated);
      const nestedCollections = buildHomeNestedCollections(validated);

      await prisma.homePage.upsert({
        where: { singletonKey: HOME_SINGLETON_KEY },
        create: {
          singletonKey: HOME_SINGLETON_KEY,
          ...baseData,
          audienceItems: {
            create: nestedCollections.audienceItems,
          },
          valueItems: {
            create: nestedCollections.valueItems,
          },
          methodSteps: {
            create: nestedCollections.methodSteps,
          },
          faqItems: {
            create: nestedCollections.faqItems,
          },
        },
        update: {
          ...baseData,
          audienceItems: {
            deleteMany: {},
            create: nestedCollections.audienceItems,
          },
          valueItems: {
            deleteMany: {},
            create: nestedCollections.valueItems,
          },
          methodSteps: {
            deleteMany: {},
            create: nestedCollections.methodSteps,
          },
          faqItems: {
            deleteMany: {},
            create: nestedCollections.faqItems,
          },
        },
      });
    },
  });
}
