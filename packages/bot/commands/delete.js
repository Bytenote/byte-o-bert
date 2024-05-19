import { SlashCommandBuilder } from 'discord.js';
import { hasGuildAdminPermissions } from '@byte-o-bert/shared/services/auth';
import { deleteCommand } from '@byte-o-bert/shared/services/guild';
import { validateInput } from '@byte-o-bert/shared/services/validation';
import log from '@byte-o-bert/shared/services/log';

const logMeta = { origin: import.meta.url };

export default {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('Delete a chat command')
		.addStringOption((option) =>
			option
				.setName('name')
				.setDescription('Name of command (without prefix)')
				.setMinLength(1)
				.setMaxLength(32)
				.setRequired(true)
		),
	async execute(interaction) {
		try {
			const { guildId: _id, memberPermissions } = interaction;
			const isAuthorized = hasGuildAdminPermissions(memberPermissions);

			if (isAuthorized) {
				const commandName = interaction.options.getString('name');
				const invalidationReason = validateInput('deleteCommand', {
					name: commandName,
				});

				if (invalidationReason) {
					return await interaction.reply({
						content: invalidationReason,
						ephemeral: true,
					});
				}

				// delete command
				const isVerbose = true;
				const { success, msg } = await deleteCommand(
					_id,
					commandName,
					isVerbose
				);

				if (!success) {
					// command deletion failed
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
