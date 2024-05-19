import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Guild } from '@byte-o-bert/database/models';
import log from '@byte-o-bert/shared/services/log';
import { website_url } from '@byte-o-bert/shared/utils/utils';

const logMeta = { origin: import.meta.url };

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Stop resisting, you are being helped!'),
	async execute(interaction) {
		try {
			const { guildId: _id } = interaction;
			const guildDoc = await Guild.findOne({ _id }, 'prefix');

			if (guildDoc?._id) {
				return await interaction.reply({
					embeds: [embedFunc(guildDoc?.prefix)],
				});
			}

			return await interaction.reply({
				content:
					"Looks like I currently don't have a prefix set. Try adding me to your server again.",
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

const embedFunc = (prefix) =>
	new EmbedBuilder()
		.setColor('#3a2cba')
		.setTitle('Help')
		.setURL(website_url)
		.setDescription(
			'Everything you need to know about me and my settings, beep boop:'
		)
		.setThumbnail('https://i.imgur.com/ZVsHyCI.png')
		.addFields(
			{
				name: '__Website__',
				value: `${website_url}\n*Easiest way to manage me for all your servers*\n᲼`,
			},
			{
				name: '__GitHub__',
				value: 'https://github.com/bytenote/byte-o-bert\n*Host me yourself*\n᲼',
			},
			{
				name: '__Chat commands__',
				value: 'Visit my website for easier command management',
			},
			{ name: 'See all commands', value: '/commands', inline: true },
			{ name: 'Set prefix', value: '/prefix [prefix]', inline: true },
			{
				name: 'Use command',
				value: `${prefix}[name]`,
				inline: true,
			},
			{
				name: 'Add command',
				value: '/create [name] [action]',
				inline: true,
			},
			{
				name: 'Edit command',
				value: '/update [name] [new-action]',
				inline: true,
			},
			{
				name: 'Delete command',
				value: '/delete [name]',
				inline: true,
			}
		);
