import client from '../../graphql';
import {
	CREATE_COMMAND,
	UPDATE_COMMAND,
} from '../../graphql/mutations/guildMutations';
import { GET_USER } from '../../graphql/queries/userQueries';
import {
	dialogVar,
	snackbarVar,
} from '../../graphql/reactiveVars/userInteractionVars';
import {
	COMMAND_FRAGMENT,
	COMMAND_NAME_ACTION_FRAGMENT,
} from '../../graphql/fragments/guildFragments';
import { ADD_ADMINS_BY_IDS } from '../../graphql/mutations/adminMutations';
import {
	ADMIN_FRAGMENT,
	ADMIN_ID_FRAGMENT,
} from '../../graphql/fragments/adminFragments';
import { displayServerError } from '../UserInteraction/userInteraction.helpers';

export const commandDialogSubmitter = async (e) => {
	e.preventDefault();

	const {
		value: { guildId, cmdName, type },
	} = dialogVar();
	if (type === 'edit') {
		await _updateCommand(e, guildId, cmdName, type);
	} else if (type === 'create') {
		await _createCommand(e, guildId, type);
	}

	// close dialog
	dialogVar({ isOpen: false, key: null, value: null });
};

export const adminDialogSubmitter = async (e) => {
	e.preventDefault();

	const formData = new FormData(e.target);
	const ids = formData.get('ids')?.trim()?.replaceAll(' ', '')?.split(',');

	const isValid = _validateAdminIds(ids);
	if (isValid) {
		await _addNewAdmins(ids);

		// close dialog
		dialogVar({ isOpen: false, key: null, value: null });
	}
};

export const handleDialogCancel = (e) => {
	// close dialog
	dialogVar({ isOpen: false, key: null, value: null });
};

/**
 * Updates a command with a new action.
 * If the new action is valid, an optimistic response
 * is used to update the cache immediately, before
 * the server responds and the cache is updated again
 * with the confirmed new action.
 *
 * @param {Event} e			- Event object
 * @param {string} guildId	- ID of current guild
 * @param {string} cmdName	- Name of command to update
 * @param {string} type		- Type of dialog: 'edit' | 'create'
 */
const _updateCommand = async (e, guildId, cmdName, type) => {
	try {
		// get command action from form
		const formData = new FormData(e.target);
		const action = formData.get('action')?.trim();

		const isValid = _validateCommand(guildId, cmdName, action, type);
		if (isValid) {
			await client.mutate({
				mutation: UPDATE_COMMAND,
				variables: { id: guildId, name: cmdName, action },
				optimisticResponse: {
					__typename: 'Mutation',
					updateCommand: {
						__typename: 'GuildCommand',
						guildId,
						name: cmdName,
						action,
						isOptimistic: true,
					},
				},
				update(cache, { data }) {
					const { action: updatedAction, isOptimistic } =
						data?.updateCommand ?? {};
					if (typeof updatedAction === 'string') {
						const guildCommandCacheId = cache.identify({
							__typename: 'GuildCommand',
							guildId,
							name: cmdName,
						});

						// update command action in cache
						cache.modify({
							id: guildCommandCacheId,
							fields: {
								action() {
									if (isOptimistic) {
										snackbarVar({
											isOpen: true,
											key: 'CommandUpdated',
										});
									}

									return updatedAction;
								},
							},
						});
					}
				},
			});
		}
	} catch (err) {
		displayServerError(err);
	}
};

/**
 * Creates a new command.
 * If the command name and action are valid, an optimistic
 * response is used to update the cache immediately, before
 * the server responds and the cache is updated again with
 * the confirmed new command.
 *
 * @param {Event} e			- Event object
 * @param {string} guildId	- ID of current guild
 * @param {string} type		- Type of dialog: 'edit' | 'create'
 */
const _createCommand = async (e, guildId, type) => {
	try {
		// get command name and action from form
		const formData = new FormData(e.target);
		const cmdName = formData.get('name')?.trim();
		const action = formData.get('action')?.trim();

		const isValid = _validateCommand(guildId, cmdName, action, type);
		if (isValid) {
			const data = client.readQuery({
				query: GET_USER,
			});
			const author = data?.user?.name;

			await client.mutate({
				mutation: CREATE_COMMAND,
				variables: { id: guildId, name: cmdName, action },
				optimisticResponse: {
					__typename: 'Mutation',
					createCommand: {
						__typename: 'GuildCommand',
						guildId,
						name: cmdName,
						action,
						active: true,
						author,
						isOptimistic: true,
					},
				},
				update(cache, { data }) {
					const { isOptimistic, ...newCommand } =
						data?.createCommand ?? {};

					if (newCommand) {
						// add normalized command to cache
						const newCommandRef = cache.writeFragment({
							data: newCommand,
							fragment: COMMAND_FRAGMENT,
						});

						// update guildCommands array with ref to new command
						cache.modify({
							fields: {
								guildCommands(existingCommands = []) {
									if (isOptimistic) {
										snackbarVar({
											isOpen: true,
											key: 'CommandCreated',
										});
									}

									return [...existingCommands, newCommandRef];
								},
							},
						});
					}
				},
			});
		}
	} catch (err) {
		displayServerError(err);
	}
};

/**
 * Adds a list of new admins.
 * If the admin IDs are valid, the cache is updated
 * with the new admins.
 * Since the data is retrieved from Discord, the cache
 * cannot be updated with an optimistic response.
 *
 * @param {string[]|null} ids - List of admin IDs to add
 */
const _addNewAdmins = async (ids) => {
	try {
		await client.mutate({
			mutation: ADD_ADMINS_BY_IDS,
			variables: { ids },
			update: (cache, { data }) => {
				const newAdmins = data?.addAdminsByIds;

				if (newAdmins) {
					// normalize each new admin and get their references
					const newAdminRefs = newAdmins.map((admin) =>
						cache.writeFragment({
							data: admin,
							fragment: ADMIN_FRAGMENT,
						})
					);

					// update admins array with refs to new admins
					cache.modify({
						fields: {
							admins(existingAdmins = []) {
								snackbarVar({
									isOpen: true,
									key: 'AdminAdded',
								});

								return [...existingAdmins, ...newAdminRefs];
							},
						},
					});
				}
			},
		});
	} catch (err) {
		displayServerError(err);
	}
};

const _validateCommand = (guildId, cmdName, action, type) => {
	if (!cmdName || cmdName.length < 1 || !action || action.length < 1) {
		const isName = !cmdName || cmdName.length < 1;
		snackbarVar({
			isOpen: true,
			key: `Command${isName ? 'Name' : 'Action'}Invalid`,
		});

		return false;
	}

	if (cmdName.includes(' ')) {
		snackbarVar({
			isOpen: true,
			key: 'CommandNameSpacesInvalid',
		});

		return false;
	}

	return _commandIsNew(guildId, cmdName, action, type);
};

const _validateAdminIds = (ids) => {
	const MIN = 17;
	const MAX = 18;
	const MAX_IDS = 10;

	if (!ids || ids.length < 1 || ids.length > MAX_IDS) {
		snackbarVar({
			isOpen: true,
			key: 'AdminIdOverLimit',
		});

		return false;
	}

	const isValid = ids.every((id) => {
		if (isNaN(id) || id.length < MIN || id.length > MAX) {
			snackbarVar({
				isOpen: true,
				key: 'AdminIdInvalid',
			});

			return false;
		}

		return _adminIsNew(id);
	});

	return isValid;
};

/**
 * Checks if a command already exists for a newly created command,
 * or if the command action is the same for an edited command.
 * If either condition is met, a snackbar message is displayed
 * and the function returns false.
 * Otherwise, the function returns true.
 *
 * @param {string} guildId	- ID of current guild
 * @param {string} cmdName	- Name of command to check
 * @param {string} action	- Action of command
 * @param {string} type		- Type of dialog: 'edit' | 'create'
 * @returns {boolean}		- Whether the command is valid
 */
const _commandIsNew = (guildId, cmdName, action, type) => {
	const guildCommandCacheId = client.cache.identify({
		__typename: 'GuildCommand',
		guildId,
		name: cmdName,
	});
	const command = client.readFragment({
		id: guildCommandCacheId,
		fragment: COMMAND_NAME_ACTION_FRAGMENT,
	});

	if (command) {
		if (type === 'create') {
			snackbarVar({
				isOpen: true,
				key: 'CommandExists',
			});

			return false;
		}

		if (type === 'edit') {
			const { action: oldAction } = command;
			if (oldAction === action) {
				snackbarVar({
					isOpen: true,
					key: 'CommandActionSame',
				});

				return false;
			}
		}
	}

	return true;
};

const _adminIsNew = (id) => {
	const adminCacheId = client.cache.identify({
		__typename: 'Admin',
		_id: id,
	});
	const admin = client.readFragment({
		id: adminCacheId,
		fragment: ADMIN_ID_FRAGMENT,
	});

	if (admin) {
		snackbarVar({
			isOpen: true,
			key: 'AdminExists',
		});

		return false;
	}

	return true;
};
