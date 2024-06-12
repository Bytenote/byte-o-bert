import { SlashCommandBuilder } from 'discord.js';
import { hasGuildAdminPermissions } from '@byte-o-bert/shared/services/auth';
import { updatePrefix } from '@byte-o-bert/shared/services/guild';
import { validateInput } from '@byte-o-bert/shared/services/validation';
import log from '@byte-o-bert/logger';

const logMeta = { origin: import.meta.url };

export default {
	data: new SlashCommandBuilder()
		.setName('prefix')
		.setDescription('Update the chat prefix')
		.addStringOption((option) =>
			option
				.setName('prefix')
				.setDescription('New prefix')
				.setMinLength(1)
				.setMaxLength(1)
				.setRequired(true)
		),
	async execute(interaction) {
		try {
			const newPrefix = interaction.options.getString('prefix');
			const { guildId: _id, memberPermissions } = interaction;
			const isAuthorized = hasGuildAdminPermissions(memberPermissions);

			if (isAuthorized) {
				const invalidationReason = validateInput('updatePrefix', {
					prefix: newPrefix,
				});

				if (invalidationReason) {
					return await interaction.reply({
						content: invalidationReason,
						ephemeral: true,
					});
				}

				// update prefix if it differs from the current one
				const isVerbose = true;
				const { success, msg } = await updatePrefix(
					_id,
					newPrefix,
					isVerbose
				);

				if (!success) {
					// prefix update failed
					return await interaction.reply({
						content: msg,
						ephemeral: true,
					});
				}

				// prefix updated
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
