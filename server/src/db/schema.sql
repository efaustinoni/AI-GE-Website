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
  block_type TEXT NOT NULL, -- 'hero' | 'richtext' | 'video' | 'gallery' | 'form_cta'
  data JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  kind TEXT NOT NULL, -- 'contact' | 'security_scan'
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
