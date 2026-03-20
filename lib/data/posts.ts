import prisma from '../core/prisma';
import { cache } from 'react';
import { safeDataQuery } from './safe-query';
import type { PaginatedResult } from '../core/pagination';

export const getPaginatedPublishedPosts = cache(async (page: number, pageSize: number, q = '') => {
  return safeDataQuery(
    'getPaginatedPublishedPosts',
    async (): Promise<PaginatedResult<Awaited<ReturnType<typeof prisma.post.findMany>>[number]>> => {
      const where = {
        published: true,
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' as const } },
                { excerpt: { contains: q, mode: 'insensitive' as const } },
                { content: { contains: q, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      };
      const totalItems = await prisma.post.count({ where });
      const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
      const currentPage = Math.min(Math.max(page, 1), totalPages);
      const items = await prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
      });

      return {
        items,
        page: currentPage,
        pageSize,
        totalItems,
        totalPages,
      };
    },
    {
      items: [],
      page: 1,
      pageSize,
      totalItems: 0,
      totalPages: 1,
    }
  );
});

export const getPostBySlug = cache(async (slug?: string) => {
  if (!slug) {
    return null;
  }

  return safeDataQuery(
    'getPostBySlug',
    async () => prisma.post.findFirst({ where: { slug, published: true } }),
    null
  );
});

export const getPublishedPostsForSitemap = cache(async () => {
  return safeDataQuery(
    'getPublishedPostsForSitemap',
    async () =>
      prisma.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    [] as Array<{ slug: string; updatedAt: Date }>
  );
});
