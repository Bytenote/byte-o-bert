import { SlashCommandBuilder } from 'discord.js';
import { hasGuildAdminPermissions } from '@byte-o-bert/shared/services/auth';
import { updateCommand } from '@byte-o-bert/shared/services/guild';
import { validateInput } from '@byte-o-bert/shared/services/validation';
import log from '@byte-o-bert/logger';

const logMeta = { origin: import.meta.url };

export default {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription('Update a chat command')
		.addStringOption((option) =>
			option
				.setName('name')
				.setDescription('Name of command (without prefix)')
				.setMinLength(1)
				.setMaxLength(32)
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('action')
				.setDescription('Action/Response of command')
				.setMinLength(1)
				.setMaxLength(1_000)
				.setRequired(true)
		),
	async execute(interaction) {
		try {
			const { guildId: _id, memberPermissions } = interaction;
			const isAuthorized = hasGuildAdminPermissions(memberPermissions);

			if (isAuthorized) {
				const commandName = interaction.options.getString('name');
				const commandAction = interaction.options.getString('action');
				const invalidationReason = validateInput('updateCommand', {
					name: commandName,
					action: commandAction,
				});

				if (invalidationReason) {
					return await interaction.reply({
						content: invalidationReason,
						ephemeral: true,
					});
				}

				// update command
				const isVerbose = true;
				const { success, msg } = await updateCommand(
					_id,
					commandName,
					commandAction,
					interaction.user.username,
					isVerbose
				);

				if (!success) {
					// command update failed
					return await interaction.reply({
						content: msg,
						ephemeral: true,
					});
				}

				return await interaction.reply(msg);
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
