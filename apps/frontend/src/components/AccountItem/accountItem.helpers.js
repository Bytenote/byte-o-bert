import client from '../../graphql';
import { REMOVE_ADMIN } from '../../graphql/mutations/adminMutations';
import {
	dialogVar,
	snackbarVar,
} from '../../graphql/reactiveVars/userInteractionVars';
import { displayServerError } from '../UserInteraction/userInteraction.helpers';

/**
 * Handler for displaying the admin remove
 * dialog.
 * The discord ID of the admin gets retrieved
 * from the button name.
 *
 * @param {Event} e - Event object
 */
export const removeAdminHandler = (e) => {
	const discordId = e.currentTarget.name;

	dialogVar({
		isOpen: true,
		key: 'RemoveAdmin',
		value: { discordId },
	});
};

export const removeAdminSubmit = async () => {
	const { discordId: id } = dialogVar()?.value ?? {};

	try {
		await client.mutate({
			mutation: REMOVE_ADMIN,
			variables: { id },
			update: (cache, { data }) => {
				if (data?.removeAdmin) {
					const adminCacheId = cache.identify({
						__typename: 'Admin',
						_id: id,
					});

					// remove the reference from admins query
					cache.modify({
						fields: {
							admins(existingAdmins = []) {
								snackbarVar({
									isOpen: true,
									key: 'AdminRemoved',
								});

								return existingAdmins.filter(
									(admin) => admin.__ref !== adminCacheId
								);
							},
						},
					});
					// remove the Admin from the cache
					cache.evict({ id: adminCacheId });
				}
			},
		});
	} catch (err) {
		displayServerError(err);
	}
};
