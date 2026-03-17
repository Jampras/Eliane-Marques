import prisma from '@/lib/core/prisma';
import { ANALYTICS_AGGREGATION_LAG_DAYS, ANALYTICS_RAW_RETENTION_DAYS } from './constants';

const BATCH_SIZE = 1000;

type AggregateBucket = {
  dayBucket: Date;
  name: string;
  source: string;
  pathKey: string;
  productSlugKey: string;
  productTitleKey: string;
  destinationKey: string;
  count: number;
};

function startOfUtcDay(value: Date) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function daysAgo(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date;
}

function buildAggregateKey(bucket: Omit<AggregateBucket, 'count'>) {
  return [
    bucket.dayBucket.toISOString(),
    bucket.name,
    bucket.source,
    bucket.pathKey,
    bucket.productSlugKey,
    bucket.destinationKey,
  ].join('::');
}

export function getAnalyticsAggregationCutoff() {
  return startOfUtcDay(daysAgo(ANALYTICS_AGGREGATION_LAG_DAYS));
}

export function getAnalyticsRawRetentionCutoff() {
  return startOfUtcDay(daysAgo(ANALYTICS_RAW_RETENTION_DAYS));
}

async function upsertAggregateBatch(buckets: AggregateBucket[]) {
  await prisma.$transaction(
    buckets.map((bucket) =>
      prisma.analyticsDailyAggregate.upsert({
        where: {
          dayBucket_name_source_pathKey_productSlugKey_destinationKey: {
            dayBucket: bucket.dayBucket,
            name: bucket.name,
            source: bucket.source,
            pathKey: bucket.pathKey,
            productSlugKey: bucket.productSlugKey,
            destinationKey: bucket.destinationKey,
          },
        },
        create: bucket,
        update: {
          count: { increment: bucket.count },
          productTitleKey: bucket.productTitleKey || undefined,
        },
      })
    )
  );
}

export async function rollupAnalyticsEvents(options?: { dryRun?: boolean }) {
  const cutoff = getAnalyticsAggregationCutoff();
  let processed = 0;

  while (true) {
    const events = await prisma.analyticsEvent.findMany({
      where: { createdAt: { lt: cutoff } },
      orderBy: { createdAt: 'asc' },
      take: BATCH_SIZE,
      select: {
        id: true,
        createdAt: true,
        name: true,
        source: true,
        path: true,
        productSlug: true,
        productTitle: true,
        destination: true,
      },
    });

    if (events.length === 0) {
      break;
    }

    const buckets = new Map<string, AggregateBucket>();

    for (const event of events) {
      const bucketBase = {
        dayBucket: startOfUtcDay(event.createdAt),
        name: event.name,
        source: event.source,
        pathKey: event.path || '',
        productSlugKey: event.productSlug || '',
        productTitleKey: event.productTitle || '',
        destinationKey: event.destination || '',
      };

      const key = buildAggregateKey(bucketBase);
      const current = buckets.get(key);

      if (current) {
        current.count += 1;
        if (!current.productTitleKey && bucketBase.productTitleKey) {
          current.productTitleKey = bucketBase.productTitleKey;
        }
        continue;
      }

      buckets.set(key, { ...bucketBase, count: 1 });
    }

    if (!options?.dryRun) {
      await upsertAggregateBatch([...buckets.values()]);
      await prisma.analyticsEvent.deleteMany({
        where: { id: { in: events.map((event) => event.id) } },
      });
    }

    processed += events.length;
  }

  return { processed, cutoff };
}
