import { gql } from '@apollo/client';

export const UPDATE_PREFIX = gql`
	mutation UpdatePrefix($id: String!, $prefix: String!) {
		updatePrefix(_id: $id, prefix: $prefix)
	}
`;

export const DELETE_COMMAND = gql`
	mutation DeleteCommand($id: String!, $name: String!) {
		deleteCommand(_id: $id, name: $name)
	}
`;

export const UPDATE_COMMAND_ACTIVE = gql`
	mutation UpdateCommandActive(
		$id: String!
		$name: String!
		$active: Boolean!
	) {
		updateCommandActive(_id: $id, name: $name, active: $active) {
			guildId
			name
			active
			isOptimistic @client
		}
	}
`;

export const UPDATE_COMMAND = gql`
	mutation UpdateCommand($id: String!, $name: String!, $action: String!) {
		updateCommand(_id: $id, name: $name, action: $action) {
			guildId
			name
			action
			isOptimistic @client
		}
	}
`;

export const CREATE_COMMAND = gql`
	mutation CreateCommand($id: String!, $name: String!, $action: String!) {
		createCommand(_id: $id, name: $name, action: $action) {
			guildId
			name
			action
			active
			author
			isOptimistic @client
		}
	}
`;
