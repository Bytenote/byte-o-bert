const { getNpmPath, getNumberOfInstances } = require('./utils/helpers.cjs');

// npm path needed for pm2 to run npm scripts
const npmPath = getNpmPath();
// number of instances to run, for load balancing via e.g. nginx
const instances = getNumberOfInstances();

const apps = {
	apps: Array.from({ length: instances }, (_, i) => ({
		name: `node-${i}`,
		exec_mode: 'fork',
		env: {
			NODE_ENV: 'production',
			VITE_NODE_PORT: +process.env.VITE_NODE_PORT + i,
		},
		script: npmPath,
		args: 'run prod:backend',
	})),
};

module.exports = apps;
