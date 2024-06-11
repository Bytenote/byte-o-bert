import { useQuery } from '@apollo/client';
import { GET_ADMINS } from '../../graphql/queries/adminQueries';
import { adminSearchVar } from '../../graphql/reactiveVars/adminVars';
import { useSearch } from '../../hooks/useSearch';
import { filterAdminsByName } from './settings.helpers';

export const useAdmins = () => {
	const { data, loading } = useQuery(GET_ADMINS, {
		fetchPolicy: 'cache-only',
	});
	const filteredAdmins = useSearch(data, adminSearchVar, filterAdminsByName);

	return { loading, filteredAdmins };
};
