import { Guild } from '@byte-o-bert/database/models';
import log from '@byte-o-bert/logger';

const logMeta = { origin: import.meta.url };

const resolvers = {
	Query: {
		/**
		 * Returns the entire guild object.
		 * Has to convert the commands Map to an array of commands.
		 *
		 * @param {Object} _		- The parent resolver
		 * @param {Object} args		- Arguments passed to the resolver
		 * @param {string} args._id	- The guild ID
		 * @returns {Object|null}
		 */
		async guild(_, { _id }) {
			try {
				const guildDoc = await Guild.findOne({ _id });

				// convert commands Map to array of commands values
				const keys = [...(guildDoc?.commands ?? [])];
				const commands = keys.map((key) => key[1]);

				const convertedGuild = { ...guildDoc._doc, commands };

				return convertedGuild;
			} catch (err) {
				log.error(err, logMeta);

				return null;
			}
		},
		/**
		 * Returns the general settings of a guild.
		 * Excludes the commands field.
		 *
		 * @param {Object} _		- The parent resolver
		 * @param {Object} args		- Arguments passed to the resolver
		 * @param {string} args._id	- The guild ID
		 * @returns {Object|null}
		 */
		async guildGeneral(_, { _id }) {
			try {
				const guildDoc = await Guild.findOne(
					{ _id },
					{
						commands: 0,
					}
				);

				return guildDoc;
			} catch (err) {
				log.error(err, logMeta);

				return null;
			}
		},
		/**
		 * Returns an array of commands from a guild.
		 *
		 * @param {Object} _		- The parent resolver
		 * @param {Object} args		- Arguments passed to the resolver
		 * @param {string} args._id	- The guild ID
		 * @returns {Object[]|null}
		 */
		async guildCommands(_, { _id }) {
			try {
				const guildDoc = await Guild.findOne(
					{ _id },
					{
						commands: 1,
					}
				);

				// convert commands Map to array of commands values
				const keys = [...(guildDoc?.commands ?? [])];
				const commands = keys.map((key) => key[1]);

				return commands ?? [];
			} catch (err) {
				log.error(err, logMeta);

				return null;
			}
		},
		/**
		 * Returns a single command from a guild.
		 *
		 * @param {Object} _			- The parent resolver
		 * @param {Object} args			- Arguments passed to the resolver
		 * @param {string} args._id		- The guild ID
		 * @param {string} args.name	- The command name
		 * @returns {Object|null}
		 */
		async guildCommand(_, { _id, name }) {
			try {
				const guildDoc = await Guild.findOne(
					{ _id },
					{ [`commands.${name}`]: 1 }
				);

				return guildDoc?.commands?.get(name);
			} catch (err) {
				log.error(err, logMeta);

				return null;
			}
		},
	},
};

export default resolvers;
