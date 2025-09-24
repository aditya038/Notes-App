import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { query } from '../lib/db.js';

const router = Router();

// List notes for current user
router.get('/', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { rows } = await query(
    'SELECT id, title, content, created_at, updated_at FROM notes WHERE user_id = $1 ORDER BY updated_at DESC',
    [userId]
  );
  res.json(rows);
});

// Create note
router.post('/', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { title = '', content = '' } = req.body || {};
  const { rows } = await query(
    `INSERT INTO notes (user_id, title, content)
     VALUES ($1, $2, $3)
     RETURNING id, title, content, created_at, updated_at`,
    [userId, title, content]
  );
  res.status(201).json(rows[0]);
});

// Read one note
router.get('/:id', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const { rows } = await query(
    'SELECT id, title, content, created_at, updated_at FROM notes WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// Update note
router.put('/:id', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const { title, content } = req.body || {};
  const { rows } = await query(
    `UPDATE notes
     SET title = COALESCE($1, title), content = COALESCE($2, content), updated_at = now()
     WHERE id = $3 AND user_id = $4
     RETURNING id, title, content, created_at, updated_at`,
    [title, content, id, userId]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// Delete note
router.delete('/:id', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const result = await query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [id, userId]);
  if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

export default router;


