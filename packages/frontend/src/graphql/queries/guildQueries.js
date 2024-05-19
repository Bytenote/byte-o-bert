import { gql } from '@apollo/client';

export const GET_GENERAL_GUILD_DATA = gql`
	query GeneralGuildDataQuery($id: String!) {
		guildGeneral(_id: $id) {
			_id
			icon
			name
			members
			prefix
			roles
			tChannels
			vChannels
		}
	}
`;

export const GET_GUILD_COMMANDS = gql`
	query GuildCommands($id: String!) {
		guildCommands(_id: $id) {
			guildId
			name
			action @nonreactive
			author
			active @nonreactive
		}
	}
`;
