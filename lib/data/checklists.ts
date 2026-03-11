import prisma from '../core/prisma';
import { Prisma } from '@prisma/client';
import { cache } from 'react';
import { safeDataQuery } from './safe-query';
import type { PaginatedResult } from '../core/pagination';

type ChecklistWithCount = Prisma.ChecklistGetPayload<{
  include: { _count: { select: { items: true } } };
}>;

export const getPaginatedChecklists = cache(async (page: number, pageSize: number) => {
  return safeDataQuery(
    'getPaginatedChecklists',
    async (): Promise<PaginatedResult<ChecklistWithCount>> => {
      const where = { published: true };
      const totalItems = await prisma.checklist.count({ where });
      const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
      const currentPage = Math.min(Math.max(page, 1), totalPages);
      const items = await prisma.checklist.findMany({
        where,
        include: {
          _count: { select: { items: true } },
        },
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

export const getChecklistBySlug = cache(async (slug?: string) => {
  if (!slug) {
    return null;
  }

  return safeDataQuery(
    'getChecklistBySlug',
    async () =>
      prisma.checklist.findFirst({
        where: { slug, published: true },
        include: {
          items: { orderBy: { sortOrder: 'asc' } },
        },
      }),
    null
  );
});