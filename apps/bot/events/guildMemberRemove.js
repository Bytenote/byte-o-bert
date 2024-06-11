import { Guild, User } from '@byte-o-bert/database/models';
import { hasGuildAdminPermissions } from '@byte-o-bert/shared/services/auth';
import log from '@byte-o-bert/logger';

const logMeta = { origin: import.meta.url };

export default {
	name: 'guildMemberRemove',
	/**
	 * Updates the member count in the database
	 * when a member leaves the guild.
	 *
	 * Also removes the guild from the user in the
	 * database, in case the user was an admin
	 * and was logged into the website to prevent
	 * unauthorized access after leaving the guild.
	 *
	 * If the bot triggers this event, it will not
	 * update the member count in the database, since
	 * the 'guildDelete' event will delete the guild
	 * from the database.
	 *
	 * @param {Object} member				- Member that left the guild
	 * @param {Object} member.user			- User Object
	 * @param {Object} member.guild			- Guild Object
	 * @param {Object} member.permissions	- Permissions Object
	 * @param {boolean} member.partial		- Partial boolean
	 */
	async execute({ user, guild, permissions, partial }) {
		try {
			if (user?.id !== process.env.DISCORD_CLIENT_ID) {
				const { id: guildId, memberCount: members } = guild ?? {};

				if (guildId) {
					// update member count
					await Guild.findOneAndUpdate({ _id: guildId }, { members });

					// check if user was an admin and is logged into website
					// if so, remove guild from user to prevent unauthorized access
					try {
						const wasAdmin = hasGuildAdminPermissions(permissions);

						if (wasAdmin) {
							const userDoc = await User.findOne({
								_id: user.id,
							});
							if (userDoc) {
								// remove guild from user
								const updatedGuilds = userDoc.guilds.filter(
									(g) => g.id !== guildId
								);

								await User.updateOne(
									{ _id: user.id },
									{ guilds: updatedGuilds }
								);
							}
						}
					} catch (err) {
						log.error(err, logMeta);
					}
				}
			}
		} catch (err) {
			log.error(err, logMeta);
		}
	},
};
