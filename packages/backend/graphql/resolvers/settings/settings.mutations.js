import { GraphQLError } from 'graphql';
import { Settings } from '@byte-o-bert/database/models';
import log from '@byte-o-bert/shared/services/log';

const logMeta = { origin: import.meta.url };

const resolvers = {
	Mutation: {
		async updateIsPrivate(_, { isPrivate }) {
			try {
				const settings = await Settings.findOneAndUpdate(
					{},
					{ isPrivate },
					{ new: true }
				);
				if (settings) {
					return settings;
				}

				return new GraphQLError('Settings not found');
			} catch (err) {
				log.debug(err, logMeta);

				return new GraphQLError('Internal Error');
			}
		},
	},
};

export default resolvers;
