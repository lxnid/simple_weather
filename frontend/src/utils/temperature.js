/**
 * Convert Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit
 */
export function celsiusToFahrenheit(celsius) {
	return (celsius * 9) / 5 + 32;
}

/**
 * Convert Fahrenheit to Celsius
 * @param {number} fahrenheit - Temperature in Fahrenheit
 * @returns {number} Temperature in Celsius
 */
export function fahrenheitToCelsius(fahrenheit) {
	return ((fahrenheit - 32) * 5) / 9;
}

/**
 * Format temperature with appropriate unit
 * @param {number} temp - Temperature value
 * @param {string} unit - 'C' or 'F'
 * @returns {string} Formatted temperature string
 */
export function formatTemperature(temp, unit = 'C') {
	const roundedTemp = Math.round(temp);
	return unit === 'F' ? `${roundedTemp}°F` : `${roundedTemp}°C`;
}

/**
 * Get temperature in requested unit
 * @param {number} tempC - Temperature in Celsius
 * @param {string} unit - 'C' or 'F'
 * @returns {number} Temperature in requested unit
 */
export function getTemperature(tempC, unit = 'C') {
	return unit === 'F' ? celsiusToFahrenheit(tempC) : tempC;
}
