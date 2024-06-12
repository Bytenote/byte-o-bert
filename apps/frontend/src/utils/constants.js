const NODE_PORT = import.meta.env.VITE_NODE_PORT;

export const PROD_URL = import.meta.env.VITE_PROD_URL;
export const IS_DEV = import.meta.env.MODE === 'development';
export const HAS_PROXY = import.meta.env.VITE_HAS_PROXY === 'true';
export const BACKEND_URL = IS_DEV ? `http://localhost:${NODE_PORT}` : PROD_URL;
export const ADD_BOT_URL = `${BACKEND_URL}/api/v1/add-bot`;
