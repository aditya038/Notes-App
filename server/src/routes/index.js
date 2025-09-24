import { Router } from 'express';
import authRoutes from './auth.js';
import notesRoutes from './notes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/notes', notesRoutes);

export default router;


