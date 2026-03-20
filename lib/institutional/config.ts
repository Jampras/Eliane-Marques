import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import prisma from '@/lib/core/prisma';
import { safeDataQuery } from '@/lib/data/safe-query';
import { SITE_CONFIGS_TAG } from '@/lib/institutional/shared';
import {
  DEFAULT_THEME_PRESET,
  isThemePresetKey,
  type ThemePresetKey,
} from '@/lib/core/theme-presets';

const getSiteConfigsEntries = unstable_cache(
  async () => prisma.siteConfig.findMany(),
  ['site-configs'],
  { revalidate: 300, tags: [SITE_CONFIGS_TAG] }
);

export const getSiteConfigs = cache(async () => {
  const configs = await safeDataQuery('getSiteConfigs', getSiteConfigsEntries, []);
  const result: Record<string, string> = {};

  for (const config of configs) {
    result[config.key] = config.value;
  }

  return result;
});

export const getWhatsAppConfig = cache(async () => {
  const configs = await getSiteConfigs();
  return {
    number: configs.whatsappNumber || '5587996103463',
    defaultMessage:
      configs.whatsappDefaultMessage ||
      'Ola Eliane! Gostaria de saber mais sobre seus servicos.',
  };
});

export const getThemePreset = cache(async (): Promise<ThemePresetKey> => {
  const configs = await getSiteConfigs();
  return isThemePresetKey(configs.themePreset) ? configs.themePreset : DEFAULT_THEME_PRESET;
});
