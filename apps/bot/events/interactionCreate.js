import log from '@byte-o-bert/logger';

const logMeta = { origin: import.meta.url };

export default {
	name: 'interactionCreate',
	/**
	 * Handles all interaction events.
	 * Executes the triggered command, if it exists.
	 *
	 * @param {Object} interaction	- Interaction object
	 */
	async execute(interaction) {
		// ignore non-command interactions
		if (!interaction.isCommand()) {
			return;
		}

		const command = interaction.client.commands.get(
			interaction.commandName
		);
		// ignore unknown commands
		if (!command) {
			return;
		}

		try {
			await command.execute(interaction);
		} catch (err) {
			log.error(err, logMeta);

			await interaction.guild.reply({
				content: `There was an error while executing a command: "/${
					command.data?.name ?? 'Unrecognized command'
				}"!`,
				ephemeral: true,
			});
		}
	},
};
