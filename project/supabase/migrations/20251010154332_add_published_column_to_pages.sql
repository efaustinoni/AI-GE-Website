/*
  # Add published column to pages table

  1. Changes
    - Add `published` column to pages table for content visibility control
    - Set default to true for existing pages
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pages' AND column_name = 'published'
  ) THEN
    ALTER TABLE pages ADD COLUMN published boolean DEFAULT true;
  END IF;
END $$;
