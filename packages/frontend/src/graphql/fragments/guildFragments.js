import { gql } from '@apollo/client';

export const GUILD_PREFIX_FRAGMENT = gql`
	fragment GuildPrefix on GeneralGuild {
		prefix
	}
`;

export const COMMAND_FRAGMENT = gql`
	fragment Command on GuildCommand {
		name
		action
		active
		author
	}
`;

export const COMMAND_ACTIVE_FRAGMENT = gql`
	fragment CommandActive on GuildCommand {
		active
	}
`;

export const COMMAND_ACTION_FRAGMENT = gql`
	fragment CommandAction on GuildCommand {
		action
	}
`;

export const COMMAND_AUTHOR_FRAGMENT = gql`
	fragment CommandAuthor on GuildCommand {
		author
	}
`;

export const COMMAND_NAME_ACTION_FRAGMENT = gql`
	fragment CommandNameAction on GuildCommand {
		name
		action
	}
`;
