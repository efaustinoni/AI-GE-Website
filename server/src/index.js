import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Pool } from 'pg';
import { z } from 'zod';

const app = express();
const port = process.env.PORT || 4000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 20 });
app.use(limiter);

// Utility
async function query(sql, params = []) {
  const res = await pool.query(sql, params);
  return res;
}

// Pages API
app.get('/api/pages/:slug', async (req, res) => {
  const slug = req.params.slug;
  try {
    const pageRes = await query('SELECT * FROM pages WHERE slug=$1', [slug]);
    if (pageRes.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    const page = pageRes.rows[0];
    const blocksRes = await query('SELECT block_type, data FROM page_blocks WHERE page_id=$1 ORDER BY position ASC', [page.id]);
    res.json({
      slug: page.slug,
      title: page.title,
      seo_title: page.seo_title,
      seo_desc: page.seo_desc,
      blocks: blocksRes.rows.map(r => ({ type: r.block_type, data: r.data }))
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Validation schemas
const baseSubmission = {
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  consent: z.boolean(),
  privacy: z.boolean()
};

const contactSchema = z.object(baseSubmission);
const scanSchema = z.object({
  ...baseSubmission,
  tool_name: z.string().optional(),
  target_url: z.string().url().optional(),
  environment: z.enum(['Production','Staging','Test/Dev']).optional(),
  urgency: z.enum(['Laag','Normaal','Hoog']).optional()
}).refine((v) => (v.tool_name && v.tool_name.trim().length>0) || (v.target_url && v.target_url.length>0), {
  message: "Provide at least tool_name or target_url",
  path: ['tool_name']
});

// Forms API
app.post('/api/forms/contact', async (req, res) => {
  try {
    const data = contactSchema.parse(req.body);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    const ua = req.headers['user-agent'] || null;
    await query(`INSERT INTO submissions
      (kind, name, company, email, phone, message, consent, privacy, ip, user_agent)
      VALUES ('contact', $1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [data.name, data.company || null, data.email, data.phone || null, data.message || null, data.consent, data.privacy, ip, ua]);
    res.json({ ok: true });
  } catch (e) {
    if (e.issues) return res.status(400).json({ error: 'Invalid data', details: e.issues });
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/forms/security-scan', async (req, res) => {
  try {
    const data = scanSchema.parse(req.body);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    const ua = req.headers['user-agent'] || null;
    await query(`INSERT INTO submissions
      (kind, name, company, email, phone, message, tool_name, target_url, environment, urgency, consent, privacy, ip, user_agent)
      VALUES ('security_scan', $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [data.name, data.company || null, data.email, data.phone || null, data.message || null,
       data.tool_name || null, data.target_url || null, data.environment || null, data.urgency || null,
       data.consent, data.privacy, ip, ua]);
    res.json({ ok: true });
  } catch (e) {
    if (e.issues) return res.status(400).json({ error: 'Invalid data', details: e.issues });
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
