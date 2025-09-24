import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Build connection string from env or default local pg
const {
  PGHOST = 'localhost',
  PGPORT = '5432',
  PGDATABASE = 'notesdb',
  PGUSER = 'postgres',
  PGPASSWORD = '1234',
} = process.env;

export const pool = new pg.Pool({
  host: PGHOST,
  port: Number(PGPORT),
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
});

// Helper to run a query with automatic client release
export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // eslint-disable-next-line no-console
  console.log('executed query', { text: text.split('\n')[0], duration, rows: res.rowCount });
  return res;
}


