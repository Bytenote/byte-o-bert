import { gql } from '@apollo/client';

export const REMOVE_ADMIN = gql`
	mutation RemoveAdmin($id: String!) {
		removeAdmin(_id: $id)
	}
`;

export const ADD_ADMINS_BY_IDS = gql`
	mutation AddAdminsByIds($ids: [String!]!) {
		addAdminsByIds(ids: $ids) {
			_id
			uniqueName
			name
			avatar
		}
	}
`;
