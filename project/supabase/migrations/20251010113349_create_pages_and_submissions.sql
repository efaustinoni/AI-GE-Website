/*
  # Create pages and submissions tables

  1. New Tables
    - `pages`
      - `id` (serial, primary key)
      - `slug` (text, unique) - URL-friendly page identifier
      - `title` (text) - Page title
      - `seo_title` (text) - SEO meta title
      - `seo_desc` (text) - SEO meta description
      - `created_at` (timestamp) - Creation timestamp
      - `updated_at` (timestamp) - Last update timestamp

    - `page_blocks`
      - `id` (serial, primary key)
      - `page_id` (integer, foreign key) - References pages table
      - `position` (integer) - Display order of blocks
      - `block_type` (text) - Type of block (hero, richtext, video, gallery, form_cta)
      - `data` (jsonb) - Block configuration and content

    - `submissions`
      - `id` (serial, primary key)
      - `kind` (text) - Submission type (contact, security_scan)
      - `name` (text) - Submitter name
      - `company` (text) - Company name
      - `email` (text) - Contact email
      - `phone` (text) - Contact phone
      - `message` (text) - Message content
      - `tool_name` (text) - AI tool name for security scans
      - `target_url` (text) - Target URL for security scans
      - `environment` (text) - Environment type
      - `urgency` (text) - Urgency level
      - `consent` (boolean) - Consent checkbox
      - `privacy` (boolean) - Privacy policy acceptance
      - `ip` (text) - Submitter IP address
      - `user_agent` (text) - Browser user agent
      - `created_at` (timestamp) - Submission timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to pages and page_blocks
    - Add policies for authenticated insert access to submissions
*/

CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  seo_title TEXT,
  seo_desc TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_blocks (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  block_type TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  kind TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  tool_name TEXT,
  target_url TEXT,
  environment TEXT,
  urgency TEXT,
  consent BOOLEAN DEFAULT FALSE,
  privacy BOOLEAN DEFAULT FALSE,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for pages
CREATE POLICY "Anyone can view pages"
  ON pages FOR SELECT
  USING (true);

-- Public read access for page_blocks
CREATE POLICY "Anyone can view page blocks"
  ON page_blocks FOR SELECT
  USING (true);

-- Allow anyone to submit forms (insert only)
CREATE POLICY "Anyone can submit forms"
  ON submissions FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can view submissions
CREATE POLICY "Authenticated users can view submissions"
  ON submissions FOR SELECT
  TO authenticated
  USING (true);