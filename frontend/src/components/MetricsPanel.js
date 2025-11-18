import React from "react";
import { FaDroplet, FaCloudRain, FaWind, FaGauge, FaSun, FaEye } from "react-icons/fa6";

function MetricCard({ label, value, icon: Icon }) {
	return (
		<div className="flex flex-col gap-2 p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-300 group cursor-pointer">
			<div className="flex items-center gap-2">
				<div className="p-2 bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg text-white group-hover:scale-110 transition-transform">
					<Icon className="w-5 h-5" />
				</div>
				<p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{label}</p>
			</div>
			<p className="text-2xl font-bold text-gray-800 ml-10">{value}</p>
		</div>
	);
}

function MetricsPanel({ weatherData }) {
	const metrics = [
		{ label: "Humidity", value: `${weatherData.current.humidity}%`, icon: FaDroplet },
		{ label: "Precipitation", value: `${weatherData.current.precip_mm} mm`, icon: FaCloudRain },
		{ label: "Wind Speed", value: `${weatherData.current.wind_kph} km/h`, icon: FaWind },
		{ label: "Pressure", value: `${weatherData.current.pressure_mb} hPa`, icon: FaGauge },
		{ label: "UV Index", value: weatherData.current.uv, icon: FaSun },
		{ label: "Visibility", value: `${weatherData.current.vis_km} km`, icon: FaEye },
	];

	return (
		<div className="w-full animate-fade-in">
			<h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-6">
				Weather Details
			</h2>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
				{metrics.map((metric, index) => (
					<div
						key={metric.label}
						className="animate-slide-left"
						style={{ animationDelay: `${index * 50}ms` }}
					>
						<MetricCard label={metric.label} value={metric.value} icon={metric.icon} />
					</div>
				))}
			</div>
		</div>
	);
}

export default MetricsPanel;
