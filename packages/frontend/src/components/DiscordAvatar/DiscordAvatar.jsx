import { forwardRef } from 'react';
import Avatar from '@mui/material/Avatar';
import TextAvatar from './TextAvatar';
import {
	DISCORD_AVATAR_URL,
	DISCORD_ICON_URL,
} from './discordAvatar.constants';
import './discordAvatar.css';

/**
 * Component that renders a Discord avatar.
 * If no src is provided, it will render a text avatar.
 * If a type is provided, it will render a user or guild avatar.
 *
 * @param {Object} props
 * @param {string} props.src 		- Source of the avatar
 * @param {string} props.alt 		- Alt text of the avatar
 * @param {string} props.type		- Type of the avatar: 'user' | 'guild'
 * @param {string} props.discordId	- Discord ID of the user or guild
 * @param {string} props.className	- Additional classes to apply
 * @param {Object} props.ref		- Ref object
 * @returns {JSX.Element}
 */
const DiscordAvatar = forwardRef(
	({ src, alt, type, discordId, className, ...props }, ref) => {
		if (!src) {
			// no src, use alt as "text avatar"
			return (
				<TextAvatar
					name={alt}
					className={className}
					ref={ref}
					{...props}
				/>
			);
		}

		if (type) {
			return (
				<UserGuildAvatar
					src={src}
					alt={alt}
					type={type}
					discordId={discordId}
					className={className}
					{...props}
				/>
			);
		}

		// User avatar
		return (
			<Avatar
				src={src}
				alt={alt}
				className={className}
				ref={ref}
				{...props}
			/>
		);
	}
);

const UserGuildAvatar = ({
	src,
	alt,
	type,
	discordId,
	className,
	...props
}) => {
	const fullSrc =
		type === 'guild'
			? `${DISCORD_ICON_URL}/${discordId}/${src}.png?size=256` // guild icon
			: `${DISCORD_AVATAR_URL}/${discordId}/${src}.webp?size=128`; // user avatar

	return (
		<img
			className={`discord-avatar${className ? ` ${className}` : ''}`}
			src={fullSrc}
			alt={alt}
			{...props}
		/>
	);
};

export default DiscordAvatar;
