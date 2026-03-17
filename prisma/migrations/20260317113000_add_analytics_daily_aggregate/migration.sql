CREATE TABLE IF NOT EXISTS "AnalyticsDailyAggregate" (
  "dayBucket" TIMESTAMP(3) NOT NULL,
  "name" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "pathKey" TEXT NOT NULL DEFAULT '',
  "productSlugKey" TEXT NOT NULL DEFAULT '',
  "productTitleKey" TEXT NOT NULL DEFAULT '',
  "destinationKey" TEXT NOT NULL DEFAULT '',
  "count" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AnalyticsDailyAggregate_pkey" PRIMARY KEY ("dayBucket","name","source","pathKey","productSlugKey","destinationKey")
);

CREATE INDEX IF NOT EXISTS "AnalyticsDailyAggregate_dayBucket_idx"
ON "AnalyticsDailyAggregate"("dayBucket" DESC);

CREATE INDEX IF NOT EXISTS "AnalyticsDailyAggregate_name_dayBucket_idx"
ON "AnalyticsDailyAggregate"("name", "dayBucket" DESC);

CREATE INDEX IF NOT EXISTS "AnalyticsDailyAggregate_source_dayBucket_idx"
ON "AnalyticsDailyAggregate"("source", "dayBucket" DESC);
