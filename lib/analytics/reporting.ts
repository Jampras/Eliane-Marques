import prisma from '@/lib/core/prisma';
import { getAnalyticsRawRetentionCutoff } from './aggregation';
import type { AnalyticsEventName } from './events';
import { getWindowBounds, mergeTopProductCounts } from './reporting-helpers';

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

async function getAggregatedCount(filters: AnalyticsFilters & { name?: AnalyticsEventName; externalOnly?: boolean }) {
  const { aggregateStartInclusive, aggregateEndExclusive } = getWindowBounds(
    filters.rangeStart,
    getAnalyticsRawRetentionCutoff()
  );

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
  const { rawStartInclusive } = getWindowBounds(filters.rangeStart, getAnalyticsRawRetentionCutoff());

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
    filters.rangeStart,
    getAnalyticsRawRetentionCutoff()
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

  return mergeTopProductCounts(aggregateRows, rawRows);
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
