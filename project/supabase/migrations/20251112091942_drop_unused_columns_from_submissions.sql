/*
  # Remove Unused Columns from Submissions Table

  1. Changes
    - Drop unused columns from `submissions` table:
      - `environment` - Not used in any forms
      - `urgency` - Not used in any forms
      - `consent` - Not used in any forms
      - `privacy` - Not used in any forms
      - `ip` - Not captured in current implementation
      - `user_agent` - Not captured in current implementation

  2. Notes
    - The Contact form uses: kind, name, email, company, phone, message
    - The Security Scan form uses: kind, name, email, company, phone, tool_name, target_url, message
    - All other columns are not referenced in the codebase
    - This cleanup improves database efficiency and reduces confusion
*/

-- Drop unused columns from submissions table
DO $$
BEGIN
  -- Drop environment column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'environment'
  ) THEN
    ALTER TABLE submissions DROP COLUMN environment;
  END IF;

  -- Drop urgency column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'urgency'
  ) THEN
    ALTER TABLE submissions DROP COLUMN urgency;
  END IF;

  -- Drop consent column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'consent'
  ) THEN
    ALTER TABLE submissions DROP COLUMN consent;
  END IF;

  -- Drop privacy column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'privacy'
  ) THEN
    ALTER TABLE submissions DROP COLUMN privacy;
  END IF;

  -- Drop ip column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'ip'
  ) THEN
    ALTER TABLE submissions DROP COLUMN ip;
  END IF;

  -- Drop user_agent column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'user_agent'
  ) THEN
    ALTER TABLE submissions DROP COLUMN user_agent;
  END IF;
END $$;