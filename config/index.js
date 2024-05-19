import path from 'path';
import { getDirnameEnv } from '@byte-o-bert/shared/utils/helpers';

const config = {
	logging: {
		level: process.env.LOG_LEVEL ?? 'info',
		dir: path.resolve(getDirnameEnv(import.meta.url), '..', 'logs'), // rootDir/logs
	},
	discord_bot: {
		activity:
			process.env.DISCORD_ACTIVITY ??
			'https://github.com/bytenote/byte-o-bert',
		intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMembers'],
		partials: ['GuildMember'],
	},
	oauth: {
		scope: ['identify', 'guilds'],
	},
};

export default config;
