import prisma from '../core/prisma';
import { ProductType } from '../core/types';
import { cache } from 'react';
import { safeDataQuery } from './safe-query';
import type { PaginatedResult } from '../core/pagination';

async function paginateProducts(where: { type?: ProductType | { in: ProductType[] }; active: true }, page: number, pageSize: number) {
  return safeDataQuery(
    'paginateProducts',
    async (): Promise<PaginatedResult<Awaited<ReturnType<typeof prisma.product.findMany>>[number]>> => {
      const totalItems = await prisma.product.count({ where });
      const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
      const currentPage = Math.min(Math.max(page, 1), totalPages);
      const items = await prisma.product.findMany({
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
}

export const getPaginatedProductsByType = cache(async (type: ProductType, page: number, pageSize: number) => {
  return paginateProducts({ type, active: true }, page, pageSize);
});

export const getPaginatedProductsByTypes = cache(async (types: ProductType[], page: number, pageSize: number) => {
  return paginateProducts({ type: { in: types }, active: true }, page, pageSize);
});

export const getProductBySlug = cache(async (slug?: string) => {
  if (!slug) {
    return null;
  }

  return safeDataQuery(
    'getProductBySlug',
    async () => prisma.product.findFirst({ where: { slug, active: true } }),
    null
  );
});