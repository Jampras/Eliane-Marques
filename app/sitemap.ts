import type { MetadataRoute } from 'next';
import prisma from '@/lib/core/prisma';
import { getPublicSiteUrl } from '@/lib/env/server';
import { getProductDetailPath } from '@/lib/core/product-paths';

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

  try {
    const [posts, products, checklists] = await Promise.all([
      prisma.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.product.findMany({
        where: { active: true },
        select: { slug: true, type: true, updatedAt: true },
      }),
      prisma.checklist.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
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
  } catch {
    return staticEntries;
  }
}
