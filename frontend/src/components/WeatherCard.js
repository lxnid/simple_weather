import { WiCloud } from "react-icons/wi";

function WeatherCard({ weatherData }) {
	const currentTime = new Date().toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	});

	// Calculate "feels like" - using actual temp + wind chill approximation
	const feelsLike = Math.round(weatherData.current.temp_c - (weatherData.current.wind_kph / 10));

	return (
		<div className='group w-full bg-gradient-to-br from-slate-600 to-slate-700 rounded-3xl shadow-md p-8 flex justify-between items-center animate-fade-in hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 cursor-pointer'>
			{/* Left Side - Location and Temperature */}
			<div className="flex items-center gap-6">
				<WiCloud className="w-24 h-24 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
				<div>
					<h2 className="text-white text-2xl font-medium mb-1 group-hover:text-white/95 transition-colors duration-300">{weatherData.location.name}, {weatherData.location.region}</h2>
					<p className="text-white/60 text-sm mb-4 group-hover:text-white/80 transition-colors duration-300">{weatherData.location.country}</p>
					<div className="flex items-baseline gap-2">
						<span className="text-white text-7xl font-light tracking-tight group-hover:scale-105 inline-block transition-transform duration-300">{Math.round(weatherData.current.temp_c)}°</span>
						<span className="text-white/80 text-xl group-hover:text-white/95 transition-colors duration-300">{weatherData.current.condition.text}</span>
					</div>
				</div>
			</div>

			{/* Right Side - Current Time and Feels Like */}
			<div className="text-right">
				<div className="mb-6 group-hover:translate-x-1 transition-transform duration-300">
					<p className="text-white/60 text-sm mb-1 group-hover:text-white/80 transition-colors duration-200">Current Time</p>
					<p className="text-white text-2xl font-medium group-hover:text-white/95 transition-colors duration-300">{currentTime}</p>
				</div>
				<div className="group-hover:translate-x-1 transition-transform duration-300">
					<p className="text-white/60 text-sm mb-1 group-hover:text-white/80 transition-colors duration-200">Feels like</p>
					<p className="text-white text-4xl font-light group-hover:text-white/95 group-hover:scale-110 inline-block transition-all duration-300">{feelsLike}°</p>
				</div>
			</div>
		</div>
	);
}

export default WeatherCard;
