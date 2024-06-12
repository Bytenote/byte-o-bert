import { POSSIBLE_PREFIXES } from '@byte-o-bert/shared/utils/constants';
import client from '../../graphql/index.js';
import { GUILD_PREFIX_FRAGMENT } from '../../graphql/fragments/guildFragments.js';
import { UPDATE_PREFIX } from '../../graphql/mutations/guildMutations.js';
import { guildCommandSearchVar } from '../../graphql/reactiveVars/guildVars.js';
import {
	dialogVar,
	snackbarVar,
} from '../../graphql/reactiveVars/userInteractionVars.js';
import { displayServerError } from '../../components/UserInteraction/userInteraction.helpers.js';

export const getGuildDataProp = ({ loading, error, data }, queryName, key) => {
	if (loading) {
		return null;
	}

	if (error) {
		return 'ERR';
	}

	return data?.[queryName]?.[key] ?? '-';
};

/**
 * Handles the submission of the prefix form.
 * If the new prefix is valid, an optimistic response
 * is used to update the cache immediately, before
 * the server responds and the cache is updated again
 * with the confirmed new prefix.
 * If the new prefix is invalid, a snackbar message
 * is displayed.
 *
 * @param {Event} e - Form submission event
 */
export const submitHandler = async (e) => {
	e.preventDefault();

	const guildId = e.currentTarget.name;
	const prefix = e.currentTarget.prefix.value;

	const isValid = _validatePrefix(guildId, prefix);
	if (isValid) {
		try {
			await client.mutate({
				mutation: UPDATE_PREFIX,
				variables: { id: guildId, prefix },
				optimisticResponse: {
					__typename: 'Mutation',
					updatePrefix: {
						__typename: 'String',
						value: prefix,
						isOptimistic: true,
					},
				},
				update: (cache, { data }) => {
					const updatedPrefix = data?.updatePrefix;
					const generalGuildCacheId = cache.identify({
						__typename: 'GeneralGuild',
						_id: guildId,
					});

					if (updatedPrefix) {
						// update cache with new prefix
						cache.modify({
							id: generalGuildCacheId,
							fields: {
								prefix() {
									if (updatedPrefix?.isOptimistic) {
										snackbarVar({
											isOpen: true,
											key: 'PrefixUpdated',
										});

										return updatedPrefix?.value;
									}

									return updatedPrefix;
								},
							},
						});
					}
				},
			});
		} catch (err) {
			displayServerError(err);
		}
	}
};

/**
 * Handler for adding a new command.
 * Opens a dialog with the 'CommandDialog' message
 * of type 'create' for the given guild ID,
 * retrieved from the button's name attribute.
 *
 * @param {Event} e - Event object
 */
export const createCommandHandler = (e) => {
	const guildId = e.currentTarget.name;

	dialogVar({
		isOpen: true,
		key: 'CommandDialog',
		value: {
			type: 'create',
			guildId,
		},
	});
};

/**
 * Updates the search input for guild commands
 * via a reactive variable.
 *
 * @param {Event} e - Event object
 */
export const commandSearchHelper = (e) => {
	const value = e.currentTarget.value;

	guildCommandSearchVar(value);
};

/**
 * Clears the search input for guild commands
 * via a reactive variable.
 */
export const commandSearchClearHelper = () => {
	guildCommandSearchVar('');
};

/**
 * Filters guild commands by name.
 * See 'src/hooks/useSearch.js' for details on how
 * the parameters are retrieved and used.
 *
 * @param {Object} data	- Guild commands data
 * @param {string} name	- Name to filter by
 * @returns {Array}		- Filtered commands
 */
export const filterCommandsByName = (data = {}, name) => {
	const commands = data?.guildCommands ?? [];

	return commands.filter((command) => {
		return command.name.toLowerCase().includes(name.toLowerCase());
	});
};

/**
 * Validates the new prefix for a guild with the
 * given guildId.
 * If the prefix is invalid, a snackbar message
 * is displayed and false is returned.
 * If the prefix is valid, true is returned.
 *
 * @param {string} guildId		- Guild ID
 * @param {string} newPrefix	- New prefix
 * @returns {boolean}
 */
const _validatePrefix = (guildId, newPrefix) => {
	if (newPrefix.length > 1) {
		// too long
		snackbarVar({
			isOpen: true,
			key: 'PrefixTooLong',
		});

		return false;
	}

	if (!POSSIBLE_PREFIXES.has(newPrefix)) {
		// invalid character
		snackbarVar({
			isOpen: true,
			key: 'PrefixInvalid',
		});

		return false;
	}

	// read current prefix from cache and compare with new prefix
	const currPrefix = _getCurrentPrefixFromCache(guildId);
	if (newPrefix === currPrefix) {
		// same prefix
		snackbarVar({
			isOpen: true,
			key: 'PrefixSame',
		});

		return false;
	}

	// valid prefix
	return true;
};

/**
 * Retrieves the current prefix for a guild
 * with the given guildId from the cache and
 * returns it.
 *
 * @param {string} guildId - Guild ID
 * @returns {string}
 */
const _getCurrentPrefixFromCache = (guildId) => {
	// build the cache id for the guild
	const generalGuildCacheId = client.cache.identify({
		__typename: 'GeneralGuild',
		_id: guildId,
	});

	const { prefix } =
		client.readFragment({
			id: generalGuildCacheId,
			fragmentName: 'GuildPrefix',
			fragment: GUILD_PREFIX_FRAGMENT,
		}) ?? {};

	return prefix;
};
