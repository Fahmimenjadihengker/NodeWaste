-- Make waste_schedules standalone and keep category as plain text.
-- Run once on existing PostgreSQL/Supabase databases before deploying code
-- generated from the updated Prisma schema.

ALTER TABLE IF EXISTS "waste_schedules"
  ALTER COLUMN "waste_category" TYPE text USING "waste_category"::text;

ALTER TABLE IF EXISTS "waste_schedules"
  DROP CONSTRAINT IF EXISTS "waste_schedules_district_id_fkey";

DROP INDEX IF EXISTS "waste_schedules_district_id_idx";

ALTER TABLE IF EXISTS "waste_schedules"
  DROP COLUMN IF EXISTS "district_id";
