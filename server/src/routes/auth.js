import { Router } from 'express';
import { passport } from '../lib/passport.js';

const router = Router();

// Start Google auth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    // On success, redirect to frontend
    const redirectUrl = process.env.FRONTEND_SUCCESS_REDIRECT || 'http://localhost:5173';
    res.redirect(redirectUrl);
  }
);

router.get('/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const { id, email, name, avatar_url } = req.user;
    return res.json({ id, email, name, avatar_url });
  }
  return res.status(200).json({ user: null });
});

router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('sid');
      res.status(200).json({ ok: true });
    });
  });
});

router.get('/failure', (_req, res) => {
  res.status(401).json({ error: 'Authentication failed' });
});

export default router;


