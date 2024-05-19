import { Guild } from '@byte-o-bert/database/models';
import { getChannelCountPerType } from '../services/guild.service.js';
import log from '@byte-o-bert/shared/services/log';

const logMeta = { origin: import.meta.url };

export default {
	name: 'guildCreate',
	/**
	 * Updates the guild's information in the database
	 * when the bot joins a new guild.
	 * Only creates the custom fields (prefix, commands)
	 * on the initial insert/creation, in case the event
	 * is triggered again after the bot has already joined
	 * the guild.
	 *
	 * @param {Object} guild				- Guild Object
	 * @param {string} guild.id				- ID of the guild
	 * @param {string} guild.name			- Name of the guild
	 * @param {string} guild.icon			- Icon of the guild
	 * @param {number} guild.memberCount	- Member count of the guild
	 * @param {Object} guild.roles			- Collection of guild roles
	 */
	async execute({
		id: _id,
		name,
		icon,
		memberCount: members,
		roles,
		channels,
	}) {
		try {
			const { tChannels, vChannels } = getChannelCountPerType(channels);
			const gRoles = roles.cache.filter(
				(role) => role?.name !== '@everyone'
			).size;

			await Guild.updateOne(
				{ _id },
				{
					$set: {
						name,
						icon,
						members,
						tChannels,
						vChannels,
						roles: gRoles,
						deletedAt: null,
					},
					$setOnInsert: {
						prefix: '!',
						commands: new Map(),
					},
				},
				{ upsert: true }
			);
		} catch (err) {
			log.error(err, logMeta);
		}
	},
};
