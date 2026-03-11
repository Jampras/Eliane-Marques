-- Add published flag for public visibility control
ALTER TABLE "Checklist"
ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT false;

-- Keep existing checklists visible after migration
UPDATE "Checklist"
SET "published" = true;

-- Optimize public checklist queries
CREATE INDEX "Checklist_published_createdAt_idx"
ON "Checklist"("published", "createdAt" DESC);
