import { ApolloServer } from '@apollo/server';
import { is_prod } from '@byte-o-bert/shared/utils/utils';
import { buildSchema } from './graphql.helpers.js';
import plugins from './plugins/plugins.js';

const schema = await buildSchema();
const apolloServer = new ApolloServer({
	schema,
	plugins,
	introspection: !is_prod,
	playground: !is_prod,
});

export default apolloServer;
