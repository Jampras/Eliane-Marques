'use server';

import prisma from '@/lib/core/prisma';
import { configSchema } from '@/lib/validators/admin';
import { runAdminMutation, type ActionResponse } from '@/lib/server/action-runner';
import { requireAdmin } from '@/lib/server/admin-auth';
import {
  INSTITUTIONAL_REVALIDATE_PATHS,
  SITE_CONFIGS_TAG,
} from '@/lib/institutional/shared';

export async function updateInstitutionalConfigs(
  data: Record<string, string>
): Promise<ActionResponse> {
  return runAdminMutation({
    context: 'updateConfigs',
    pathsToRevalidate: [...INSTITUTIONAL_REVALIDATE_PATHS],
    tagsToRevalidate: [SITE_CONFIGS_TAG],
    mutation: async () => {
      await requireAdmin();
      const validated = configSchema.parse(data);
      const entries = Object.entries(validated).filter(([, value]) => value !== undefined) as Array<
        [keyof typeof validated, string]
      >;

      if (entries.length === 0) {
        return;
      }

      await prisma.$transaction(
        entries.map(([key, value]) =>
          prisma.siteConfig.upsert({
            where: { key },
            update: { value },
            create: { key, value },
          })
        )
      );
    },
  });
}
