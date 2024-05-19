import path from 'path';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import log from '@byte-o-bert/shared/services/log';
import {
	getDirnameEnv,
	importFilesFromDirectory,
} from '@byte-o-bert/shared/utils/helpers';
import config from '../../../config/index.js';

/**
 * @class DiscordBot
 * @description Responsible for creating and managing the Discord bot.
 *
 * @property {Client} #client	- Bot client instance
 * @property {LogService} #log	- Logging service instance
 */
class DiscordBot {
	#client;
	#log;
	#logMeta = { origin: import.meta.url };

	constructor() {
		this.#log = log;

		// make singleton
		if (DiscordBot.instance) {
			return DiscordBot.instance;
		}
		DiscordBot.instance = this;
	}

	/**
	 * Getter for the bot's client.
	 *
	 * @returns {Client}
	 */
	get client() {
		return this.#client;
	}

	/**
	 * Initializes the bot's client by setting up
	 * its commands and events, logging it in and
	 * setting its activity.
	 */
	async initBot() {
		try {
			// if partials are not working as intended
			// implement refetching
			const { intents, partials } = this.#buildProps();
			this.#client = new Client({ intents, partials });
			this.#client.commands = new Collection();

			const [commands, events] = await this.#buildActions();
			this.#handleActions(commands, events);

			await this.#client.login(process.env.DISCORD_BOT_TOKEN);
			this.#client.user.setActivity(config.discord_bot.activity);
		} catch (err) {
			this.#log.error(err, this.#logMeta);
		}
	}

	/**
	 * Creates the needed properties for the bot's client
	 * based on the config file and CLIENT_PROPS.
	 * As of now, it only creates the intents and partials.
	 * @private
	 *
	 * @returns {Object}
	 */
	#buildProps() {
		const _CLIENT_PROPS = [
			{ dcName: GatewayIntentBits, cfgName: 'intents' },
			{ dcName: Partials, cfgName: 'partials' },
		];

		return _CLIENT_PROPS.reduce((acc, { dcName, cfgName }) => {
			acc[cfgName] = this.#createPropFromConfig(dcName, cfgName);

			return acc;
		}, {});
	}

	/**
	 * Creates a property for the bot's client based on the
	 * provided config name and the Discord import name.
	 * @private
	 *
	 * @param {Object} dcName	- Discord import name (e.g. 'GatewayIntentBits')
	 * @param {string} cfgName	- Config name (e.g. 'intents')
	 * @returns {number[]}
	 */
	#createPropFromConfig(dcName, cfgName) {
		const props = config.discord_bot[cfgName];

		return props.map((p) => dcName[p]);
	}

	/**
	 * Imports all commands and events from their respective
	 * directories and returns them as an array of promises.
	 * @private
	 *
	 * @returns {Promise[]}
	 */
	#buildActions() {
		const __dirname = getDirnameEnv(import.meta.url);

		const commandsPath = path.join(__dirname, '..', 'commands');
		const eventsPath = path.join(__dirname, '..', 'events');

		const commandsPromises = importFilesFromDirectory(commandsPath, [
			'.js',
		]);
		const eventsPromises = importFilesFromDirectory(eventsPath, ['.js']);

		return Promise.all([commandsPromises, eventsPromises]);
	}

	/**
	 * Sets up the bot's slash commands, as well as all
	 * event listeners for all events.
	 * @private
	 *
	 * @param {Object[]} commands	- All registered commands
	 * @param {Object[]} events		- All handled events
	 */
	#handleActions(commands, events) {
		/**
		 * Callback for handling commands in this.#actionIterator.
		 * @private
		 *
		 * @param {Object} command - Command to be handled
		 */
		const _commandsCb = (command) => {
			this.#client.commands.set(command.data.name, command);
		};
		/**
		 * Callback for handling events in this.#actionIterator.
		 * @private
		 *
		 * @param {Object} event - Event to be handled
		 */
		const _eventsCb = (event) => {
			if (event.once) {
				this.#client.once(event.name, (...args) =>
					event.execute(...args)
				);
			} else {
				this.#client.on(event.name, (...args) =>
					event.execute(...args)
				);
			}
		};

		this.#actionIterator(
			'command',
			commands,
			['data', 'execute'],
			_commandsCb
		);
		this.#actionIterator('event', events, ['name', 'execute'], _eventsCb);
	}

	/**
	 * Iterates over the provided actions and handles them
	 * based on the provided callback and keys.
	 * Used to register the actions to the bot's client.
	 *
	 * @param {string} name			- Name of the action type
	 * @param {Object[]} actions	- All actions to be handled
	 * @param {string[]} keys		- Required keys for the action
	 * @param {Function} cb			- Callback to handle the action
	 */
	#actionIterator(name, actions, keys, cb) {
		for (const { default: action } of actions) {
			if (keys.every((key) => key in (action ?? {}))) {
				cb(action);
			} else {
				this.#log.warn(
					`Invalid ${name} schema detected.`,
					this.#logMeta
				);
			}
		}
	}
}

export default DiscordBot;
