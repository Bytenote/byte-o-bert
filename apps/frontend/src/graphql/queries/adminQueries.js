import { gql } from '@apollo/client';

export const GET_ADMINS = gql`
	query AdminsQuery {
		admins {
			_id
			uniqueName
			avatar
		}
	}
`;
