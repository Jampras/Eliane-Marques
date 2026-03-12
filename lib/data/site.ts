import { cache } from 'react';
import { BRAND } from '@/lib/core/constants';
import { getSiteConfigs } from '@/lib/data/config';

export const getSiteIdentity = cache(async () => {
  const configs = await getSiteConfigs();

  return {
    siteName: configs.siteName || BRAND.name,
    contactEmail: configs.contactEmail || BRAND.email,
    instagramUrl: configs.instagramLink || BRAND.instagram,
    heroHeadline: configs.heroHeadline,
    heroSubheadline: configs.heroSubheadline,
  };
});
