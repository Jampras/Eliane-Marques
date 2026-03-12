import prisma from '../core/prisma';
import { Audience, ProductType } from '../core/types';
import { cache } from 'react';
import { safeDataQuery } from './safe-query';
import type { PaginatedResult } from '../core/pagination';

interface ProductFilters {
  q?: string;
  audience?: Audience;
  featured?: boolean;
}

function buildProductWhere(
  base: { type?: ProductType | { in: ProductType[] }; active: true },
  filters: ProductFilters
) {
  return {
    ...base,
    ...(filters.audience ? { audience: { in: [filters.audience, 'AMBOS'] } } : {}),
    ...(filters.featured ? { featured: true } : {}),
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q, mode: 'insensitive' as const } },
            { shortDesc: { contains: filters.q, mode: 'insensitive' as const } },
            { longDesc: { contains: filters.q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };
}

async function paginateProducts(
  baseWhere: { type?: ProductType | { in: ProductType[] }; active: true },
  page: number,
  pageSize: number,
  filters: ProductFilters
) {
  const where = buildProductWhere(baseWhere, filters);

  return safeDataQuery(
    'paginateProducts',
    async (): Promise<PaginatedResult<Awaited<ReturnType<typeof prisma.product.findMany>>[number]>> => {
      const totalItems = await prisma.product.count({ where });
      const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
      const currentPage = Math.min(Math.max(page, 1), totalPages);
      const items = await prisma.product.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { bestSeller: 'desc' }, { createdAt: 'desc' }],
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

export const getPaginatedProductsByType = cache(
  async (type: ProductType, page: number, pageSize: number, filters: ProductFilters = {}) => {
    return paginateProducts({ type, active: true }, page, pageSize, filters);
  }
);

export const getPaginatedProductsByTypes = cache(
  async (types: ProductType[], page: number, pageSize: number, filters: ProductFilters = {}) => {
    return paginateProducts({ type: { in: types }, active: true }, page, pageSize, filters);
  }
);

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
