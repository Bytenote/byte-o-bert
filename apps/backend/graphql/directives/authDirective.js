import { GraphQLError } from 'graphql';
import fieldDirective from './defaults/fieldDirective.js';
import { isAuthenticated, isAuthorized } from '../../services/auth.service.js';

/**
 * Authentication and authorization directive.
 * Uses the default field directive together with
 * the authResolveFunc to check if the user is
 * authenticated and authorized to access a resolver.
 *
 * @param {string} directiveName - Name of the directive
 * @returns {Function}
 */
export default function authDirective(directiveName = 'auth') {
	const typeDefs = `directive @${directiveName}(
		requires: Role = OWNER
	) on FIELD_DEFINITION
	
	enum Role {
		OWNER
		GUILD_ADMIN
		USER
	}`;

	return fieldDirective(directiveName, typeDefs, authResolveFunc);
}

/**
 * Only allows access to the resolver if the user
 * is authenticated and authorized.
 * Also checks if the user has the required role.
 * If the auth directive is not further specified
 * with a required role, it defaults to OWNER, which
 * is the highest authenticated role.
 *
 * @param {Object} source			- Source object
 * @param {Object} args				- Arguments object
 * @param {Object} context			- Context object
 * @param {Object} info				- Info object
 * @param {Object} extras			- Additional args that are needed
 * @param {Function} extras.resolve	- Original resolver function
 * @param {string} extras.requires	- Required role from the directive to access the resolver
 * @returns {Function}
 */
async function authResolveFunc(
	source,
	args,
	context,
	info,
	{ resolve, requires }
) {
	const isLoggedIn = isAuthenticated(context.user);
	if (isLoggedIn) {
		if (requires) {
			const hasPerms = await isAuthorized(
				context.user,
				requires,
				args._id
			);
			if (!hasPerms) {
				return new GraphQLError('Unauthorized');
			}
		}

		return resolve(source, args, context, info);
	}

	return new GraphQLError('Unauthenticated');
}
