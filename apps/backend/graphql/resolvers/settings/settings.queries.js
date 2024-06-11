import { Settings } from '@byte-o-bert/database/models';
import log from '@byte-o-bert/logger';

const logMeta = { origin: import.meta.url };

const resolvers = {
	Query: {
		async settings() {
			try {
				const settings = await Settings.findOne();

				return settings;
			} catch (err) {
				log.error(err, logMeta);

				return null;
			}
		},
	},
};

export default resolvers;
