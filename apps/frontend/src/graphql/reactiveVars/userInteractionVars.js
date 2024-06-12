import { makeVar } from '@apollo/client';

const initialDialogState = {
	isOpen: false,
	key: null,
	value: null,
};

const initialSnackbarState = {
	isOpen: false,
	key: null,
	message: null,
};

export const dialogVar = makeVar(initialDialogState);
export const snackbarVar = makeVar(initialSnackbarState);
