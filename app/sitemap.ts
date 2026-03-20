import type { MetadataRoute } from 'next';
import { getPublicSiteUrl } from '@/lib/env/server';
import { getProductDetailPath } from '@/lib/core/product-paths';
import { getPublishedPostsForSitemap } from '@/lib/data/posts';
import { getActiveProductsForSitemap } from '@/lib/data/products';
import { getPublishedChecklistsForSitemap } from '@/lib/data/checklists';

const BASE_URL = getPublicSiteUrl();

const staticRoutes = [
  '',
  '/servicos',
  '/cursos',
  '/materiais',
  '/checklists',
  '/conteudos',
  '/contato',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  const [posts, products, checklists] = await Promise.all([
    getPublishedPostsForSitemap(),
    getActiveProductsForSitemap(),
    getPublishedChecklistsForSitemap(),
  ]);

  return [
    ...staticEntries,
    ...posts.map((post) => ({
      url: `${BASE_URL}/conteudos/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: `${BASE_URL}${getProductDetailPath(product.type, product.slug)}`,
      lastModified: product.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...checklists.map((checklist) => ({
      url: `${BASE_URL}/checklists/${checklist.slug}`,
      lastModified: checklist.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ];
}
