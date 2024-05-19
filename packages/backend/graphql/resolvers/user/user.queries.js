import { isAuthenticated } from '../../../services/auth.service.js';

const resolvers = {
	Query: {
		/**
		 * Returns the currently authenticated user
		 * or null.
		 *
		 * @param {Object} _parent				- The parent resolver
		 * @param {Object} _args				- Arguments passed to the resolver
		 * @param {Object} context				- GraphQL context
		 * @param {Object|null} context.user	- The authenticated user
		 * @returns {Object}
		 */
		user(_parent, _args, { user }) {
			// sanitize user object
			if (isAuthenticated(user)) {
				const { accessToken, ...sanitizedUser } = user;

				return sanitizedUser;
			}

			return null;
		},
	},
};

export default resolvers;
