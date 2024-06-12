import { gql } from '@apollo/client';

export const ADMIN_ID_FRAGMENT = gql`
	fragment AdminId on Admin {
		_id
	}
`;

export const ADMIN_FRAGMENT = gql`
	fragment Admin on Admin {
		_id
		uniqueName
		name
		avatar
	}
`;
