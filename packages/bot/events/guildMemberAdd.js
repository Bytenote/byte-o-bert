import { Guild } from '@byte-o-bert/database/models';
import log from '@byte-o-bert/shared/services/log';

const logMeta = { origin: import.meta.url };

export default {
	name: 'guildMemberAdd',
	/**
	 * Updates the member count of a guild when a
	 * user joins.
	 * If the bot triggers this event, it will not
	 * update the member count in the database, since
	 * the 'guildCreate' event will handle that.
	 *
	 * @param {Object} member		- Member that joined
	 * @param {Object} member.user	- User Object
	 * @param {Object} member.guild	- Guild Object of the member
	 */
	async execute({ user, guild }) {
		try {
			if (user?.id !== process.env.DISCORD_CLIENT_ID) {
				const { id: _id, memberCount: members } = guild;

				await Guild.findOneAndUpdate({ _id }, { members });
			}
		} catch (err) {
			log.error(err, logMeta);
		}
	},
};
