import { useEffect, useState } from 'react';

/**
 * Hook for debouncing a value.
 *
 * @param {string|number} value	- Value to debounce
 * @param {number} [delay=200]	- Delay in milliseconds
 * @returns {string|number}		- Debounced value
 */
const useDebounce = (value, delay = 200) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		// immediately return if the value is empty
		if (value === '') {
			setDebouncedValue('');

			return;
		}

		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};

export default useDebounce;
