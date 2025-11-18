import React from "react";
import { FaLocationDot } from "react-icons/fa6";

function WeatherCard({ weatherData, dayName, formattedDate }) {
	return (
		<div className='w-full relative h-96 hover:scale-[101%] cursor-pointer transition-transform ease-in-out duration-700 flex justify-center items-center overflow-hidden rounded-3xl bg-[url("https://images.unsplash.com/photo-1457327289196-f38b88d97147?q=80&w=1772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")] bg-cover bg-center animate-fade-in'>
			<div className="relative bg-black bg-opacity-30 backdrop-blur-sm w-full h-full"></div>
			<div className="absolute text-white w-full h-full flex flex-col justify-between items-start p-8 animate-fade-in">
				<div className="flex flex-col gap-1">
					<h1 className="text-4xl font-bold animate-slide-down">
						{dayName}
					</h1>
					<p className="text-sm font-regular animate-slide-down animation-delay-100">
						{formattedDate}
					</p>
					<div className="text-base font-semibold animate-slide-down animation-delay-200">
						<FaLocationDot className="inline mr-2" />
						<span>
							{weatherData.location.name},{" "}
							{weatherData.location.country}
						</span>
					</div>
				</div>
				<div className="flex flex-row gap-6 items-center justify-between w-full">
					<img
						src={weatherData.current.condition.icon}
						alt={weatherData.current.condition.text}
						className="w-20 h-20 animate-bounce-slow"
					/>
					<div className="flex flex-col gap-2 text-right">
						<h1 className="text-5xl font-black tracking-wider animate-slide-up">
							{weatherData.current.temp_c}°C
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
