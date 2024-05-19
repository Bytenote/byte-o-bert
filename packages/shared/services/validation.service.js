import { POSSIBLE_PREFIXES } from '@byte-o-bert/shared/utils/constants';

/**
 * Serializes the args object by trimming all string values.
 *
 * @param {Object} args - The args object to serialize
 */
export const serializeArgs = (args) => {
	return Object.keys(args).reduce((acc, key) => {
		const value = args[key];
		acc[key] = typeof value === 'string' ? value.trim() : value;

		return acc;
	}, {});
};

/**
 * Validates the input, by mapping the field
 * to the appropriate validation function.
 *
 * @param {String} field		- The field to validate
 * @param {Object} args			- The args object to validate
 * @returns {String|undefined}	- The error message if any
 */
export const validateInput = (field, args) => FIELD_FUNCS[field](args);

const _validatePrefix = ({ prefix }) => {
	if (prefix.length !== 1) {
		return 'Limited to one character';
	}

	if (!POSSIBLE_PREFIXES.has(prefix)) {
		return 'Invalid prefix';
	}
};

const _validateCommandModification = ({ name, action }) => {
	if (!name || name.length < 1 || !action || action.length < 1) {
		const isName = !name || name.length < 1;

		return `Command ${isName ? 'name' : 'action'} must be set`;
	}

	if (name.includes(' ')) {
		return 'Command name cannot contain spaces';
	}
};

const _validateCommandDeletion = ({ name }) => {
	if (!name || name.length < 1) {
		return 'Command name must be set';
	}

	if (name.includes(' ')) {
		return 'Command name cannot contain spaces';
	}
};

const _validateAdminIds = ({ ids }) => {
	if (!ids || ids.length < 1) {
		return 'No Discord IDs provided';
	}

	const MIN = 17;
	const MAX = 18;
	if (ids.some((id) => isNaN(id) || id.length < MIN || id.length > MAX)) {
		return 'Invalid Discord ID';
	}

	const MAX_IDS = 10;
	if (ids.length > MAX_IDS) {
		return `Limited to ${MAX_IDS} Discord IDs`;
	}
};

const FIELD_FUNCS = {
	createCommand: _validateCommandModification,
	updateCommand: _validateCommandModification,
	deleteCommand: _validateCommandDeletion,
	updatePrefix: _validatePrefix,
	addAdminsByIds: _validateAdminIds,
};
