-- Non-destructive patch for databases that already ran the first scan-classification SQL.
ALTER TABLE scans
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Tidak diketahui';

ALTER TABLE scans
  ALTER COLUMN category DROP DEFAULT;
