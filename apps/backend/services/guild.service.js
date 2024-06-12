import axios from 'axios';
import { Guild } from '@byte-o-bert/database/models';
import log from '@byte-o-bert/logger';
import { DISCORD_API_BASE_URL } from '@byte-o-bert/shared/utils/constants';
import { isAuthenticated, isAuthorizedToAddBot } from './auth.service.js';

const logMeta = { origin: import.meta.url };

/**
 * Gets all guild IDs from the database.
 * deleteAt is included to check if the guild was
 * soft deleted and should be ignored.
 * Typically used as a fallback when the Discord API
 * is not available.
 *
 * @returns {Object[]}
 */
export const getBotGuildIDsFromDB = async () => {
	try {
		const guilds = await Guild.find(
			{},
			{
				_id: 1,
				deletedAt: 1,
			}
		);

		return guilds ?? [];
	} catch (err) {
		log.error(err, logMeta);

		return null;
	}
};

/**
 * Requests the bot's guilds from the Discord API.
 * Heavily rate limited, should only be used with
 * 'getBotGuildIDsFromDB' as a fallback.
 *
 * @returns {Promise}
 */
export const getBotGuildsFromDC = async () => {
	try {
		const { data: guilds } = await axios.get(
			`${DISCORD_API_BASE_URL}/users/@me/guilds`,
			{
				headers: {
					Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
				},
			}
		);

		return guilds;
	} catch (err) {
		log.debug(err?.message + ' for getBotGuildsFromDC', logMeta);

		return null;
	}
};

/**
 * Compares the bot's guilds with the user's guilds
 * and returns the separated guilds in form of an object
 * with two arrays:
 * - mutual: guilds where the bot and the user are members
 * - eligible: guilds where the user can add the bot
 * If the bot is private and the user is not the application
 * owner, the eligible array will be empty.
 *
 * @param {Object[]} botGuilds	- Bot guilds
 * @param {Object[]} userGuilds	- User guilds
 * @param {Object} _id			- User Discord ID
 * @returns {Object}
 */
export const getUserBotGuilds = async (botGuilds, userGuilds, _id) => {
	let authorizedToAddBot = false;

	try {
		authorizedToAddBot = await isAuthorizedToAddBot(_id);
	} catch (err) {
		log.error(err, logMeta);
	} finally {
		const validGuilds = _getValidGuilds(userGuilds);

		return validGuilds.reduce(
			(acc, guild) => {
				const hasGuild = botGuilds.find(
					(botGuild) =>
						!botGuild.deletedAt &&
						(botGuild.id
							? botGuild.id === guild.id // botGuild from Discord API
							: botGuild._id === guild.id) // botGuild from DB
				);

				if (hasGuild) {
					acc.mutual.push(guild);
				} else if (authorizedToAddBot) {
					acc.eligible.push(guild);
				}

				return acc;
			},
			{ mutual: [], eligible: [] }
		);
	}
};

/**
 * Checks if the user is authenticated and has the necessary
 * permissions in the guild.
 * Minimum permission: MANAGE_GUILD (or 0x20)
 *
 * @param {string} _id	- Guild ID
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const hasGuildPermissions = (_id, user) => {
	try {
		if (isAuthenticated(user)) {
			return user.guilds?.some(
				(guild) =>
					guild.id === _id && (guild.permissions & 0x20) === 0x20
			);
		}

		return false;
	} catch (err) {
		log.error(err, logMeta);

		return false;
	}
};

/**
 * Filters out guilds where the user has no
 * permissions to manage the guild and thus
 * cannot add the bot to it.
 * @private
 *
 * @param {Object[]} guilds - User guilds
 * @returns {Object[]}
 */
const _getValidGuilds = (guilds) =>
	guilds.filter((guild) => (guild.permissions & 0x20) === 0x20);
