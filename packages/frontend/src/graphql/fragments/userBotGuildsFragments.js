import { gql } from '@apollo/client';

export const GUILD_MUTUAL_SEARCH_FRAGMENT = gql`
	fragment UserGuildMutualSearch on UserBotGuilds {
		mutual {
			id
			name
			icon
			owner
		}
	}
`;

export const GUILD_ELIGIBLE_SEARCH_FRAGMENT = gql`
	fragment UserGuildEligibleSearch on UserBotGuilds {
		eligible {
			id
			name
			icon
			owner
		}
	}
`;
