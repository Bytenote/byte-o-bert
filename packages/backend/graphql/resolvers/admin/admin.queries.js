import { Admin } from '@byte-o-bert/database/models';
import log from '@byte-o-bert/shared/services/log';

const logMeta = { origin: import.meta.url };

const resolvers = {
	Query: {
		async admins() {
			try {
				const admins = await Admin.find();

				return admins ?? [];
			} catch (err) {
				log.error(err, logMeta);

				return null;
			}
		},
	},
};

export default resolvers;
