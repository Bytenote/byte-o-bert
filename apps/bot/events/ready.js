import log from '@byte-o-bert/logger';

const logMeta = { origin: import.meta.url };

export default {
	name: 'ready',
	once: true,
	/**
	 * Logs the successful login of the bot.
	 *
	 * @param {Object} client - Discord Client
	 */
	async execute(client) {
		log.info(`Logged in as ${client.user?.tag}!`, logMeta);
	},
};
