-- Convert legacy enum-backed schedule category column to plain text.
-- Run this once on existing PostgreSQL databases before/after `prisma generate`
-- if they were created when `WasteCategory` was still a Prisma enum.

ALTER TABLE IF EXISTS "waste_schedules"
  ALTER COLUMN "waste_category" TYPE text USING "waste_category"::text;

DROP TYPE IF EXISTS "WasteCategory";
