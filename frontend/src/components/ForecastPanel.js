import React from "react";

function ForecastCard({ day }) {
	return (
		<div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow animate-fade-in">
			<p className="font-semibold text-neutral-700">{day.date}</p>
			<p className="text-sm text-neutral-600 mb-2">{day.day}</p>
			<img
				src={day.condition.icon}
				alt={day.condition.text}
				className="w-16 h-16 mx-auto"
			/>
			<p className="text-xs text-center text-neutral-600">{day.condition.text}</p>
			<div className="flex justify-between gap-2 mt-2 text-sm">
				<div className="text-center flex-1">
					<p className="text-xs text-neutral-500">High</p>
					<p className="font-semibold">{day.maxtemp_c}°</p>
				</div>
				<div className="text-center flex-1">
					<p className="text-xs text-neutral-500">Low</p>
					<p className="font-semibold">{day.mintemp_c}°</p>
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
	console.log(`Forecast days available: ${forecastDays.length}`, forecastDays);

	return (
		<div className="w-full">
			<h2 className="text-xl font-bold text-neutral-700 mb-4 animate-slide-down">
				5-Day Forecast
			</h2>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full">
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
