import { gql } from '@apollo/client';

export const GET_USER = gql`
	query UserQuery {
		user {
			_id
			name
			avatar
			isOwner
		}
	}
`;
