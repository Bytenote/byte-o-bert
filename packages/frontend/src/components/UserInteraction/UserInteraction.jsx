import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { useDialog, useSnackbar } from './userInteraction.hooks.js';
import {
	handleDialogCancel,
	handleDialogClose,
	handleSnackbarClose,
	submitHandler,
} from './userInteraction.helpers.js';

const UserInteraction = () => {
	return (
		<>
			<DialogInteraction />
			<SnackbarInteraction />
		</>
	);
};

const DialogInteraction = () => {
	const { isOpen, dialogWidth } = useDialog();

	if (isOpen) {
		return (
			<Dialog
				open={isOpen}
				onClose={handleDialogClose}
				fullWidth={!!dialogWidth}
				maxWidth={dialogWidth}
			>
				<DialogComponent />
			</Dialog>
		);
	}

	return null;
};

const SnackbarInteraction = () => {
	const { isOpen, time, duration, severity, message } = useSnackbar();

	if (isOpen) {
		return (
			<Snackbar
				key={time}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				open={isOpen}
				autoHideDuration={duration}
				onClose={handleSnackbarClose}
			>
				<Alert
					variant="filled"
					severity={severity}
					onClose={handleSnackbarClose}
					action={
						<IconButton
							aria-label="close"
							color="inherit"
							sx={{ p: 0.5 }}
							onClick={handleSnackbarClose}
						>
							<CloseIcon />
						</IconButton>
					}
				>
					{message}
				</Alert>
			</Snackbar>
		);
	}

	return null;
};

const DialogComponent = () => {
	const {
		customComponent,
		title,
		message,
		inputLabel,
		inputHelperText,
		inputFunc,
		hasSubmitButton,
		cancelButton,
		submitButton,
	} = useDialog();

	if (customComponent) {
		return customComponent;
	}

	return (
		<form autoComplete="off" onSubmit={submitHandler} value="submit">
			<DialogTitle>{title}</DialogTitle>

			<DialogContent>
				<DialogContentText>{message}</DialogContentText>

				{inputLabel && (
					<TextField
						name="input"
						label={label}
						helperText={inputHelperText}
						onChange={inputFunc}
						variant="standard"
						margin="dense"
						autoFocus
					/>
				)}
			</DialogContent>

			<DialogActions>
				<Button onClick={handleDialogCancel} value="cancel">
					{cancelButton ?? 'Close'}
				</Button>

				{hasSubmitButton && (
					<Button type="submit">{submitButton ?? 'Submit'}</Button>
				)}
			</DialogActions>
		</form>
	);
};

export default UserInteraction;
