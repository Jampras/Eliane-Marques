import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: '.env' });

const prisma = new PrismaClient();
const ANALYTICS_AGGREGATION_LAG_DAYS = 2;
const BATCH_SIZE = 1000;

function startOfUtcDay(value) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function daysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date;
}

function buildAggregateKey(bucket) {
  return [
    bucket.dayBucket.toISOString(),
    bucket.name,
    bucket.source,
    bucket.pathKey,
    bucket.productSlugKey,
    bucket.destinationKey,
  ].join('::');
}

async function upsertAggregateBatch(buckets) {
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

async function main() {
  const cutoff = startOfUtcDay(daysAgo(ANALYTICS_AGGREGATION_LAG_DAYS));
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

    const buckets = new Map();

    for (const event of events) {
      const bucket = {
        dayBucket: startOfUtcDay(event.createdAt),
        name: event.name,
        source: event.source,
        pathKey: event.path || '',
        productSlugKey: event.productSlug || '',
        productTitleKey: event.productTitle || '',
        destinationKey: event.destination || '',
        count: 1,
      };

      const key = buildAggregateKey(bucket);
      const current = buckets.get(key);
      if (current) {
        current.count += 1;
        if (!current.productTitleKey && bucket.productTitleKey) {
          current.productTitleKey = bucket.productTitleKey;
        }
      } else {
        buckets.set(key, bucket);
      }
    }

    await upsertAggregateBatch([...buckets.values()]);
    await prisma.analyticsEvent.deleteMany({
      where: { id: { in: events.map((event) => event.id) } },
    });

    processed += events.length;
  }

  console.log(
    `Analytics maintenance finished: ${processed} raw events rolled up before ${cutoff.toISOString()}.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
