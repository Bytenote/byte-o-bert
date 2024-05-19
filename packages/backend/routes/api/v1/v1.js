import { Router } from 'express';
import auth from './auth/auth.js';
import addBot from './add-bot/addBot.js';

const router = Router();

// auth routes
router.use('/auth', auth);
router.use('/add-bot', addBot);

export default router;
