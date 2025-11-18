import React from "react";
import { FaLocationDot } from "react-icons/fa6";

function WeatherCard({ weatherData, dayName, formattedDate }) {
	return (
		<div className='w-full relative h-96 hover:shadow-2xl cursor-pointer transition-all ease-in-out duration-700 flex justify-center items-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 shadow-xl animate-fade-in group'>
			{/* Background Image with Overlay */}
			<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1457327289196-f38b88d97147?q=80&w=1772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

			{/* Dark Overlay with Blur */}
			<div className="relative bg-gradient-to-br from-blue-600/40 via-purple-600/40 to-blue-800/60 backdrop-blur-sm w-full h-full"></div>

			{/* Content */}
			<div className="absolute text-white w-full h-full flex flex-col justify-between items-start p-8 animate-fade-in">
				{/* Top Section - Date & Location */}
				<div className="flex flex-col gap-2">
					<div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-2">
						<p className="text-xs font-semibold uppercase tracking-widest">
							{dayName}
						</p>
					</div>
					<h1 className="text-5xl font-black tracking-tight animate-slide-down drop-shadow-lg">
						{weatherData.location.name}
					</h1>
					<p className="text-blue-100 text-sm font-medium animate-slide-down animation-delay-100">
						{formattedDate}
					</p>
					<div className="text-sm font-semibold flex items-center gap-1 animate-slide-down animation-delay-200 text-blue-50">
						<FaLocationDot className="w-4 h-4" />
						<span>{weatherData.location.country}</span>
					</div>
				</div>

				{/* Bottom Section - Temperature & Condition */}
				<div className="flex flex-row gap-8 items-end justify-between w-full">
					<div className="flex flex-col gap-3">
						<img
							src={weatherData.current.condition.icon}
							alt={weatherData.current.condition.text}
							className="w-24 h-24 animate-bounce-slow drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
						/>
						<p className="text-sm font-medium text-blue-100 max-w-xs">
							{weatherData.current.condition.text}
						</p>
					</div>
					<div className="flex flex-col gap-2 text-right">
						<span className="text-7xl font-black tracking-tighter drop-shadow-lg animate-slide-up">
							{Math.round(weatherData.current.temp_c)}°
						</span>
						<p className="text-xs font-semibold text-blue-100 uppercase tracking-wider animate-slide-up animation-delay-100">
							Celsius
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default WeatherCard;
