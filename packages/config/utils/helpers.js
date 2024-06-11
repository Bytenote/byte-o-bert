import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Returns the absolute directory path of the
 * specified file.
 * Intended to be used with 'import.meta.url'
 * as the file parameter.
 *
 * @param {string} file - File URL
 * @returns {string}
 */
export const getDirnameEnv = (file) => {
	const __filename = fileURLToPath(file);
	const __dirname = path.dirname(__filename);

	return __dirname;
};
