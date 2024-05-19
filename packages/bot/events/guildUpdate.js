import { Guild } from '@byte-o-bert/database/models';
import log from '@byte-o-bert/shared/services/log';

const logMeta = { origin: import.meta.url };

export default {
	name: 'guildUpdate',
	/**
	 * Updates the guild name or icon in the database,
	 * depending on what has changed.
	 *
	 * @param {Object} oldGuild	- Old guild object
	 * @param {Object} newGuild	- New guild object
	 */
	async execute(oldGuild, newGuild) {
		try {
			const { id: _id } = newGuild;
			const hasNameChanged = oldGuild.name !== newGuild.name;
			const hasIconChanged = oldGuild.icon !== newGuild.icon;

			if (hasNameChanged || hasIconChanged) {
				await Guild.findOneAndUpdate(
					{ _id },
					{
						...(hasNameChanged && { name: newGuild.name }),
						...(hasIconChanged && { icon: newGuild.icon }),
					},
					{ new: true }
				);
			}
		} catch (err) {
			log.error(err, logMeta);
		}
	},
};
