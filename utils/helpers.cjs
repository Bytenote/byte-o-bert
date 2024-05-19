const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

/**
 * Gets the os specific npm path.
 * If nvm is used, it will use the npm path
 * from nvm, otherwise it will lookup the npm
 * path based on the node path.
 *
 * @returns {string}
 */
exports.getNpmPath = () => {
	// get npm path if nvm is used
	const nvmPath = process.env.NVM_BIN
		? path.join(process.env.NVM_BIN, 'npm')
		: null;

	// get os based npm path
	let osNpmPath;
	if (os.platform() === 'win32') {
		osNpmPath = path.join(
			execSync('where node', { windowsHide: true })
				.toString()
				.replace('node.exe', '')
				.trim(),
			'node_modules',
			'npm',
			'bin',
			'npm-cli.js'
		);
	} else {
		osNpmPath = execSync('which node').toString().replace('node\n', 'npm');
	}

	return nvmPath ?? osNpmPath;
};

/**
 * Returns the number of instances to run.
 * Defaults to 1 if PM2_INSTANCES ENV is not set.
 *
 * @returns {number}
 */
exports.getNumberOfInstances = () => {
	const DEFAULT = 1;
	const coreCount = os.cpus().length;
	const envInstances = process.env.PM2_INSTANCES;

	return envInstances === 'max' || envInstances === '0'
		? coreCount
		: envInstances ?? DEFAULT;
};
