import { Guild } from '@byte-o-bert/database/models';
import log from '@byte-o-bert/shared/services/log';

const logMeta = { origin: import.meta.url };

export default {
	name: 'guildDelete',
	/**
	 * Deletes a guild from the database when the bot
	 * is removed from it.
	 * Soft deletes the guild by setting the deletedAt
	 * field to the current date, so that the guild
	 * information is still available in case the bot
	 * was removed unintentionally.
	 *
	 * @param {Object} guild	- Discord guild
	 * @param {String} guild.id - ID of guild
	 */
	async execute({ id: _id }) {
		try {
			await Guild.findOneAndUpdate(
				{ _id },
				{ deletedAt: new Date().toISOString() }
			);
		} catch (err) {
			log.error(err, logMeta);
		}
	},
};
