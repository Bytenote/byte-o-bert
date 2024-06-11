import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Returns the relative path of the specified file
 * from the current working directory.
 *
 * @param {string} file - File URL
 * @returns {string}
 */
export const getRelativePath = (file) => {
	const cwd = process.cwd();
	const absolutePath = fileURLToPath(file);

	return path.relative(cwd, absolutePath);
};
