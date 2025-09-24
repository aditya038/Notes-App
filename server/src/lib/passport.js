import passportLib from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { query } from './db.js';

export const passport = passportLib;

// Serialize minimum info into session
passport.serializeUser((user, done) => {
  done(null, { id: user.id });
});

passport.deserializeUser(async (payload, done) => {
  try {
    const { rows } = await query('SELECT id, google_id, email, name, avatar_url FROM users WHERE id = $1', [payload.id]);
    if (rows.length === 0) return done(null, false);
    return done(null, rows[0]);
  } catch (err) {
    return done(err);
  }
});

// Configure Google OAuth strategy
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/auth/google/callback';

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value || null;
        const name = profile.displayName || null;
        const avatarUrl = profile.photos?.[0]?.value || null;

        // Upsert user by google_id
        const { rows } = await query(
          `INSERT INTO users (google_id, email, name, avatar_url)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (google_id)
           DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url
           RETURNING id, google_id, email, name, avatar_url`,
          [googleId, email, name, avatarUrl]
        );

        return done(null, rows[0]);
      } catch (err) {
        return done(err);
      }
    }
  )
);


