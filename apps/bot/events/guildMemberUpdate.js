import { User } from '@byte-o-bert/database/models';
import { hasGuildAdminPermissions } from '@byte-o-bert/shared/services/auth';
import log from '@byte-o-bert/logger';

const logMeta = { origin: import.meta.url };

export default {
	name: 'guildMemberUpdate',
	/**
	 * Checks if the member has gained or lost admin
	 * permissions and updates the specified guild
	 * in the user's guilds array in the database,
	 * to prevent unauthorized access or to grant newly
	 * gained access via the website.
	 *
	 * Updates the permissions in the user's guilds array
	 * also if the oldMember was a partial, since it the
	 * oldPerms cannot be determined in that case.
	 *
	 * @param {Object} oldMember				- Old member Object
	 * @param {Object} oldMember.permissions	- Permissions Object
	 * @param {boolean} oldMember.partial		- Partial boolean
	 * @param {Object} newMember				- Updated member Object
	 * @param {Object} newMember.user			- User Object
	 * @param {Object} newMember.guild			- Guild Object
	 * @param {Object} newMember.permissions	- Permissions Object
	 */
	async execute(
		{ permissions: oldPerms, partial: oldPartial },
		{ user, guild, permissions: newPerms }
	) {
		const oldIsAdmin = hasGuildAdminPermissions(oldPerms);
		const newIsAdmin = hasGuildAdminPermissions(newPerms);

		if (oldIsAdmin !== newIsAdmin || oldPartial) {
			try {
				const newPermissions = Number(newPerms.bitfield);

				await User.findOneAndUpdate(
					{ _id: user.id },
					{
						$set: {
							'guilds.$[elem].permissions': newPermissions,
						},
					},
					{
						arrayFilters: [{ 'elem.id': guild.id }],
					}
				);
			} catch (err) {
				log.error(err, logMeta);
			}
		}
	},
};
