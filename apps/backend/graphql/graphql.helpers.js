import path from 'path';
import url from 'url';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { getDirnameEnv } from '@byte-o-bert/shared/utils/helpers';
import log from '@byte-o-bert/logger';

const logMeta = { origin: import.meta.url };

/**
 * Builds the schema for the ApolloServer,
 * by dynamically importing all resolvers and
 * type definitions.
 * Merges all typeDefs and resolvers respectively,
 * together with the directives, to create the schema.
 * Then applies all directives to the schema.
 *
 * @returns {Promise<Object>}
 */
export const buildSchema = async () => {
	try {
		const [typeDefArr, resolversArr] = await _loadSchemaFiles();
		const directives = await _loadDirectives();

		// typeDef directives are defined in each directive, not in .gql files
		const directiveTypeDefs = directives.map(
			(directive) => directive.typeDefs
		);

		const typeDefs = mergeTypeDefs([...directiveTypeDefs, ...typeDefArr]);
		const resolvers = mergeResolvers(resolversArr);

		const schema = makeExecutableSchema({
			typeDefs,
			resolvers,
		});

		// apply all directives to the schema
		const directivefiedSchema = directives.reduce(
			(acc, directive) => directive.transformer(acc),
			schema
		);

		return directivefiedSchema;
	} catch (err) {
		log.error(err, logMeta);
	}
};

/**
 * Dynamically loads all typeDefs and resolvers
 * from the 'typeDefs' and 'resolvers' directories.
 * @private
 *
 * @returns {Promise[]}
 */
const _loadSchemaFiles = async () => {
	const __dirname = getDirnameEnv(import.meta.url);
	const typeDefDir = path.join(__dirname, 'typeDefs');
	const resolversDir = path.join(
		__dirname,
		'resolvers',
		'**',
		'*.{mutations,queries}.js'
	);

	const typeDefPromise = loadFiles(typeDefDir, {
		ignoreIndex: true,
		extensions: ['gql'],
		recursive: true,
	});
	const resolverPromise = loadFiles(resolversDir, {
		ignoreIndex: true,
		extensions: ['js'],
		recursive: true,
		requireMethod: async (path) => await import(url.pathToFileURL(path)),
	});

	return Promise.all([typeDefPromise, resolverPromise]);
};

/**
 * Dynamically loads all directives from the
 * 'directives' directory.
 * @private
 *
 * @returns {Object[]}
 */
const _loadDirectives = async () => {
	const __dirname = getDirnameEnv(import.meta.url);
	const directivesDir = path.join(__dirname, 'directives');
	const excludedDir = path.join(directivesDir, 'defaults');

	const directivesArr = await loadFiles(directivesDir, {
		ignoreIndex: true,
		extensions: ['js'],
		requireMethod: async (path) => {
			if (!path.includes(excludedDir)) {
				return await import(url.pathToFileURL(path));
			}
		},
	});

	// call each directive function to get the directive Object
	const directives = directivesArr.reduce((acc, currDirective) => {
		if (typeof currDirective === 'function') {
			acc.push(currDirective());
		}

		return acc;
	}, []);

	return directives;
};
