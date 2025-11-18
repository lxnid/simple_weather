import React from "react";

function TemperatureToggle({ unit, onToggle }) {
	return (
		<div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
			<button
				onClick={() => onToggle('C')}
				className={`px-3 py-1 rounded-md text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
					unit === 'C'
						? 'bg-blue-600 text-white'
						: 'text-gray-600 hover:bg-gray-100'
				}`}
				aria-label="Temperature in Celsius"
				aria-pressed={unit === 'C'}
			>
				°C
			</button>
			<button
				onClick={() => onToggle('F')}
				className={`px-3 py-1 rounded-md text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
					unit === 'F'
						? 'bg-blue-600 text-white'
						: 'text-gray-600 hover:bg-gray-100'
				}`}
				aria-label="Temperature in Fahrenheit"
				aria-pressed={unit === 'F'}
			>
				°F
			</button>
		</div>
	);
}

export default TemperatureToggle;
