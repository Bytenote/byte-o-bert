import { PermissionsBitField } from 'discord.js';

/**
 * Checks if a user has admin permissions in a guild.
 *
 * @param {Object} permissions - Discord permissions Object
 * @returns {boolean}
 */
export const hasGuildAdminPermissions = (permissions) => {
	return permissions?.has(PermissionsBitField.Flags.Administrator);
};

/**
 * Checks if a user has the required permissions in a guild.
 * If the required permissions is an array,
 * it checks if the user has all of them.
 * More generalized than hasGuildAdminPermissions.
 *
 * @param {Object} userPerms				- Discord permissions Object
 * @param {string|string[]} requiredPerms	- Required permissions
 * @returns {boolean}
 */
export const hasGuildPermissions = (userPerms, requiredPerms) => {
	if (Array.isArray(requiredPerms)) {
		return requiredPerms.every((perm) => userPerms?.has(perm));
	}

	return userPerms?.has(requiredPerms);
};

/**
 * Checks if the discord ID is the owner of
 * the application.
 * Unauthenticated users have the value
 * null as their discord ID.
 *
 * @param {string|null} discordId - Discord ID of user
 * @returns {boolean}
 */
export const isApplicationOwner = (discordId) => {
	return !!(
		process.env.APPLICATION_OWNER_ID &&
		discordId === process.env.APPLICATION_OWNER_ID
	);
};
