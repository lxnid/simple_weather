import { WiStrongWind, WiRaindrop, WiBarometer, WiDaySunny } from "react-icons/wi";

function MetricCard({ icon: Icon, label, value, subtitle, trend }) {
	return (
		<div className="group bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200">
			<div className="flex items-center gap-3 mb-4">
				<div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300">
					<Icon className="w-7 h-7 text-gray-600 group-hover:text-slate-700 transition-colors duration-300" />
				</div>
				<span className="text-gray-600 text-sm font-medium group-hover:text-gray-800 transition-colors duration-200">{label}</span>
			</div>
			<div className="mb-2">
				<p className="text-gray-900 text-3xl font-semibold group-hover:text-slate-700 transition-colors duration-300">{value}</p>
			</div>
			{subtitle && (
				<p className="text-gray-500 text-xs flex items-center gap-1 group-hover:text-gray-600 transition-colors duration-200">
					{trend && <span className={`${trend > 0 ? "text-green-500" : "text-red-500"} group-hover:scale-125 transition-transform duration-300`}>
						{trend > 0 ? "↑" : "↓"}
					</span>}
					{subtitle}
				</p>
			)}
		</div>
	);
}

function MetricsPanel({ weatherData }) {
	const metrics = [
		{
			icon: WiStrongWind,
			label: "Wind Speed",
			value: `${weatherData.current.wind_kph} km/h`,
			subtitle: `${Math.round(weatherData.current.wind_kph * 0.1)} km/h`,
			trend: 2
		},
		{
			icon: WiRaindrop,
			label: "Humidity",
			value: `${weatherData.current.humidity}%`,
			subtitle: "5%",
			trend: 5
		},
		{
			icon: WiBarometer,
			label: "Pressure",
			value: `${weatherData.current.pressure_mb} hpa`,
			subtitle: "32 hpa",
			trend: 32
		},
		{
			icon: WiDaySunny,
			label: "UV Index",
			value: `${weatherData.current.uv}`,
			subtitle: "High"
		}
	];

	return (
		<div className="w-full animate-fade-in">
			<h2 className="text-gray-800 text-lg font-semibold mb-4">Today Overview</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{metrics.map((metric) => (
					<MetricCard
						key={metric.label}
						icon={metric.icon}
						label={metric.label}
						value={metric.value}
						subtitle={metric.subtitle}
						trend={metric.trend}
					/>
				))}
			</div>
		</div>
	);
}

export default MetricsPanel;
