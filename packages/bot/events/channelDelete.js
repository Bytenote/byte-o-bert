import { Guild } from '@byte-o-bert/database/models';
import { getChannelCountPerType } from '../services/guild.service.js';
import log from '@byte-o-bert/shared/services/log';

const logMeta = { origin: import.meta.url };

export default {
	name: 'channelDelete',
	/**
	 * Updates the channel count in the database
	 * when a text or voice channel is deleted.
	 *
	 * @param {Object} channel			- Channel that was deleted
	 * @param {string} channel.guildId	- ID of the guild
	 * @param {number} channel.type		- Type of the channel (0: text, 2: voice)
	 * @param {Object} channel.guild	- Guild Object
	 */
	async execute({ guildId: _id, type, guild }) {
		try {
			const { vChannels, tChannels } = getChannelCountPerType(
				guild.channels
			);

			if (type === 0 || type === 2) {
				await Guild.findOneAndUpdate(
					{ _id },
					{
						...(type === 0 && { tChannels }),
						...(type === 2 && { vChannels }),
					},
					{ new: true }
				);
			}
		} catch (err) {
			log.error(err, logMeta);
		}
	},
};
