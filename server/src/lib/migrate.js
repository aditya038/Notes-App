import { query } from './db.js';

// Create tables if they don't exist. Kept simple for local setup.
const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT ''::text,
  content TEXT NOT NULL DEFAULT ''::text,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- session table is created by connect-pg-simple automatically if configured

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
-- Backfill columns if an older table exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
`;

export async function ensureDatabaseInitialized() {
  await query(SQL);
}


