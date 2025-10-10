import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(schema);
    await client.query(seed);
    await client.query('COMMIT');
    console.log('Database schema created and seeded.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('DB setup failed:', e);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
