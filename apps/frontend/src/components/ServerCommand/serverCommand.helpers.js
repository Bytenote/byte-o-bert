import client from '../../graphql/index.js';
import {
	DELETE_COMMAND,
	UPDATE_COMMAND_ACTIVE,
} from '../../graphql/mutations/guildMutations.js';
import {
	dialogVar,
	snackbarVar,
} from '../../graphql/reactiveVars/userInteractionVars.js';
import { displayServerError } from '../UserInteraction/userInteraction.helpers.js';

/**
 * Handler for displaying the command delete
 * dialog.
 * The button name contains the guildId and
 * command name, separated by '::'.
 *
 * @param {Event} e - Event object
 */
export const deleteHandler = (e) => {
	const btnName = e.currentTarget.name;
	const [guildId, cmdName] = btnName.split('::');

	dialogVar({
		isOpen: true,
		key: 'DeleteCommand',
		value: { guildId, cmdName },
	});
};

/**
 * Handler for displaying the command edit
 * dialog.
 * The button name contains the guildId and
 * command name, separated by '::'.
 *
 * @param {Event} e - Event object
 */
export const editHandler = (e) => {
	const btnName = e.currentTarget.name;
	const [guildId, cmdName] = btnName.split('::');

	dialogVar({
		isOpen: true,
		key: 'CommandDialog',
		value: { guildId, cmdName, type: 'edit' },
	});
};

/**
 * Handler for displaying the command create
 * dialog.
 * The button name attribute is the guildId.
 *
 * @param {Event} e - Event object
 */
export const createHandler = (e) => {
	const guildId = e.currentTarget.name;

	dialogVar({
		isOpen: true,
		key: 'CommandDialog',
		value: { guildId, type: 'create' },
	});
};

/**
 * Updates the active state of a command.
 * If the update is successful, an optimistic response
 * is used to update the cache immediately, before
 * the server responds and the cache is updated again
 * with the new active state.
 *
 * @param {Event} e - Event object
 */
export const switchHandler = async (e) => {
	const switchName = e.currentTarget.name;
	const [guildId, cmdName] = switchName.split('::');

	try {
		await client.mutate({
			mutation: UPDATE_COMMAND_ACTIVE,
			variables: { id: guildId, name: cmdName, active: e.target.checked },
			optimisticResponse: {
				__typename: 'Mutation',
				updateCommandActive: {
					__typename: 'GuildCommand',
					guildId,
					name: cmdName,
					active: e.currentTarget.checked,
					isOptimistic: true,
				},
			},
			update: (cache, { data }) => {
				const { active, isOptimistic } =
					data?.updateCommandActive ?? {};
				if (typeof active === 'boolean') {
					const guildCommandCacheId = cache.identify({
						__typename: 'GuildCommand',
						guildId,
						name: cmdName,
					});

					// update cache with new active state
					cache.modify({
						id: guildCommandCacheId,
						fields: {
							active() {
								if (isOptimistic) {
									snackbarVar({
										isOpen: true,
										key: active
											? 'CommandEnabled'
											: 'CommandDisabled',
									});
								}

								return active;
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

/**
 * Deletes a command.
 * If the deletion is successful, the command is
 * removed from the guildCommands query and
 * evicted from the cache.
 */
export const deleteCommandSubmit = async () => {
	const { guildId, cmdName: name } = dialogVar()?.value ?? {};

	try {
		await client.mutate({
			mutation: DELETE_COMMAND,
			variables: { id: guildId, name },
			update: (cache, { data }) => {
				if (data?.deleteCommand) {
					const guildCommandCacheId = cache.identify({
						__typename: 'GuildCommand',
						guildId,
						name,
					});

					// remove the reference from the guildCommands query
					cache.modify({
						fields: {
							guildCommands(existingCommands = []) {
								snackbarVar({
									isOpen: true,
									key: 'CommandDeleted',
								});

								return existingCommands.filter((command) => {
									return (
										command.__ref !== guildCommandCacheId
									);
								});
							},
						},
					});
					// remove the GuildCommand from the cache
					cache.evict({ id: guildCommandCacheId });
				}
			},
		});
	} catch (err) {
		displayServerError(err);
	}
};
