import { gql } from '@apollo/client';

export const GET_SETTINGS_PAGE = gql`
	query SettingsPageQuery {
		admins {
			_id
			avatar
			uniqueName
		}
		settings {
			isPrivate
		}
	}
`;
