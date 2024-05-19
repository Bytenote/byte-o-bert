import { Router } from 'express';
import passport from 'passport';
import { website_url } from '@byte-o-bert/shared/utils/utils';

const router = Router();

// auth with discord
router.get('/discord', passport.authenticate('discord'));

// redirect to home page after auth with discord
router.get(
	'/discord/redirect',
	passport.authenticate('discord', { failureRedirect: '/' }),
	(_, res) => {
		res.redirect(website_url);
	}
);

export default router;
