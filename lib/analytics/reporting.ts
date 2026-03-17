import prisma from '@/lib/core/prisma';
import { getAnalyticsRawRetentionCutoff } from './aggregation';
import type { AnalyticsEventName } from './events';

type AnalyticsFilters = {
  rangeStart?: Date;
  source?: string;
};

type DashboardAnalyticsSummary = {
  totalEvents: number;
  whatsappClicks: number;
  externalCtaClicks: number;
  topProducts: Array<{
    productSlug: string | null;
    productTitle: string | null;
    count: number;
  }>;
};

function getWindowBounds(rangeStart?: Date) {
  const rawCutoff = getAnalyticsRawRetentionCutoff();

  if (!rangeStart) {
    return {
      aggregateStartInclusive: undefined as Date | undefined,
      aggregateEndExclusive: rawCutoff,
      rawStartInclusive: rawCutoff,
    };
  }

  return {
    aggregateStartInclusive: rangeStart < rawCutoff ? rangeStart : undefined,
    aggregateEndExclusive: rawCutoff,
    rawStartInclusive: rangeStart > rawCutoff ? rangeStart : rawCutoff,
  };
}

async function getAggregatedCount(filters: AnalyticsFilters & { name?: AnalyticsEventName; externalOnly?: boolean }) {
  const { aggregateStartInclusive, aggregateEndExclusive } = getWindowBounds(filters.rangeStart);

  if (!aggregateStartInclusive) {
    return 0;
  }

  const result = await prisma.analyticsDailyAggregate.aggregate({
    _sum: { count: true },
    where: {
      dayBucket: {
        gte: aggregateStartInclusive,
        lt: aggregateEndExclusive,
      },
      ...(filters.source ? { source: filters.source } : {}),
      ...(filters.name ? { name: filters.name } : {}),
      ...(filters.externalOnly ? { destinationKey: { startsWith: 'http' } } : {}),
    },
  });

  return result._sum.count ?? 0;
}

async function getRawCount(filters: AnalyticsFilters & { name?: AnalyticsEventName; externalOnly?: boolean }) {
  const { rawStartInclusive } = getWindowBounds(filters.rangeStart);

  return prisma.analyticsEvent.count({
    where: {
      createdAt: { gte: rawStartInclusive },
      ...(filters.source ? { source: filters.source } : {}),
      ...(filters.name ? { name: filters.name } : {}),
      ...(filters.externalOnly ? { destination: { startsWith: 'http' } } : {}),
    },
  });
}

async function getTopProducts(filters: AnalyticsFilters) {
  const { aggregateStartInclusive, aggregateEndExclusive, rawStartInclusive } = getWindowBounds(
    filters.rangeStart
  );

  const [aggregateRows, rawRows] = await Promise.all([
    aggregateStartInclusive
      ? prisma.analyticsDailyAggregate.groupBy({
          by: ['productSlugKey', 'productTitleKey'],
          where: {
            dayBucket: {
              gte: aggregateStartInclusive,
              lt: aggregateEndExclusive,
            },
            ...(filters.source ? { source: filters.source } : {}),
            productSlugKey: { not: '' },
          },
          _sum: { count: true },
        })
      : Promise.resolve([]),
    prisma.analyticsEvent.groupBy({
      by: ['productSlug', 'productTitle'],
      where: {
        createdAt: { gte: rawStartInclusive },
        ...(filters.source ? { source: filters.source } : {}),
        productSlug: { not: null },
      },
      _count: { _all: true },
    }),
  ]);

  const combined = new Map<string, { productSlug: string | null; productTitle: string | null; count: number }>();

  for (const row of aggregateRows
    .sort((a, b) => (b._sum.count ?? 0) - (a._sum.count ?? 0))
    .slice(0, 20)) {
    const key = `${row.productSlugKey}::${row.productTitleKey}`;
    combined.set(key, {
      productSlug: row.productSlugKey || null,
      productTitle: row.productTitleKey || null,
      count: row._sum.count ?? 0,
    });
  }

  for (const row of rawRows
    .sort((a, b) => (b._count?._all ?? 0) - (a._count?._all ?? 0))
    .slice(0, 20)) {
    const key = `${row.productSlug ?? ''}::${row.productTitle ?? ''}`;
    const current = combined.get(key);

    if (current) {
      current.count += row._count?._all ?? 0;
      continue;
    }

    combined.set(key, {
      productSlug: row.productSlug,
      productTitle: row.productTitle,
      count: row._count?._all ?? 0,
    });
  }

  return [...combined.values()].sort((a, b) => b.count - a.count).slice(0, 5);
}

export async function getDashboardAnalyticsSummary(
  filters: AnalyticsFilters
): Promise<DashboardAnalyticsSummary> {
  const [aggregateTotal, rawTotal, aggregateWhatsApp, rawWhatsApp, aggregateExternal, rawExternal, topProducts] =
    await Promise.all([
      getAggregatedCount(filters),
      getRawCount(filters),
      getAggregatedCount({ ...filters, name: 'whatsapp_click' }),
      getRawCount({ ...filters, name: 'whatsapp_click' }),
      getAggregatedCount({ ...filters, name: 'cta_click', externalOnly: true }),
      getRawCount({ ...filters, name: 'cta_click', externalOnly: true }),
      getTopProducts(filters),
    ]);

  return {
    totalEvents: aggregateTotal + rawTotal,
    whatsappClicks: aggregateWhatsApp + rawWhatsApp,
    externalCtaClicks: aggregateExternal + rawExternal,
    topProducts,
  };
}
