import log from '@byte-o-bert/shared/services/log';
import {
	getBotGuildIDsFromDB,
	getBotGuildsFromDC,
	getUserBotGuilds,
} from '../../../services/guild.service.js';
import {
	getUserGuildsFromDC,
	updateUserGuilds,
} from '../../../services/user.service.js';

const logMeta = { origin: import.meta.url };

const resolvers = {
	Query: {
		/**
		 * Returns Object of two arrays:
		 * - mutual: same guilds between the bot and the user
		 * - eligible: guilds where the user can add the bot
		 * If the user is not authenticated, null
		 * is returned.
		 *
		 * Tries to get the guilds from the Discord API,
		 * but falls back to the database if the API
		 * requests fail.
		 *
		 * If the user's guilds have changed, the user's guilds
		 * in the database are updated to display the up-to-date
		 * guilds in the frontend.
		 *
		 * @param {Object} _parent				- The parent resolver
		 * @param {Object} _args				- Arguments passed to the resolver
		 * @param {Object} context				- GraphQL context
		 * @param {Object|null} context.user	- The authenticated user or null
		 * @returns {Object[]|null}
		 */
		async userBotGuilds(_parent, _args, { user }) {
			try {
				const botGuildPromise = getBotGuildsFromDC();
				const userGuildPromise = getUserGuildsFromDC(user.accessToken);

				const [botGuilds, userGuilds] = await Promise.all([
					botGuildPromise,
					userGuildPromise,
				]);

				if (userGuilds && user.guilds.length !== userGuilds.length) {
					// update the user's guilds on change
					updateUserGuilds(user._id, userGuilds).catch((err) =>
						log.warn(err, logMeta)
					);
				}

				const guilds = await getUserBotGuilds(
					botGuilds,
					userGuilds,
					user._id
				);

				return guilds;
			} catch (err) {
				log.debug(err, logMeta);

				try {
					const botGuilds = await getBotGuildIDsFromDB();
					const userGuilds = user.guilds;

					const guilds = await getUserBotGuilds(
						botGuilds,
						userGuilds,
						user._id
					);

					return guilds;
				} catch (err) {
					log.error(err, logMeta);
				}
			}
		},
	},
};

export default resolvers;
