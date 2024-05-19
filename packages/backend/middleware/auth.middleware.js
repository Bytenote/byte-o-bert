import { isApplicationOwner } from '@byte-o-bert/shared/services/auth';
import {
	isAuthenticated,
	isAuthorizedToAddBot,
} from '../services/auth.service.js';

/**
 * Allows only authenticated and authorized users
 * to access the route.
 * Otherwise returns a conditional status response.
 *
 * @param {Object} req		- Express request object
 * @param {Object} res		- Express response object
 * @param {Function} next	- Express next function
 */
export const verifyBotAdditionAuth = async (req, res, next) => {
	try {
		if (!isAuthenticated(req.user)) {
			return res.status(401).send('Unauthorized');
		}

		if (isApplicationOwner(req.user._id)) {
			return next();
		}

		const isAuthorized = await isAuthorizedToAddBot(req.user._id);
		if (isAuthorized) {
			return next();
		}

		return res.status(403).send('Forbidden');
	} catch (error) {
		log.error(error, logMeta);

		return res.status(500).send('Internal Server Error');
	}
};
