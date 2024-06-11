import { memo } from 'react';
import { useFragment } from '@apollo/client';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	COMMAND_ACTION_FRAGMENT,
	COMMAND_ACTIVE_FRAGMENT,
	COMMAND_AUTHOR_FRAGMENT,
} from '../../graphql/fragments/guildFragments';
import {
	deleteHandler,
	editHandler,
	switchHandler,
} from './serverCommand.helpers';
import './serverCommand.css';

const ServerCommand = memo(({ name }) => {
	const { guildId } = useParams();

	return (
		<Card className="card-command" elevation={4}>
			<CardContent>
				<div className="command-heading">
					<div>
						<span className="command-name ellipsis">{name}</span>
						<CommandAuthor guildId={guildId} name={name} />
					</div>
					<CommandActiveSwitch guildId={guildId} name={name} />
				</div>
				<CommandAction guildId={guildId} name={name} />
			</CardContent>
			<CommandActions guildId={guildId} name={name} />
		</Card>
	);
});

const CommandAuthor = memo(({ guildId, name }) => {
	const {
		data: { author },
	} = useFragment({
		fragment: COMMAND_AUTHOR_FRAGMENT,
		from: {
			__typename: 'GuildCommand',
			guildId,
			name,
		},
	});

	return <span className="command-author ellipsis">by {author}</span>;
});

const CommandActiveSwitch = memo(({ guildId, name }) => {
	const { data } = useFragment({
		fragment: COMMAND_ACTIVE_FRAGMENT,
		from: {
			__typename: 'GuildCommand',
			guildId,
			name,
		},
	});
	const isActive = data?.active ?? true;

	return (
		<Tooltip
			title={isActive ? 'Enabled' : 'Disabled'}
			enterDelay={800}
			enterNextDelay={600}
			leaveDelay={150}
			arrow
			disableInteractive
		>
			<label>
				<Switch
					size="small"
					checked={isActive}
					name={`${guildId}::${name}`}
					onChange={switchHandler}
				/>
			</label>
		</Tooltip>
	);
});

const CommandAction = memo(({ guildId, name }) => {
	const {
		data: { action },
	} = useFragment({
		fragment: COMMAND_ACTION_FRAGMENT,
		from: {
			__typename: 'GuildCommand',
			guildId,
			name,
		},
	});

	return <span className="command-action ellipsis">{action}</span>;
});

const CommandActions = memo(({ guildId, name }) => {
	return (
		<CardActions className="command-actions">
			<Button
				startIcon={<EditIcon />}
				variant="text"
				name={`${guildId}::${name}`}
				onClick={editHandler}
			>
				Edit
			</Button>
			<Button
				startIcon={<DeleteIcon />}
				variant="text"
				name={`${guildId}::${name}`}
				onClick={deleteHandler}
			>
				Delete
			</Button>
		</CardActions>
	);
});

export default ServerCommand;
