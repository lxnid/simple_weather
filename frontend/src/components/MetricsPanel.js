import React from "react";

function MetricRow({ label, value }) {
	return (
		<div className="flex flex-row hover:bg-neutral-200 p-2 rounded-md transition-colors">
			<p className="flex-grow">{label}</p>
			<p className="font-normal">{value}</p>
		</div>
	);
}

function MetricsPanel({ weatherData, unit }) {
	// Convert wind speed and visibility for imperial units
	const windValue = unit === 'F'
		? `${Math.round(weatherData.current.wind_mph)} mph`
		: `${Math.round(weatherData.current.wind_kph)} km/h`;

	const visibilityValue = unit === 'F'
		? `${Math.round(weatherData.current.vis_miles)} mi`
		: `${Math.round(weatherData.current.vis_km)} km`;

	const precipValue = unit === 'F'
		? `${weatherData.current.precip_in} in`
		: `${weatherData.current.precip_mm} mm`;

	const metrics = [
		{ label: "Humidity", value: `${weatherData.current.humidity}%` },
		{ label: "Precipitation", value: precipValue },
		{ label: "Wind", value: windValue },
		{ label: "Pressure", value: `${Math.round(weatherData.current.pressure_mb)} hPa` },
		{ label: "UV Index", value: weatherData.current.uv },
		{ label: "Visibility", value: visibilityValue },
	];

	return (
		<div className="flex flex-col gap-2 w-full text-xl text-neutral-500 font-semibold animate-fade-in">
			{metrics.map((metric, index) => (
				<div
					key={metric.label}
					className="animate-slide-left"
					style={{ animationDelay: `${index * 50}ms` }}
				>
					<MetricRow label={metric.label} value={metric.value} />
				</div>
			))}
		</div>
	);
}

export default MetricsPanel;
