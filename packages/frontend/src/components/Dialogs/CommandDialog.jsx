import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useCommandDialog } from './dialogs.hooks';
import { commandDialogSubmitter, handleDialogCancel } from './dialogs.helpers';
import './dialogs.css';

const CommandDialog = () => {
	const { title, type, label } = useCommandDialog();

	return (
		<form
			autoComplete="off"
			onSubmit={commandDialogSubmitter}
			value="submit"
		>
			<DialogTitle className="command-dialog-title">{title}</DialogTitle>
			<DialogContent>
				{type === 'create' && (
					<TextField
						autoComplete="off"
						margin="dense"
						name="name"
						label="Name"
						variant="standard"
						autoFocus
						fullWidth
					/>
				)}
				<TextField
					autoComplete="off"
					margin="dense"
					name="action"
					label="Action"
					variant="standard"
					autoFocus={type === 'edit'}
					fullWidth
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleDialogCancel} value="cancel">
					Cancel
				</Button>
				<Button type="submit">{label}</Button>
			</DialogActions>
		</form>
	);
};

export default CommandDialog;
