-- Remove the deprecated daily-run field from user data.
ALTER TABLE users
  DROP COLUMN IF EXISTS streak;
