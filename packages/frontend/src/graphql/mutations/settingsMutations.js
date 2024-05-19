import { gql } from '@apollo/client';

export const UPDATE_IS_PRIVATE = gql`
	mutation UpdateIsPrivate($isPrivate: Boolean!) {
		updateIsPrivate(isPrivate: $isPrivate) {
			isPrivate
			isOptimistic @client
		}
	}
`;
