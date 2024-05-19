import path from 'path';
import { REST, Routes } from 'discord.js';
import log from '@byte-o-bert/shared/services/log';
import {
	getDirnameEnv,
	importFilesFromDirectory,
} from '@byte-o-bert/shared/utils/helpers';

const logMeta = { origin: import.meta.url };

// construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

// deploy commands to the guild
const deploySlashCommands = async (shouldDeployGlobally) => {
	try {
		const __dirname = getDirnameEnv(import.meta.url);

		const commands = [];

		// grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
		const commandsPath = path.join(__dirname, '..', 'commands');
		const commandFiles = await importFilesFromDirectory(commandsPath, [
			'.js',
		]);
		for (const { default: command } of commandFiles) {
			if ('data' in (command ?? {}) && 'execute' in command) {
				commands.push(command.data.toJSON());
			} else {
				log.warn(
					'Invalid command file. The command is missing a required "data" or "execute" property.',
					logMeta
				);
			}
		}

		log.info(
			`Started refreshing ${commands.length} application (/) commands.`,
			logMeta
		);

		// register commands
		let data, type;
		if (shouldDeployGlobally) {
			// globally
			data = await rest.put(
				Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
				{ body: commands }
			);
			type = 'globally';
		} else {
			// to the dev guild
			data = await rest.put(
				Routes.applicationGuildCommands(
					process.env.DISCORD_CLIENT_ID,
					process.env.DISCORD_DEV_GUILD_ID
				),
				{ body: commands }
			);
			type = 'in the dev guild';
		}

		log.info(
			`Successfully reloaded ${data.length} application (/) commands ${type}.`,
			logMeta
		);
	} catch (error) {
		log.error(error, logMeta);
	}
};

export default deploySlashCommands;
