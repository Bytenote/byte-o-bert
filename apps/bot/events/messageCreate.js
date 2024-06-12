import { Guild } from '@byte-o-bert/database/models';
import { hasGuildPermissions } from '@byte-o-bert/shared/services/auth';
import log from '@byte-o-bert/logger';
import { POSSIBLE_PREFIXES } from '@byte-o-bert/shared/utils/constants';

const logMeta = { origin: import.meta.url };

export default {
	name: 'messageCreate',
	/**
	 * Handles all messages sent in all guilds.
	 * Checks if the message is a chat command by
	 * comparing the first character of it with the
	 * collection of possible prefixes and then checking
	 * if the prefix used is the same as the one set for
	 * the guild.
	 * Responds accordingly to the user.
	 *
	 * @param {Object} message	- Message object
	 */
	async execute(message) {
		try {
			const { guildId: _id, content, channel } = message;
			const botPerms = message.guild.members.me.permissionsIn(channel);
			const [usedPrefix] = content;
			const commandInputName = content.slice(1)?.split(' ')?.[0];

			// ignore messages from bots or messages that don't start with a possible prefix or messages that are too short
			if (
				message.author.bot ||
				!POSSIBLE_PREFIXES.has(usedPrefix) ||
				!commandInputName
			) {
				return;
			}

			const { prefix } = await Guild.findOne(
				{ _id },
				{
					prefix: 1,
				}
			);
			if (usedPrefix === prefix) {
				const hasSendMessagesPermissions = hasGuildPermissions(
					botPerms,
					['SendMessages']
				);
				if (!hasSendMessagesPermissions) {
					// inform user via PM if the bot doesn't have permission to send messages in the channel
					return message.author.send(
						`I don't have permission to send messages in ${channel.name}.`
					);
				}

				// get the command from the database
				const guildDoc = await Guild.findOne(
					{ _id },
					{ [`commands.${commandInputName}`]: 1 }
				);

				const { name, action, active } =
					guildDoc?.commands?.get(commandInputName) ?? {};
				if (name) {
					if (active) {
						// reply with action
						return message.reply(action);
					}

					// command not active
					return message.reply(
						`\`${prefix}${commandInputName}\` is not active`
					);
				}

				// no command found
				return message.reply(
					`\`${prefix}${commandInputName}\` does not exist`
				);
			}
		} catch (err) {
			log.error(err, logMeta);
		}
	},
};
