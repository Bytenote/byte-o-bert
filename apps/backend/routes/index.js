import path from 'path';
import { Router } from 'express';
import { getDirnameEnv } from '@byte-o-bert/shared/utils/helpers';
import api from './api/api.js';
import { HAS_PROXY } from '../utils/constants.js';

const router = Router();

// API (only used for authentication)
router.use('/api', api);

if (!HAS_PROXY) {
	// catch all, if no proxy is used
	router.get('*', (req, res) => {
		res.sendFile(
			path.join(
				getDirnameEnv(import.meta.url),
				'..',
				'..',
				'frontend',
				'html',
				'index.html'
			)
		);
	});
}

export default router;
