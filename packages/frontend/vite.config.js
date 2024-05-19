import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: 'localhost',
		port: process.env.VITE_REACT_PORT,
	},
	build: {
		outDir: './html',
	},
});
