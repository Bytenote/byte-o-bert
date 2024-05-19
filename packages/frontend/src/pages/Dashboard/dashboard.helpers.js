import {
	mutualGuildSearchVar,
	eligibleGuildSearchVar,
} from '../../graphql/reactiveVars/userGuildVars';

/**
 * Updates the search input for mutual or eligible
 * guilds via reactive variables.
 * The type is determined by the name of the textfield.
 *
 * @param {Object} e - Event object
 */
export const userGuildSearchHelper = (e) => {
	const value = e.currentTarget.value;
	const type = e.currentTarget.name;

	if (type === 'mutual') {
		mutualGuildSearchVar(value);
	} else if (type === 'eligible') {
		eligibleGuildSearchVar(value);
	}
};

/**
 * Clears the search input for mutual or eligible
 * guilds via reactive variables.
 * The type is determined by the name of the textfield.
 *
 * @param {Object} e - Event object
 */
export const userGuildSearchClearHelper = (e) => {
	const type = e.currentTarget.name;

	if (type === 'mutual') {
		mutualGuildSearchVar('');
	} else if (type === 'eligible') {
		eligibleGuildSearchVar('');
	}
};

/**
 * Filters guilds of a specific type by name.
 * See 'src/hooks/useSearch.js' for details on how
 * the parameters are retrieved and used.
 *
 * @param {Array} data	- All user guilds of a specific type
 * @param {string} name	- Name to filter by
 * @param {string} type	- Type of guilds to filter: 'mutual' | 'eligible'
 * @returns {Array}		- Filtered guilds
 */
export const filterGuildsByName = (data, name, type) => {
	const guilds = data?.[type] ?? [];

	return guilds.filter((guild) =>
		guild.name.toLowerCase().includes(name.toLowerCase())
	);
};
