import { Guild } from '@byte-o-bert/database/models';
import log from '@byte-o-bert/logger';

const logMeta = { origin: import.meta.url };

/**
 * Updates the prefix of a guild, if it is not
 * already in use.
 *
 * @param {string} _id			- Guild ID
 * @param {string} prefix		- New prefix
 * @param {boolean} isVerbose	- Whether to return verbose messages
 * @returns {Object|null}
 */
export const updatePrefix = async (_id, prefix, isVerbose) => {
	try {
		const guildDoc = await Guild.findOneAndUpdate(
			{
				_id,
				prefix: { $ne: prefix },
			},
			{ $set: { prefix } },
			{ new: true }
		);

		if (!guildDoc) {
			// already in use
			return {
				success: false,
				msg: 'Prefix is already in use',
			};
		}

		// prefix updated
		return {
			success: true,
			msg: isVerbose
				? `Prefix updated to \`${prefix}\``
				: 'Prefix updated',
		};
	} catch (err) {
		log.error(err, logMeta);

		return null;
	}
};

/**
 * Creates a new command for a guild, if it does
 * not already exist.
 *
 * @param {string} _id			- Guild ID
 * @param {string} name			- Command name
 * @param {string} action		- Command action
 * @param {string} author		- Command author
 * @param {boolean} isVerbose	- Whether to return verbose messages
 * @returns {Object|null}
 */
export const createCommand = async (_id, name, action, author, isVerbose) => {
	try {
		const command = {
			guildId: _id,
			name,
			action,
			active: true,
			author,
			createdAt: new Date().toISOString(),
		};

		const guildDoc = await Guild.findOneAndUpdate(
			{
				_id,
				[`commands.${name}`]: { $exists: false },
			},
			{
				$set: {
					[`commands.${name}`]: command,
				},
			},
			{ new: true }
		);

		if (!guildDoc) {
			// command already exists
			return {
				success: false,
				msg: isVerbose
					? `Command \`${name}\` already exists`
					: 'Command already exists',
			};
		}

		// command created
		return {
			success: true,
			msg: isVerbose
				? `Command \`${name}\` has been created with action \`${action}\``
				: 'Command has been created',
			command,
		};
	} catch (err) {
		log.error(err, logMeta);

		return null;
	}
};

/**
 * Updates the action of a command for a guild,
 * if the command exists and the action differs
 * from the current one.
 *
 * @param {string} _id				- Guild ID
 * @param {string} cmdName			- Command name
 * @param {string} updatedAction	- Updated action
 * @param {string} updatedBy		- User updating the command
 * @param {boolean} isVerbose		- Whether to return verbose messages
 * @returns {Object|null}
 */
export const updateCommand = async (
	_id,
	cmdName,
	updatedAction,
	updatedBy,
	isVerbose
) => {
	try {
		const guildDoc = await Guild.findOne({ _id }, `commands.${cmdName}`);
		if (guildDoc?._id) {
			const { name, action, author, active, createdAt } =
				guildDoc?.commands?.get(cmdName) ?? {};
			if (name) {
				const command = {
					guildId: _id,
					name: cmdName,
					action: updatedAction,
					author,
					updatedBy,
					active,
					createdAt,
					updatedAt: new Date().toISOString(),
				};

				if (action === updatedAction) {
					// no action change
					return {
						success: false,
						msg: isVerbose
							? `Command \`${cmdName}\` is already set to action \`${updatedAction}\``
							: 'Command already set to this action',
					};
				}

				await Guild.updateOne(
					{ _id },
					{
						$set: {
							[`commands.${cmdName}`]: command,
						},
					}
				);

				// command updated
				return {
					success: true,
					msg: isVerbose
						? `Command \`${cmdName}\` has been updated with action \`${updatedAction}\``
						: 'Command has been updated',
					command,
				};
			}

			// command does not exist
			return {
				success: false,
				msg: isVerbose
					? `Command \`${cmdName}\` does not exist`
					: 'Command does not exist',
			};
		}

		// guild does not exist
		return {
			success: false,
			msg: isVerbose
				? 'Could not find your server, try adding me again'
				: 'Could not find your server',
		};
	} catch (err) {
		log.error(err, logMeta);

		return null;
	}
};

/**
 * Deletes a command from a guild, if it exists.
 *
 * @param {string} _id			- Guild ID
 * @param {string} cmdName		- Command name
 * @param {boolean} isVerbose	- Whether to return verbose messages
 * @returns {Object|null}
 */
export const deleteCommand = async (_id, cmdName, isVerbose) => {
	try {
		const guildDoc = await Guild.findOne({ _id }, `commands.${cmdName}`);
		if (guildDoc?._id) {
			const { name } = guildDoc?.commands?.get(cmdName) ?? {};
			if (name) {
				await Guild.updateOne(
					{ _id },
					{ $unset: { [`commands.${cmdName}`]: 1 } }
				);

				// command deleted
				return {
					success: true,
					msg: isVerbose
						? `Command \`${cmdName}\` has been deleted`
						: 'Command has been deleted',
				};
			}

			// no command found
			return {
				success: false,
				msg: isVerbose
					? `Command \`${cmdName}\` does not exist`
					: 'Command does not exist',
			};
		}

		// no guild found
		return {
			success: false,
			msg: isVerbose
				? 'Could not find your server, try adding me again'
				: 'Could not find your server',
		};
	} catch (err) {
		log.error(err, logMeta);

		return null;
	}
};
