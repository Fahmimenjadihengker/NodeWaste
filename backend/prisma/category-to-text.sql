-- Convert legacy enum-backed category columns to plain text.
-- Run this once on existing PostgreSQL databases before/after `prisma generate`
-- if they were created when `WasteCategory` was still a Prisma enum.

ALTER TABLE IF EXISTS "waste_schedules"
  ALTER COLUMN "waste_category" TYPE text USING "waste_category"::text;

ALTER TABLE IF EXISTS "scans"
  ALTER COLUMN "category" TYPE text USING "category"::text;

DROP TYPE IF EXISTS "WasteCategory";
