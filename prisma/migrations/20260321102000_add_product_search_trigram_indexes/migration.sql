CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "Product_title_trgm_idx"
  ON "Product" USING GIN ("title" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Product_shortDesc_trgm_idx"
  ON "Product" USING GIN ("shortDesc" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Product_longDesc_trgm_idx"
  ON "Product" USING GIN ("longDesc" gin_trgm_ops);
