import { GraphQLError } from 'graphql';
import { Admin } from '@byte-o-bert/database/models';
import log from '@byte-o-bert/shared/services/log';
import { getUsersByIds } from '@byte-o-bert/shared/services/user';

const logMeta = { origin: import.meta.url };

const resolvers = {
	Mutation: {
		async addAdminsByIds(_, { ids }) {
			try {
				const createdAdmins = await getUsersByIds(ids);
				if (createdAdmins.length > 0) {
					const oldAdmins = await Admin.find();
					const newAdmins = createdAdmins.filter(
						(admin) =>
							!oldAdmins.some((old) => old._id === admin._id)
					);

					if (newAdmins.length > 0) {
						await Admin.insertMany(newAdmins);

						return newAdmins;
					}

					return new GraphQLError('User(s) already admin(s)');
				}

				return new GraphQLError('No new users found');
			} catch (err) {
				log.debug(err, logMeta);

				return new GraphQLError('Internal Error');
			}
		},
		async addAdminsByGuildRoles(_, { _id, roles }) {},
		async removeAdmin(_, { _id }) {
			try {
				const adminDoc = await Admin.findByIdAndDelete(_id);
				if (adminDoc) {
					return true;
				}

				return new GraphQLError('Admin not found');
			} catch (err) {
				log.debug(err, logMeta);

				return new GraphQLError('Internal Error');
			}
		},
	},
};

export default resolvers;
