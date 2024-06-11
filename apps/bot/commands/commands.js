import { SlashCommandBuilder } from 'discord.js';
import { Guild } from '@byte-o-bert/database/models';
import { hasGuildAdminPermissions } from '@byte-o-bert/shared/services/auth';
import log from '@byte-o-bert/logger';

const logMeta = { origin: import.meta.url };

export default {
	data: new SlashCommandBuilder()
		.setName('commands')
		.setDescription('Shows a list of all chat commands'),
	async execute(interaction) {
		try {
			const { guildId: _id, memberPermissions } = interaction;
			const isAuthorized = hasGuildAdminPermissions(memberPermissions);

			if (isAuthorized) {
				const guildDoc = await Guild.findOne(
					{ _id },
					'prefix commands'
				);
				if (guildDoc?._id) {
					const { prefix, commands } = guildDoc;
					if (commands.size > 0) {
						const commandNames = [...commands.keys()];
						const commandList = commandNames
							.map((name) => `\`${prefix}${name}\``)
							.join(', ');

						return await interaction.reply({
							content: `**Available chat commands:**\n${commandList}`,
						});
					}

					// no commands
					return await interaction.reply({
						content:
							'There are no chat commands registered. Use `/create` to add one!',
						ephemeral: true,
					});
				}

				// no guild found
				return await interaction.reply({
					content:
						'Could not find your guild, try adding me to your server again',
					ephemeral: true,
				});
			}

			// no permission
			return await interaction.reply({
				content:
					'You do not have the required permissions to use this command',
				ephemeral: true,
			});
		} catch (err) {
			log.error(err, logMeta);

			await interaction.reply({
				content: 'There was an error, please try again',
				ephemeral: true,
			});
		}
	},
};
