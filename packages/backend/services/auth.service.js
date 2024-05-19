import { Admin } from '@byte-o-bert/database/models';
import log from '@byte-o-bert/shared/services/log';
import { isApplicationOwner } from '@byte-o-bert/shared/services/auth';
import { hasGuildPermissions } from './guild.service.js';
import { getIsPrivateSetting } from './settings.service.js';

const logMeta = { origin: import.meta.url };

/**
 * Checks if the user is authenticated.
 * Unauthenticated users have the value
 * null.
 *
 * @param {Object|null} user - The user object
 * @returns {boolean}
 */
export const isAuthenticated = (user) => {
	return !!user?._id;
};

/**
 * Checks if the user is authorized to access
 * a resolver based on the required role.
 * The required role is defined in the auth directive.
 *
 * @param {Object} user			- User object
 * @param {string} requiredRole	- Required role to access the resolver
 * @param {string} guildId		- Guild ID
 * @returns {Promise<boolean>}
 */
export const isAuthorized = (user, requiredRole, guildId) => {
	switch (requiredRole) {
		case 'OWNER':
			return isApplicationOwner(user?._id);
		case 'GUILD_ADMIN':
			return hasGuildPermissions(guildId, user);
		case 'USER':
			return true;
		default:
			return false;
	}
};

/**
 * Checks if the provided Discord ID is an
 * admin by querying the database.
 *
 * @param {string} _id - Discord user ID
 * @returns {Promise<boolean>}
 */
export const isAdminUser = async (_id) => {
	try {
		if (!_id) {
			return false;
		}

		const admin = await Admin.findById(_id);

		return admin?._id === _id;
	} catch (err) {
		log.error(err, logMeta);

		return false;
	}
};

/**
 * Checks if the user is authorized to add a bot.
 * The user must be the application owner or
 * the bot must be public or the user must be an admin.
 *
 * @param {string} _id - Discord user ID
 * @returns {Promise<boolean>}
 */
export const isAuthorizedToAddBot = async (_id) => {
	if (isApplicationOwner(_id)) {
		return true;
	}

	const [isPrivate, isAdmin] = await Promise.all([
		getIsPrivateSetting(),
		isAdminUser(_id),
	]);

	return !isPrivate || isAdmin;
};
