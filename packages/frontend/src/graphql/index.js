import { ApolloClient, createHttpLink } from '@apollo/client';
import cache from './cache/cache.js';
import { BACKEND_URL } from '../utils/constants.js';

const link = createHttpLink({
	uri: `${BACKEND_URL}/graphql`,
	credentials: 'include',
});

const client = new ApolloClient({
	link,
	cache,
});

export default client;
