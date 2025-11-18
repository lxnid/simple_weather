import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { getTemperature, formatTemperature } from "../utils/temperature";

function WeatherCard({ weatherData, dayName, formattedDate, unit }) {
	const temperature = getTemperature(weatherData.current.temp_c, unit);
	return (
		<div className='w-[80%] lg:w-[50%] relative h-full hover:scale-[102%] cursor-pointer transition-transform ease-in-out duration-700 flex justify-center items-center overflow-hidden rounded-3xl bg-[url("https://images.unsplash.com/photo-1546702830-d64bd442b73f?ixid=M3w2Njk3MzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MzAxMzA3NDR8&ixlib=rb-4.0.3")] bg-cover bg-center animate-fade-in'>
			<div className="relative bg-black bg-opacity-30 backdrop-blur-sm w-full h-full"></div>
			<div className="absolute text-white w-full h-full flex lg:flex-col justify-center items-start p-14 pt-20">
				<div className="flex flex-col gap-1 flex-grow">
					<h1 className="text-5xl font-bold animate-slide-down">
						{dayName}
					</h1>
					<p className="text-sm font-regular animate-slide-down animation-delay-100">
						{formattedDate}
					</p>
					<div className="text-base font-semibold animate-slide-down animation-delay-200">
						<FaLocationDot className="inline" />
						<span>
							{" "}
							{weatherData.location.name},{" "}
							{weatherData.location.country}
						</span>
					</div>
				</div>
				<div className="flex flex-col gap-10">
					<img
						src={weatherData.current.condition.icon}
						alt={weatherData.current.condition.text}
						className="w-24 h-24 animate-bounce-slow"
					/>
					<div className="flex flex-col gap-2">
						<h1 className="text-5xl font-black tracking-wider animate-slide-up">
							{formatTemperature(temperature, unit)}
						</h1>
						<p className="text-base font-medium animate-slide-up animation-delay-100">
							{weatherData.current.condition.text}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default WeatherCard;
