import { useEffect, useState } from 'react';
import { useFragment, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { GUILD_PREFIX_FRAGMENT } from '../../graphql/fragments/guildFragments';
import { GET_SERVER_PAGE } from '../../graphql/queries/pageRoots/serverPageQueries';
import {
	GET_GENERAL_GUILD_DATA,
	GET_GUILD_COMMANDS,
} from '../../graphql/queries/guildQueries';
import { guildCommandSearchVar } from '../../graphql/reactiveVars/guildVars';
import { useSearch } from '../../hooks/useSearch';
import { filterCommandsByName } from './server.helpers';

/**
 * Custom hook that retrieves the page root query
 * for the server page that displays all the guild
 * data and commands.
 * Further queries from other components are made
 * directly to the cache.
 * Returns the guild ID from the URL params.
 *
 * @returns {string}
 */
export const useRootQuery = () => {
	const { guildId } = useParams();
	useQuery(GET_SERVER_PAGE, {
		variables: { id: guildId },
		fetchPolicy: 'network-only',
		nextFetchPolicy: 'cache-first',
	});

	return guildId;
};

/**
 * Custom hook that retrieves the general data
 * for the current guild from cache.
 * If an error occurs, the user is redirected to
 * the error page.
 * Returns the response object from the query.
 *
 * @returns {Object}
 */
export const useGeneralGuild = (guildId) => {
	const navigate = useNavigate();
	const response = useQuery(GET_GENERAL_GUILD_DATA, {
		variables: { id: guildId },
		fetchPolicy: 'cache-only',
		onError: (error) => {
			navigate('/error', { state: { error }, replace: true });
		},
	});

	return response;
};

/**
 * Custom hook that retrieves and updates the prefix
 * for the current guild.
 *
 * @param {string} guildId - The ID of the current guild
 * @returns {Object}
 */
export const usePrefix = (guildId) => {
	const [input, setInput] = useState('');
	const {
		data: { prefix },
	} = useFragment({
		fragment: GUILD_PREFIX_FRAGMENT,
		from: {
			__typename: 'GeneralGuild',
			_id: guildId,
		},
	});

	useEffect(() => {
		if (prefix) {
			setInput(prefix);
		}
	}, [prefix]);

	const onChangeHandler = (e) => {
		if (e.target.value !== input) {
			setInput(e.target.value);
		}
	};

	return {
		input,
		onChangeHandler,
	};
};

/**
 * Custom hook that retrieves the (filtered) commands
 * for the current guild from cache.
 *
 * @returns {Object}
 */
export const useCommands = (guildId) => {
	const { data, loading, error } = useQuery(GET_GUILD_COMMANDS, {
		variables: { id: guildId },
		fetchPolicy: 'cache-only',
	});
	const filteredCommands = useSearch(
		data,
		guildCommandSearchVar,
		filterCommandsByName
	);

	return {
		loading,
		error,
		filteredCommands,
	};
};
