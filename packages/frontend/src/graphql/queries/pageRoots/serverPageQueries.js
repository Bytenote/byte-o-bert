import { gql } from '@apollo/client';

export const GET_SERVER_PAGE = gql`
	query ServerPageQuery($id: String!) {
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
		guildCommands(_id: $id) {
			guildId
			name
			action @nonreactive
			author
			active @nonreactive
		}
	}
`;
