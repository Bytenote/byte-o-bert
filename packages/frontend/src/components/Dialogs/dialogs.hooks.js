import { useReactiveVar } from '@apollo/client';
import { dialogVar } from '../../graphql/reactiveVars/userInteractionVars';

/**
 * Custom hook that returns the dialog title, text
 * and label for the command dialog, depending on
 * the command type (create or edit).
 *
 * @returns {Object}
 */
export const useCommandDialog = () => {
	const { cmdName, type } = useReactiveVar(dialogVar)?.value ?? {};

	const title =
		type === 'edit' ? `Edit command "${cmdName}"` : 'Create command';
	const label = type === 'edit' ? 'Update' : 'Create';

	return { title, type, label };
};
