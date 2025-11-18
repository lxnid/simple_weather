import React from "react";

function ForecastCard({ day }) {
	return (
		<div className="flex flex-col gap-3 p-5 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-blue-100 animate-fade-in group">
			<div className="text-center">
				<p className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">{day.date}</p>
				<p className="text-xs text-gray-500 mt-1">{day.day}</p>
			</div>

			<div className="flex justify-center py-2">
				<img
					src={day.condition.icon}
					alt={day.condition.text}
					className="w-20 h-20 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
				/>
			</div>

			<p className="text-xs text-center text-gray-600 font-medium min-h-8 leading-tight">{day.condition.text}</p>

			<div className="flex justify-center gap-6 mt-2 pt-3 border-t border-blue-100">
				<div className="text-center">
					<p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">High</p>
					<p className="font-bold text-lg text-blue-600 mt-1">{day.maxtemp_c}°</p>
				</div>
				<div className="w-px bg-blue-200"></div>
				<div className="text-center">
					<p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Low</p>
					<p className="font-bold text-lg text-blue-400 mt-1">{day.mintemp_c}°</p>
				</div>
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
		<div className="w-full">
			<h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-6 animate-slide-down">
				3-Day Outlook
			</h2>
			<div className="grid grid-cols-3 gap-4 w-full">
				{forecastDays.map((dayData, index) => {
					const date = new Date(dayData.date);
					const dayName = date.toLocaleDateString("en-US", {
						weekday: "short",
					});

					return (
						<div
							key={dayData.date}
							className="animate-slide-left"
							style={{ animationDelay: `${index * 50}ms` }}
						>
							<ForecastCard
								day={{
									date: dayName,
									day: dayData.date,
									condition: dayData.day.condition,
									maxtemp_c: Math.round(dayData.day.maxtemp_c),
									mintemp_c: Math.round(dayData.day.mintemp_c),
								}}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default ForecastPanel;
