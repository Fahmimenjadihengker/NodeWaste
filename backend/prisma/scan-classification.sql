-- Destructive migration for the new AI contract.
-- Old scans used category labels (Organik/Anorganik/B3). The app now stores
-- recommendation."Klasifikasi jenis sampah" as scans.classification.

DELETE FROM activities
WHERE type = 'SCAN' OR scan_id IS NOT NULL;

DELETE FROM scans;

ALTER TABLE scans
  DROP COLUMN IF EXISTS category;

ALTER TABLE scans
  ADD COLUMN IF NOT EXISTS classification TEXT NOT NULL;

CREATE INDEX IF NOT EXISTS scans_user_classification_idx
  ON scans(user_id, classification);
