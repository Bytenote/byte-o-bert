import { useApolloClient, useFragment, useReactiveVar } from '@apollo/client';
import useDebounce from './useDebounce';

/**
 * Custom hook that filters data retrieved
 * from a GraphQL fragment based on a reactive
 * search variable.
 * The search value is debounced to prevent
 * excessive re-renders.
 *
 * @param {Object} fragment		- GraphQL fragment
 * @param {Object} from			- Fragment reference
 * @param {Object} searchVar	- Reactive search variable
 * @param {Function} filterFunc	- Filter function
 * @param {Array} optional		- Optional parameters
 * @returns {Array}				- Filtered data
 */
export const useSearchFragment = (
	fragment,
	from,
	searchVar,
	filterFunc,
	...optional
) => {
	const { data } = useFragment({
		fragment,
		from,
	});
	const searchVal = useReactiveVar(searchVar);
	const debouncedSearch = useDebounce(searchVal, 175);

	return filterFunc(data, debouncedSearch, ...optional) ?? [];
};

/**
 * Custom hook that filters data retrieved
 * from a GraphQL query based on a reactive
 * search variable.
 * The search value is debounced to prevent
 * excessive re-renders.
 *
 * @param {Object} query		- GraphQL query
 * @param {Object} variables	- Query variables
 * @param {Object} searchVar	- Reactive search variable
 * @param {Function} filterFunc	- Filter function
 * @param {Array} optional		- Optional parameters
 * @returns {Array}				- Filtered data
 */
export const useSearchReadQuery = (
	query,
	variables = undefined,
	searchVar,
	filterFunc,
	...optional
) => {
	const client = useApolloClient();
	const searchVal = useReactiveVar(searchVar);
	const debouncedSearch = useDebounce(searchVal, 175);
	const data = client.cache.readQuery({ query, variables }) ?? {};

	return filterFunc(data, debouncedSearch, ...optional) ?? [];
};

/**
 * Custom hook that filters data based on a reactive
 * search variable.
 * The search value is debounced to prevent
 * excessive re-renders.
 *
 * @param {any} data			- Data to filter
 * @param {Object} searchVar	- Reactive search variable
 * @param {Function} filterFunc	- Filter function
 * @param {Array} optional		- Optional parameters
 * @returns {Array}				- Filtered data
 */
export const useSearch = (data, searchVar, filterFunc, ...optional) => {
	const searchVal = useReactiveVar(searchVar);
	const debouncedSearch = useDebounce(searchVal, 175);

	return filterFunc(data, debouncedSearch, ...optional) ?? [];
};
