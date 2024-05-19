import { useReactiveVar } from '@apollo/client';
import {
	dialogVar,
	snackbarVar,
} from '../../graphql/reactiveVars/userInteractionVars';
import {
	DIALOG_DEFINITIONS,
	SNACKBAR_DEFINITIONS,
} from './userInteraction.constants.jsx';

/**
 * Custom hook that retrieves the dialog state
 * from the respective reactive variable,
 * and returns the dialog state and content
 * from the definitions.
 * The definitions are used to map the message
 * to the respective dialog content.
 *
 * @returns {Object}
 */
export const useDialog = () => {
	const { isOpen, key } = useReactiveVar(dialogVar);
	const content = DIALOG_DEFINITIONS[key] ?? {};

	return { isOpen, ...content };
};

/**
 * Custom hook that retrieves the snackbar state
 * from the respective reactive variable,
 * and returns the snackbar state and content
 * from the definitions.
 * The definitions are used to map the message
 * to the respective snackbar content.
 *
 * @returns {Object}
 */
export const useSnackbar = () => {
	const { isOpen, key, ...args } = useReactiveVar(snackbarVar);
	const content = SNACKBAR_DEFINITIONS[key] ?? args ?? {};
	const time = Date.now();

	return { isOpen, time, ...content };
};
