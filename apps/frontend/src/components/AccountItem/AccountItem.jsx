import { memo } from 'react';
import { useQuery } from '@apollo/client';
import IconButton from '@mui/material/Button';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import { GET_SETTINGS } from '../../graphql/queries/settingsQueries';
import DiscordAvatar from '../DiscordAvatar/DiscordAvatar';
import { removeAdminHandler } from './accountItem.helpers';
import './accountItem.css';

const AccountItem = memo(({ account }) => {
	const { data } = useQuery(GET_SETTINGS, {
		fetchPolicy: 'cache-only',
	});
	const isPrivate = data?.settings?.isPrivate ?? true;

	return (
		<div
			className={`account-item${!isPrivate ? ' disabled-content' : ''}`}
			value={account._id}
		>
			<div className="content-description account-details">
				<ListItemAvatar style={{ paddingRight: '10px' }}>
					<DiscordAvatar
						src={account.avatar}
						alt={`${account.uniqueName}'s avatar`}
						type="user"
						discordId={account._id}
						style={{
							width: '45px',
							height: '45px',
							borderRadius: '50%',
						}}
					/>
				</ListItemAvatar>
				<ListItemText
					className="account-item-text"
					primary={account.uniqueName}
					secondary={account._id}
				/>
			</div>
			<div className="account-actions">
				<AccountActions discordId={account._id} />
			</div>
		</div>
	);
});

const AccountActions = memo(({ discordId }) => {
	return (
		<Tooltip
			title="Remove admin"
			TransitionComponent={Zoom}
			enterDelay={300}
			enterNextDelay={150}
			leaveDelay={150}
			arrow
			disableInteractive
		>
			<IconButton
				className="remove-admin-btn"
				onClick={removeAdminHandler}
				name={discordId}
			>
				<DeleteIcon />
			</IconButton>
		</Tooltip>
	);
});

export default AccountItem;
