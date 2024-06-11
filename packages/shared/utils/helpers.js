import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

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

/**
 * Iterates over all files in a directory and returns
 * an array of promises that resolve to the imported files.
 * For dynamically importing files.
 *
 * @param {string} dirPath		- Directory path
 * @param {string[]} extensions	- File extensions to import
 * @returns {Promise[]}
 */
export const importFilesFromDirectory = (dirPath, extensions = []) => {
	const files = _getFilesInDirectory(dirPath, extensions);

	const importPromises = files.map((file) => {
		const filePath = path.join(dirPath, file);
		const fileUrl = pathToFileURL(filePath).href;
		const importedFile = import(fileUrl);

		return importedFile;
	});

	return Promise.all(importPromises);
};

/**
 * Iterates over all files in a directory and returns
 * an array of file contents.
 * For dynamically reading file contents.
 *
 * @param {string} dirPath		- Directory path
 * @param {string[]} extensions	- File extensions to read
 * @returns {string[]}
 */
export const readFilesFromDirectory = (dirPath, extensions = []) => {
	const files = _getFilesInDirectory(dirPath, extensions);

	return files.map((file) => {
		const filePath = path.join(dirPath, file);
		const fileContent = fs.readFileSync(filePath, 'utf8');

		return fileContent;
	});
};

/**
 * Iterates over all files in a directory, filters out
 * files that don't have the specified extensions, and
 * returns an array of file names.
 * @private
 *
 * @param {string} dirPath		- Absolute directory path
 * @param {string[]} extensions	- File extensions to read
 * @returns {string[]}
 */
const _getFilesInDirectory = (dirPath, extensions = []) => {
	return fs
		.readdirSync(dirPath)
		.filter((file) => extensions.some((ext) => file.endsWith(ext)));
};
