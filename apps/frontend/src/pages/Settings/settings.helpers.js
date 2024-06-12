import client from '../../graphql';
import { UPDATE_IS_PRIVATE } from '../../graphql/mutations/settingsMutations';
import { adminSearchVar } from '../../graphql/reactiveVars/adminVars';
import {
	dialogVar,
	snackbarVar,
} from '../../graphql/reactiveVars/userInteractionVars';
import { displayServerError } from '../../components/UserInteraction/userInteraction.helpers';

export const togglePrivateHandler = async (e) => {
	try {
		const isPrivateCurr = !e.currentTarget.checked;

		await client.mutate({
			mutation: UPDATE_IS_PRIVATE,
			variables: { isPrivate: !isPrivateCurr },
			optimisticResponse: {
				__typename: 'Mutation',
				updateIsPrivate: {
					__typename: 'Settings',
					isPrivate: !isPrivateCurr,
					isOptimistic: true,
				},
			},
			update: (cache, { data }) => {
				const { isPrivate, isOptimistic } = data?.updateIsPrivate ?? {};

				if (typeof isPrivate === 'boolean') {
					// update settings query with new isPrivate value
					cache.modify({
						fields: {
							settings(existingSettings = {}) {
								if (isOptimistic) {
									snackbarVar({
										isOpen: true,
										key: 'SettingsSaved',
									});
								}

								return {
									...existingSettings,
									isPrivate,
								};
							},
						},
					});
				}
			},
		});
	} catch (err) {
		displayServerError(err);
	}
};

export const createAdminHelper = (e) => {
	dialogVar({
		isOpen: true,
		key: 'CreateAdmin',
		value: null,
	});
};

export const adminSearchHelper = (e) => {
	const value = e.currentTarget.value;

	adminSearchVar(value);
};

export const adminSearchClearHelper = () => {
	adminSearchVar('');
};

export const filterAdminsByName = (data = {}, name) => {
	const admins = data?.admins ?? [];

	return admins.filter((admin) =>
		admin.uniqueName.toLowerCase().includes(name.toLowerCase())
	);
};
