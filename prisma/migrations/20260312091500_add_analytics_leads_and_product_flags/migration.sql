ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "bestSeller" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "path" TEXT,
  "productId" TEXT,
  "productSlug" TEXT,
  "productTitle" TEXT,
  "destination" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AnalyticsEvent_name_createdAt_idx"
ON "AnalyticsEvent"("name", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "AnalyticsEvent_source_createdAt_idx"
ON "AnalyticsEvent"("source", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "AnalyticsEvent_productSlug_createdAt_idx"
ON "AnalyticsEvent"("productSlug", "createdAt" DESC);

CREATE TABLE IF NOT EXISTS "Lead" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Lead_status_createdAt_idx"
ON "Lead"("status", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "Lead_source_createdAt_idx"
ON "Lead"("source", "createdAt" DESC);
