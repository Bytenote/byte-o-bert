import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { adminDialogSubmitter, handleDialogCancel } from './dialogs.helpers';
import './dialogs.css';

const AdminDialog = () => {
	return (
		<form autoComplete="off" onSubmit={adminDialogSubmitter} value="submit">
			<DialogTitle className="command-dialog-title">
				Add new admin(s)
			</DialogTitle>
			<DialogContent>
				You can either add one admin by entering their Discord ID, or up
				to 10 admins by entering multiple IDs separated by commas.
				<TextField
					autoComplete="off"
					margin="dense"
					name="ids"
					label="ID(s)"
					variant="standard"
					autoFocus
					fullWidth
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleDialogCancel} value="cancel">
					Cancel
				</Button>
				<Button type="submit">Add</Button>
			</DialogActions>
		</form>
	);
};

export default AdminDialog;
