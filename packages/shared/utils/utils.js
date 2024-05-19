export const is_prod = process.env.NODE_ENV === 'production';
export const website_url = is_prod
	? process.env.VITE_PROD_URL
	: `http://localhost:${process.env.VITE_REACT_PORT}`;
