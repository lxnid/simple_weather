import React from "react";
import { getTemperature, formatTemperature } from "../utils/temperature";

function ForecastDay({ day, unit }) {
	const date = new Date(day.date);
	const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
	const monthDay = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

	const maxTemp = getTemperature(day.day.maxtemp_c, unit);
	const minTemp = getTemperature(day.day.mintemp_c, unit);

	return (
		<div className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow min-w-[100px]">
			<span className="text-xs font-semibold text-gray-600">{dayName}</span>
			<span className="text-xs text-gray-500">{monthDay}</span>
			<img
				src={day.day.condition.icon}
				alt={day.day.condition.text}
				className="w-12 h-12"
			/>
			<div className="flex flex-col items-center">
				<span className="text-sm font-bold text-gray-800">
					{formatTemperature(maxTemp, unit)}
				</span>
				<span className="text-xs text-gray-500">
					{formatTemperature(minTemp, unit)}
				</span>
			</div>
			<span className="text-xs text-gray-600 text-center">
				{day.day.condition.text}
			</span>
		</div>
	);
}

function ForecastCard({ forecastData, unit }) {
	if (!forecastData || !forecastData.forecast || !forecastData.forecast.forecastday) {
		return null;
	}

	const days = forecastData.forecast.forecastday;

	return (
		<div className="w-full mt-4 animate-fade-in">
			<h3 className="text-lg font-bold text-gray-700 mb-3">5-Day Forecast</h3>
			<div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
				{days.map((day, index) => (
					<div
						key={day.date}
						className="animate-slide-up"
						style={{ animationDelay: `${index * 50}ms` }}
					>
						<ForecastDay day={day} unit={unit} />
					</div>
				))}
			</div>
		</div>
	);
}

export default ForecastCard;
