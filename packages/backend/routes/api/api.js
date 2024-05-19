import { Router } from 'express';
import v1 from './v1/v1.js';

const router = Router();

// api version routes
router.use('/v1', v1);

export default router;
