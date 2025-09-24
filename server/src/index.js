import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';

import { pool } from './lib/db.js';
import { ensureDatabaseInitialized } from './lib/migrate.js';
import { passport } from './lib/passport.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PgStore = connectPgSimple(session);

// Basic middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS: Allow frontend origin from env or localhost:5173
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

// Session configuration backed by PostgreSQL
app.use(
  session({
    store: new PgStore({
      pool, // Re-use existing pg Pool
      tableName: 'user_sessions',
      createTableIfMissing: true,
    }),
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// API routes
app.use('/api', routes);

// Start server after DB init
const PORT = process.env.PORT || 4000;
await ensureDatabaseInitialized();
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});


