import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';

const defaultFieldDirective = (directiveName, typeDefs, resolveFunc) => {
	return {
		typeDefs,
		transformer: (schema) =>
			mapSchema(schema, {
				[MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName) => {
					// find field with @directiveName
					const directive = getDirective(
						schema,
						fieldConfig,
						directiveName
					)?.[0];

					if (directive) {
						const { resolve } = fieldConfig;
						const { requires } = directive;

						// override field resolver with custom resolve function
						fieldConfig.resolve = async function (
							source,
							args,
							context,
							info
						) {
							return await resolveFunc(
								source,
								args,
								context,
								info,
								{
									fieldName,
									resolve,
									requires,
								}
							);
						};

						return fieldConfig;
					}
				},
			}),
	};
};

export default defaultFieldDirective;
