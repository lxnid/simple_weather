function ForecastCard({ dayName, date, icon, condition, highTemp, lowTemp }) {
	return (
		<div className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-[1.02] border border-transparent hover:border-gray-200">
			<div className="flex items-center gap-4">
				<div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300">
					<img src={icon} alt={condition} className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
				</div>
				<div>
					<p className="text-gray-800 font-medium group-hover:text-slate-700 transition-colors duration-200">{dayName}</p>
					<p className="text-gray-500 text-sm group-hover:text-gray-600 transition-colors duration-200">{date}</p>
				</div>
			</div>
			<div className="text-right">
				<p className="text-gray-800 font-semibold group-hover:text-slate-700 transition-colors duration-200">{highTemp}° / {lowTemp}°</p>
				<p className="text-gray-500 text-sm capitalize group-hover:text-gray-600 transition-colors duration-200">{condition}</p>
			</div>
		</div>
	);
}

function ForecastPanel({ weatherData }) {
	if (!weatherData.forecast || !weatherData.forecast.forecastday) {
		return null;
	}

	const forecastDays = weatherData.forecast.forecastday;

	return (
		<div className="w-full bg-white rounded-3xl shadow-sm p-6 animate-fade-in hover:shadow-lg transition-shadow duration-300">
			<h2 className="text-gray-800 text-lg font-semibold mb-4">3-Day Forecast</h2>
			<div className="space-y-2">
				{forecastDays.map((dayData) => {
					const date = new Date(dayData.date);
					const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
					const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

					return (
						<ForecastCard
							key={dayData.date}
							dayName={dayName}
							date={dateStr}
							icon={dayData.day.condition.icon}
							condition={dayData.day.condition.text}
							highTemp={Math.round(dayData.day.maxtemp_c)}
							lowTemp={Math.round(dayData.day.mintemp_c)}
						/>
					);
				})}
			</div>
		</div>
	);
}

export default ForecastPanel;
