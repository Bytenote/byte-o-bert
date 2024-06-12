import { InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache({
	typePolicies: {
		GuildCommands: {
			keyFields: ['_id'],
		},
		UserBotGuilds: {
			keyFields: [],
		},
		GuildCommand: {
			keyFields: ['guildId', 'name'],
		},
		UserGuild: {
			keyFields: ['id'],
		},
	},
});

export default cache;
