import type { MetadataRoute } from 'next';
import { getPublicSiteUrl } from '@/lib/env/server';

const SITE_URL = getPublicSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
