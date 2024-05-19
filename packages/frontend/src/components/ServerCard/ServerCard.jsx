import { memo } from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import DiscordAvatar from '../DiscordAvatar/DiscordAvatar';
import { clickHandler } from './serverCard.helpers';
import { ADD_BOT_URL } from '../../utils/constants';
import './serverCard.css';

const ServerCard = memo(({ guild, type }) => {
	return (
		<ServerLinkWrapper guildId={guild.id} type={type}>
			<Card className="server-card">
				<DiscordAvatar
					src={guild.icon}
					alt={guild.name}
					type="guild"
					discordId={guild.id}
					className="server-card-avatar"
				/>
				<CardContent className="server-card-text">
					<span className="ellipsis primary-text">{guild.name}</span>
					<span className="ellipsis secondary-text">
						{guild.owner ? 'Owner' : 'Admin'}
					</span>
				</CardContent>
			</Card>
		</ServerLinkWrapper>
	);
});

const ServerLinkWrapper = ({ children, guildId, type }) => {
	if (type === 'mutual') {
		return (
			<Link
				to={`/servers/${guildId}`}
				state={{ from: window.location.pathname }}
				onClick={clickHandler}
				style={{ textDecoration: 'none' }}
			>
				{children}
			</Link>
		);
	}

	return (
		<a href={ADD_BOT_URL} onClick={clickHandler}>
			{children}
		</a>
	);
};

export default ServerCard;
