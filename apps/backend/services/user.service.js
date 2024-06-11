import axios from 'axios';
import { User } from '@byte-o-bert/database/models';
import log from '@byte-o-bert/logger';
import { DISCORD_API_BASE_URL } from '@byte-o-bert/shared/utils/constants';
import { decrypt } from '../utils/helpers.js';

const logMeta = { origin: import.meta.url };

/**
 * Requests the user's guilds from the Discord API
 * using the given credentials.
 * Heavily rate limited by Discord.
 * Use guilds of user from context as fallback.
 *
 * @param {Object} accessToken - Discord access token
 * @returns {Promise}
 */
export const getUserGuildsFromDC = async (accessToken) => {
	try {
		const decryptedToken = decrypt(accessToken);
		const { data: guilds } = await axios.get(
			`${DISCORD_API_BASE_URL}/users/@me/guilds`,
			{
				headers: {
					Authorization: `Bearer ${decryptedToken}`,
				},
			}
		);

		return guilds;
	} catch (err) {
		log.debug(err.message + ' for getUserGuildsFromDC', logMeta);

		return null;
	}
};

/**
 * Updates the user's guilds in the database.
 * Typically used after getting the guilds from the
 * Discord API to keep the database up to date.
 * Returns the updated user guilds.
 *
 * @param {string} _id		- Discord user ID
 * @param {Object[]} guilds - User guilds
 * @returns {Array|null}
 */
export const updateUserGuilds = async (_id, guilds) => {
	try {
		const userDoc = await User.findOneAndUpdate(
			{ _id },
			{ guilds },
			{
				new: true,
				upsert: true,
			}
		);

		return userDoc.guilds;
	} catch (err) {
		log.error(err, logMeta);

		return null;
	}
};
