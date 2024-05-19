/**
 * Gets the first letters of each word in a string
 * and returns them as a single string.
 *
 * @param {string} str - The string to get the first letters from
 * @returns {string}
 */
export const getFirstLetters = (str) => {
	return str
		.split(' ')
		.map((word) => word[0])
		.join('');
};

/**
 * Calculates the font size for the fallback avatar text
 * based on the length of the name.
 * The font size is a percentage of the default size,
 * starting at 150% and decreasing by 5% for each letter,
 * with a minimum of 65%.
 *
 * @param {string} name - The name to calculate the font size for
 * @returns {string}
 */
export const getFontSize = (name) => {
	const fontSize = Math.max(150 - name.length * 5, 65);

	return `${fontSize}%`;
};
