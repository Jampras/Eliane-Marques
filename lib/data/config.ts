import prisma from '../core/prisma';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { safeDataQuery } from './safe-query';

const getSiteConfigsEntries = unstable_cache(
  async () => prisma.siteConfig.findMany(),
  ['site-configs'],
  { revalidate: 300, tags: ['site-configs'] }
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