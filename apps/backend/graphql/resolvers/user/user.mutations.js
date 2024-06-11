import { GraphQLError } from 'graphql';
import { User } from '@byte-o-bert/database/models';
import log from '@byte-o-bert/logger';
import { SESSION_NAME } from '../../../utils/constants.js';

const logMeta = { origin: import.meta.url };

const resolvers = {
	Mutation: {
		/**
		 * Logs the user out by clearing the client's
		 * session cookie and destroying the store session.
		 * Soft deletes the user in order to not destroy other
		 * active sessions of the user.
		 * The soft delete period is longer than the most recent
		 * active session on other devices, so that the user can
		 * still log in on other devices without having to
		 * re-authenticate.
		 *
		 * @param {Object} _parent				- The parent resolver
		 * @param {Object} _args				- Arguments passed to the resolver
		 * @param {Object} context				- GraphQL context
		 * @param {Object} context.req			- Express request object
		 * @param {Object} context.res			- Express response object
		 * @param {Object|null} context.user	- The authenticated user or null
		 * @returns {Object}
		 */
		async logoutUser(_parent, _args, { req, res, user }) {
			if (!user) {
				return null;
			}

			res.clearCookie(SESSION_NAME);
			req.session.destroy((err) => {
				if (err) {
					log.error(err, logMeta);

					throw new GraphQLError('Failed to log out');
				}
			});

			try {
				await User.findOneAndUpdate(
					{ _id: user._id },
					{ deletedAt: new Date().toISOString() }
				);
			} catch (err) {
				log.error(err, logMeta);
			}

			return user;
		},
	},
};

export default resolvers;
