import { gql } from '@apollo/client';

export const GET_DASHBOARD_PAGE = gql`
	query DashboardPageQuery {
		userBotGuilds {
			mutual {
				id
				name
				icon
				owner
			}
			eligible {
				id
				icon
				name
				owner
			}
		}
		settings {
			isPrivate
		}
	}
`;
