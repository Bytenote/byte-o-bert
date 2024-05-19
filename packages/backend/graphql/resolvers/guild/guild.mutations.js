import { GraphQLError } from 'graphql';
import { Guild } from '@byte-o-bert/database/models';
import {
	createCommand,
	deleteCommand,
	updateCommand,
	updatePrefix,
} from '@byte-o-bert/shared/services/guild';
import log from '@byte-o-bert/shared/services/log';

const logMeta = { origin: import.meta.url };

const resolvers = {
	Mutation: {
		/**
		 * Updates the prefix of a guild, if it is not
		 * already in use.
		 *
		 * @param {Object} _			- The parent resolver
		 * @param {Object} args			- Arguments passed to the resolver
		 * @param {string} args._id		- The guild ID
		 * @param {string} args.prefix	- The new prefix
		 * @returns {string|null}
		 */
		async updatePrefix(_, { _id, prefix }) {
			try {
				const { success, msg } = await updatePrefix(_id, prefix);

				if (!success) {
					return new GraphQLError(msg);
				}

				return prefix;
			} catch (err) {
				log.error(err, logMeta);

				return new GraphQLError('Internal Error');
			}
		},
		/**
		 * Creates a new command for a guild, if it does not
		 * already exist.
		 *
		 * @param {Object} _			- The parent resolver
		 * @param {Object} args			- Arguments passed to the resolver
		 * @param {string} args._id		- The guild ID
		 * @param {string} args.name	- The command name
		 * @param {string} args.action	- The command action
		 * @param {Object} context		- GraphQL context
		 * @param {Object} context.user	- The authenticated user
		 * @returns {Object|boolean}
		 */
		async createCommand(_, { _id, name, action }, { user }) {
			try {
				const { success, command, msg } = await createCommand(
					_id,
					name,
					action,
					user.uniqueName
				);

				if (!success) {
					return new GraphQLError(msg);
				}

				return command;
			} catch (err) {
				log.error(err, logMeta);

				return new GraphQLError('Internal Error');
			}
		},
		/**
		 * Updates the action of a command for a guild, if it differs
		 * from the current action.
		 *
		 * @param {Object} _			- The parent resolver
		 * @param {Object} args			- Arguments passed to the resolver
		 * @param {string} args._id		- The guild ID
		 * @param {string} args.name	- The command name
		 * @param {string} args.action	- The new command action
		 * @param {Object} context		- GraphQL context
		 * @param {Object} context.user	- The authenticated user
		 * @returns {Object|null}
		 */
		async updateCommand(_, { _id, name, action }, { user }) {
			try {
				const { success, command, msg } = await updateCommand(
					_id,
					name,
					action,
					user.uniqueName
				);

				if (!success) {
					return new GraphQLError(msg);
				}

				return command;
			} catch (err) {
				log.error(err, logMeta);

				return new GraphQLError('Internal Error');
			}
		},
		/**
		 * Updates the active state of a command for a guild, if it differs
		 * from the current active state.
		 *
		 * @param {Object} _			- The parent resolver
		 * @param {Object} args			- Arguments passed to the resolver
		 * @param {string} args._id		- The guild ID
		 * @param {string} args.name	- The command name
		 * @param {boolean} args.active	- The new active state
		 * @param {Object} context		- GraphQL context
		 * @param {Object} context.user	- The authenticated user
		 * @returns {Object|null}
		 */
		async updateCommandActive(
			_,
			{ _id, name, active: updatedActive },
			{ user }
		) {
			try {
				const guildDoc = await Guild.findOne(
					{ _id },
					`commands.${name}`
				);
				if (guildDoc?._id) {
					const { action, author, active, createdAt } =
						guildDoc?.commands?.get(name) ?? {};
					if (action) {
						const command = {
							guildId: _id,
							name,
							action,
							author,
							updatedBy: user.uniqueName,
							active: updatedActive,
							createdAt,
							updatedAt: new Date().toISOString(),
						};

						if (active === updatedActive) {
							return command;
						}

						await Guild.updateOne(
							{ _id },
							{
								$set: {
									[`commands.${name}`]: command,
								},
							}
						);

						return command;
					}

					return new GraphQLError(`Command does not exist`);
				}
			} catch (err) {
				log.error(err, logMeta);

				return new GraphQLError('Internal Error');
			}
		},
		/**
		 * Deletes a command from a guild.
		 *
		 * @param {Object} _			- The parent resolver
		 * @param {Object} args			- Arguments passed to the resolver
		 * @param {string} args._id		- The guild ID
		 * @param {string} args.name	- The command name
		 * @returns {boolean|null}
		 */
		async deleteCommand(_, { _id, name }) {
			try {
				const { success, msg } = await deleteCommand(_id, name);

				if (!success) {
					return new GraphQLError(msg);
				}

				return true;
			} catch (err) {
				log.error(err, logMeta);

				return new GraphQLError('Internal Error');
			}
		},
	},
};

export default resolvers;
