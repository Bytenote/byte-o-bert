import { connect } from '@byte-o-bert/database';
import log from '@byte-o-bert/logger';
import DiscordBot from './services/bot.service.js';
import deploySlashCommands from './services/deploy.service.js';

const logMeta = { origin: import.meta.url };

/**
 * Starts the bot, if no npm script arg is provided,
 * otherwise runs one of the specified deploy
 * commands.
 */
const main = async () => {
	const command = process.argv[2];

	switch (command) {
		case 'dev-deploy':
			await devDeployCommands();
			break;
		case 'deploy':
			await deployCommands();
			break;
		default:
			await startBot();
			break;
	}
};

const startBot = async () => {
	try {
		await connect('Discord-Bot');

		const bot = new DiscordBot();
		await bot.initBot();
	} catch (err) {
		log.error(`Error starting bot: ${err}`, logMeta);
		process.exit(1);
	}
};

const devDeployCommands = async () => {
	const shouldDeployGlobally = false;

	await deploySlashCommands(shouldDeployGlobally);
};

const deployCommands = async () => {
	const shouldDeployGlobally = true;

	await deploySlashCommands(shouldDeployGlobally);
};

main();
