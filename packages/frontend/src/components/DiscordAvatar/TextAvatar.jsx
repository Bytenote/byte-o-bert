import { forwardRef } from 'react';
import { getFirstLetters, getFontSize } from './discordAvatar.helpers';

const TextAvatar = forwardRef(({ name, className, ...props }, ref) => {
	const fallbackName = getFirstLetters(name);
	const fontSize = getFontSize(fallbackName);

	return (
		<div
			className={`discord-avatar-text flex-center${
				className ? ` ${className}` : ''
			}`}
			ref={ref}
			{...props}
		>
			<span className="ellipsis" style={{ fontSize }}>
				{fallbackName}
			</span>
		</div>
	);
});

export default TextAvatar;
