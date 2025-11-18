import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import getCurrentLocation from "./current";

const API_URL = "https://simple-weather-868c.onrender.com/api";

function App() {
	const [weatherData, setWeatherData] = useState(null);
	const [error, setError] = useState(null);
	const [location, setLocation] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Fetch initial weather data with the user's current location
		async function fetchInitialWeather() {
			setLoading(true);
			try {
				const currentLocation = await getCurrentLocation();
				await fetchWeatherData(currentLocation);
			} catch (error) {
				console.error("Error retrieving current location:", error);
				// Fallback to a default location if geolocation fails
				await fetchWeatherData("paris");
			} finally {
				setLoading(false);
			}
		}
		fetchInitialWeather();
	}, []);

	const fetchWeatherData = async (location) => {
		const url = `${API_URL}/fetch_weather_data?location=${encodeURIComponent(location)}`;
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(url, {
				method: "GET"
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.detail || "Failed to fetch weather data");
			}

			const data = await response.json();
			setWeatherData(data);
		} catch (err) {
			setError(
				err.message || "Failed to fetch data. Check the location or network."
			);
			console.error("Error fetching data:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleLocationChange = (e) => {
		setLocation(e.target.value);
	};

	const handleLocationSubmit = (e) => {
		e.preventDefault();

		// Validate input is not empty
		if (!location.trim()) {
			setError("Please enter a location");
			return;
		}

		fetchWeatherData(location);
		setLocation("");
	};

	const today = new Date();
	const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
	const formattedDate = today.toLocaleDateString("en-UK", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return (
		<div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100">
			<div className="lg:w-[70%] w-[90%] h-[80vh] flex flex-col lg:flex-row justify-center items-center">
				{loading && !weatherData ? (
					<div className="flex flex-col items-center gap-4">
						<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
						<p className="text-gray-600 font-medium">Loading weather data...</p>
					</div>
				) : error && !weatherData ? (
					<div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
						<h2 className="text-red-800 font-bold text-lg mb-2">Error</h2>
						<p className="text-red-600">{error}</p>
						<button
							onClick={() => fetchWeatherData("paris")}
							className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
						>
							Try Default Location
						</button>
					</div>
				) : weatherData ? (
					<>
						<div className='w-[80%] lg:w-[50%] relative h-full hover:scale-[102%] cursor-pointer transition-transform ease-in-out duration-700 flex justify-center items-center overflow-hidden rounded-3xl bg-[url("https://images.unsplash.com/photo-1546702830-d64bd442b73f?ixid=M3w2Njk3MzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MzAxMzA3NDR8&ixlib=rb-4.0.3")] bg-cover bg-center'>
							<div className="relative bg-black bg-opacity-30 backdrop-blur-sm w-full h-full"></div>
							<div className="absolute text-white w-full h-full flex lg:flex-col justify-center items-start p-14 pt-20">
								<div className="flex flex-col gap-1 flex-grow">
									<h1 className="text-5xl font-bold">
										{dayName}
									</h1>
									<p className="text-sm font-regular">
										{formattedDate}
									</p>
									<div className="text-base font-semibold">
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
										className="w-24 h-24"
									/>
									<div className="flex flex-col gap-2">
										<h1 className="text-5xl font-black tracking-wider">
											{weatherData.current.temp_c}°C
										</h1>
										<p className="text-base font-medium">
											{weatherData.current.condition.text}
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="w-[72%] lg:w-[50%] h-[50%] lg:h-[90%] bg-neutral-300 rounded-b-3xl lg:rounded-e-3xl flex flex-col gap-8 justify-center items-start p-14 py-20">
							<div className="w-full flex-grow">
								<form onSubmit={handleLocationSubmit}>
									<input
										type="text"
										placeholder="Change Location"
										value={location}
										onChange={handleLocationChange}
										aria-label="Search for a location"
										className="p-2 border border-gray-300 font-medium text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md w-full transition-all ease-in-out duration-300"
									/>
								</form>
								{error && (
									<div className="mt-2 text-red-600 text-sm font-medium">
										{error}
									</div>
								)}
								{loading && (
									<div className="mt-2 text-blue-600 text-sm font-medium">
										Loading...
									</div>
								)}
							</div>
							<div className="flex flex-col gap-2 w-full text-xl text-neutral-500 font-semibold">
								<div className="flex flex-row">
									<p className="flex-grow">Humidity</p>
									<p className="font-normal">
										{weatherData.current.humidity}%
									</p>
								</div>
								<div className="flex flex-row">
									<p className="flex-grow">Precipitation</p>
									<p className="font-normal">
										{weatherData.current.precip_mm} mm
									</p>
								</div>
								<div className="flex flex-row">
									<p className="flex-grow">Wind</p>
									<p className="font-normal">
										{weatherData.current.wind_kph} km/h
									</p>
								</div>
								<div className="flex flex-row">
									<p className="flex-grow">Pressure</p>
									<p className="font-normal">
										{weatherData.current.pressure_mb} hPa
									</p>
								</div>
								<div className="flex flex-row">
									<p className="flex-grow">UV Index</p>
									<p className="font-normal">
										{weatherData.current.uv}
									</p>
								</div>
								<div className="flex flex-row">
									<p className="flex-grow">Visibility</p>
									<p className="font-normal">
										{weatherData.current.vis_km} km
									</p>
								</div>
							</div>
						</div>
					</>
				) : null}
			</div>
		</div>
	);
}

export default App;
