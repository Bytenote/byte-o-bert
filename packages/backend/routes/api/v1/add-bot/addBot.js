import { Router } from 'express';
import { REDIRECT_URL } from '../../../../utils/constants.js';
import { verifyBotAdditionAuth } from '../../../../middleware/auth.middleware.js';

const router = Router();

// add bot route
router.get('/', verifyBotAdditionAuth, (_, res) => {
	const redirect_url = encodeURIComponent(REDIRECT_URL);

	res.redirect(
		`https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=2147568640&response_type=code&redirect_uri=${redirect_url}&scope=identify+guilds+bot`
	);
});

export default router;
