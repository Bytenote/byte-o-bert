const { getNpmPath } = require('./utils/helpers.cjs');

// npm path needed for pm2 to run npm scripts
const npmPath = getNpmPath();

const apps = {
	apps: [
		{
			name: 'dc-bot',
			exec_mode: 'fork',
			env: {
				NODE_ENV: 'production',
			},
			script: npmPath,
			args: 'run prod:bot',
		},
	],
};

module.exports = apps;
