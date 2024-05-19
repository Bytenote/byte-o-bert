import { useEffect, useState, useRef } from 'react';

/**
 * Hook for throttling a value.
 *
 * @param {string|number} value	- Value to throttle
 * @param {number} [delay=300]	- Delay in milliseconds
 * @returns {string|number}		- Throttled value
 */
const useThrottle = (value, delay = 500) => {
	const [throttledValue, setThrottledValue] = useState(value);
	const lastRan = useRef(Date.now());

	useEffect(() => {
		const handler = setTimeout(() => {
			if (Date.now() - lastRan.current >= delay) {
				setThrottledValue(value);
				lastRan.current = Date.now();
			}
		}, delay - (Date.now() - lastRan.current));

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return throttledValue;
};

export default useThrottle;
