import {
	dialogVar,
	snackbarVar,
} from '../../graphql/reactiveVars/userInteractionVars.js';
import {
	DIALOG_DEFINITIONS,
	SNACKBAR_DEFINITIONS,
} from './userInteraction.constants.jsx';

/**
 * Handles the submission of the dialog.
 * Calls the submit function based on the dialog
 * message definition, if defined.
 * Then calls the dialog close handler to close
 * the dialog.
 *
 * @param {Event} e - Event object
 */
export const submitHandler = (e) => {
	e.preventDefault();

	const { key } = dialogVar() ?? {};
	const { submitFunc } = DIALOG_DEFINITIONS[key] ?? {};

	if (submitFunc) {
		const formData = new FormData(e.currentTarget);
		const input = formData.get('input');

		submitFunc(input);
	}

	handleDialogClose();
};

/**
 * Handles the cancellation of the dialog.
 * Can call additional cancel function based
 * on the dialog message definition, if defined.
 * Then closes the dialog by setting the reactive
 * variable of the dialog to its default closed state.
 *
 * @param {Event} e - Event object
 */
export const handleDialogCancel = (e) => {
	const { key } = dialogVar() ?? {};
	const { cancelFunc } = DIALOG_DEFINITIONS[key] ?? {};

	if (e.target?.value === 'cancel' && cancelFunc) {
		cancelFunc();
	}

	dialogVar({ isOpen: false, key: null, value: null });
};

/**
 * Handles the regular closing of the dialog.
 * Can disable the clickaway functionality.
 * Closes the dialog by setting the reactive variable
 * of the dialog to its default closed state.
 *
 * @param {Event} _			- Unused event Object
 * @param {string} reason	- Reason for closing the dialog
 */
export const handleDialogClose = (_, reason) => {
	const { key } = dialogVar() ?? {};
	const { clickAwayDisabled } = DIALOG_DEFINITIONS[key] ?? {};

	if (clickAwayDisabled && reason === 'backdropClick') {
		return;
	}

	dialogVar({ isOpen: false, key: null, value: null });
};

/**
 * Handles the closing of the snackbar.
 * Can disable the clickaway functionality.
 * Sets the reactive variable of the snackbar
 * to its default closed state.
 *
 * @param {Event} _ 		- Unused event object
 * @param {string} reason	- Reason for closing the snackbar
 */
export const handleSnackbarClose = (_, reason) => {
	let { key, clickAwayDisabled } = snackbarVar() ?? {};
	const { clickAwayDisabled: clickAwayDisabledPrecedence } =
		SNACKBAR_DEFINITIONS[key] ?? {};

	if (
		clickAwayDisabledPrecedence &&
		clickAwayDisabled !== clickAwayDisabledPrecedence
	) {
		// snackbar definition has precedence
		clickAwayDisabled = clickAwayDisabledPrecedence;
	}

	if (clickAwayDisabled && reason === 'clickaway') {
		return;
	}

	snackbarVar({ isOpen: false, key: null, message: null });
};

/**
 * Displays the given error message in a snackbar.
 * If no message is provided, a default error message
 * is displayed.
 *
 * @param {Error} err - Error object
 */
export const displayServerError = (err) => {
	snackbarVar({
		isOpen: true,
		message: err?.message ?? 'An error occurred',
		severity: 'error',
		duration: 3_000,
	});
};
