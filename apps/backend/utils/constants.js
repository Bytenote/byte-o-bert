const IS_DEV = process.env.NODE_ENV === 'development';

export const PORT = process.env.VITE_NODE_PORT;
export const VITE_PORT = process.env.VITE_REACT_PORT;
export const HAS_PROXY = process.env.VITE_HAS_PROXY === 'true';
export const MAX_COOKIE_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days
export const SESSION_NAME = 'session_id';
export const DISCORD_OAUTH_REDIRECT_PARAMS = '/api/v1/auth/discord/redirect';
export const REDIRECT_URL = `${
	IS_DEV ? `http://localhost:${PORT}` : process.env.VITE_PROD_URL
}${DISCORD_OAUTH_REDIRECT_PARAMS}`;
