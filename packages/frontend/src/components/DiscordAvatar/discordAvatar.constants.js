import { HAS_PROXY, IS_DEV, PROD_URL } from '../../utils/constants';

export const DISCORD_ICON_URL =
	IS_DEV || !HAS_PROXY
		? 'https://cdn.discordapp.com/icons'
		: `${PROD_URL}/icons`;
export const DISCORD_AVATAR_URL =
	IS_DEV || !HAS_PROXY
		? 'https://cdn.discordapp.com/avatars'
		: `${PROD_URL}/avatars`;
