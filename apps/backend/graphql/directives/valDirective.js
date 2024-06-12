import { GraphQLError } from 'graphql';
import {
	serializeArgs,
	validateInput,
} from '@byte-o-bert/shared/services/validation';
import fieldDirective from './defaults/fieldDirective.js';

/**
 * Validation (and serialization) directive.
 * Uses the default field directive together with
 * the valResolveFunc to serialize and validate the
 * input arguments.
 *
 * @param {string} directiveName - Name of the directive
 * @returns {Function}
 */
export default function valDirective(directiveName = 'val') {
	const typeDefs = `directive @${directiveName} on FIELD_DEFINITION`;

	return fieldDirective(directiveName, typeDefs, valResolveFunc);
}

/**
 * Validates and serializes the input arguments.
 *
 * @param {Object} source			- Source object
 * @param {Object} args				- Arguments object
 * @param {Object} context			- Context object
 * @param {Object} info				- Info object
 * @param {Object} extras			- Additional args that are needed
 * @param {string} extras.fieldName	- Name of the typeDef field
 * @param {Function} extras.resolve	- Original resolver function
 * @returns {Function}
 */
function valResolveFunc(source, args, context, info, { fieldName, resolve }) {
	const trimmedArgs = serializeArgs(args);
	const reason = validateInput(fieldName, trimmedArgs);
	if (reason) {
		throw new GraphQLError(reason);
	}

	return resolve(source, trimmedArgs, context, info);
}
