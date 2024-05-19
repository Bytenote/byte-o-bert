import { removeAdminSubmit } from '../AccountItem/accountItem.helpers';
import AdminDialog from '../Dialogs/AdminDialog';
import CommandDialog from '../Dialogs/CommandDialog';
import { deleteCommandSubmit } from '../ServerCommand/serverCommand.helpers';

/**
 * Collection of dialog messages.
 *
 * @property { React.ReactElement } [customComponent]	- Overwrites entire dialog with custom dialog component
 * @property { string } [title]							- Title of window
 * @property { string } [message]						- Message to display
 * @property { boolean } [clickAwayDisabled=false]		- Prevents closing window by clicking next to it if true
 * @property { boolean } [hasSubmitButton=false]		- Shows submit button if true
 * @property { string } [dialogWidth='md']				- Width of dialog: '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @property { string } [inputLabel='']					- Shows a textfield with text if not empty
 * @property { string } [inputHelperText]				- Shows a helper text under the textfield
 * @property { Function } [inputFunc]					- onChange function for textfield
 * @property { string } [submitButton='Submit']			- Labels submitButton if hasSubmitButton is true
 * @property { string } [cancelButton='Close']			- Labels cancelButton
 * @property { Function } [submitFunc]					- Submit function
 * @property { Function } [cancelFunc]					- Cancel function
 */
export const DIALOG_DEFINITIONS = {
	CreateAdmin: {
		customComponent: <AdminDialog />,
		dialogWidth: 'sm',
	},
	DeleteCommand: {
		hasSubmitButton: true,
		title: 'Delete Command',
		message: 'Are you sure you want to delete this command?',
		submitButton: 'Yes',
		cancelButton: 'No',
		submitFunc: deleteCommandSubmit,
	},
	CommandDialog: {
		customComponent: <CommandDialog />,
		dialogWidth: 'xs',
	},
	RemoveAdmin: {
		hasSubmitButton: true,
		title: 'Remove Admin',
		message: 'Are you sure you want to remove this admin?',
		submitButton: 'Yes',
		cancelButton: 'No',
		submitFunc: removeAdminSubmit,
	},
};

/**
 * Collection of snackbar messages.
 *
 * @property { string } severity					- Determines color: 'success' | 'error' | 'warning' | 'info'
 * @property { string } message						- Text inside snackbar
 * @property { boolean } [clickAwayDisabled=false]	- Prevents closing snackbar by clicking next to it if true
 * @property { number } [duration=null] 			- Duration of snackbar being shown, defaults to permanent
 */
export const SNACKBAR_DEFINITIONS = {
	AdminAdded: {
		severity: 'success',
		message: 'Admin(s) added',
		duration: 1_500,
	},
	AdminExists: {
		severity: 'info',
		message: 'Admin already exists',
		duration: 3_000,
	},
	AdminIdInvalid: {
		severity: 'warning',
		message: 'Invalid admin ID(s)',
		duration: 3_000,
	},
	AdminIdOverLimit: {
		severity: 'warning',
		message: 'Between 1 and 10 admin IDs allowed',
		duration: 3_000,
	},
	AdminRemoved: {
		severity: 'success',
		message: 'Admin removed',
		duration: 1_500,
	},
	CommandActionInvalid: {
		severity: 'warning',
		message: 'Command action must be set',
		duration: 3_000,
	},
	CommandActionSame: {
		severity: 'info',
		message: 'Command already set to this action',
		duration: 3_000,
	},
	CommandCreated: {
		severity: 'success',
		message: 'Command created',
		duration: 1_500,
	},
	CommandDeleted: {
		severity: 'success',
		message: 'Command deleted',
		duration: 1_500,
	},
	CommandDisabled: {
		severity: 'success',
		message: 'Command disabled',
		duration: 1_500,
	},
	CommandEnabled: {
		severity: 'success',
		message: 'Command enabled',
		duration: 1_500,
	},
	CommandExists: {
		severity: 'info',
		message: 'Command already exists',
		duration: 3_000,
	},
	CommandNameInvalid: {
		severity: 'warning',
		message: 'Command name must be set',
		duration: 3_000,
	},
	CommandNameSpacesInvalid: {
		severity: 'warning',
		message: 'Command name cannot contain spaces',
		duration: 3_000,
	},
	CommandUpdated: {
		severity: 'success',
		message: 'Command updated',
		duration: 1_500,
	},
	LogoutError: {
		severity: 'error',
		message: 'Failed to logout',
		duration: 3_000,
	},
	LogoutSuccess: {
		severity: 'success',
		message: 'Logged out',
		duration: 1_500,
	},
	PrefixInvalid: {
		severity: 'warning',
		message: 'Invalid prefix',
		duration: 3_000,
	},
	PrefixSame: {
		severity: 'info',
		message: 'Prefix is already in use',
		duration: 3_000,
	},
	PrefixTooLong: {
		severity: 'warning',
		message: 'Prefix limited to one character',
		duration: 3_000,
	},
	PrefixUpdated: {
		severity: 'success',
		message: 'Prefix updated',
		duration: 1_500,
	},
	SettingsSaved: {
		severity: 'success',
		message: 'Settings saved',
		duration: 1_500,
	},
};
