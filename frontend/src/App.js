import React, { useEffect, useState, useRef } from "react";
import getCurrentLocation from "./current";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorDisplay from "./components/ErrorDisplay";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import MetricsPanel from "./components/MetricsPanel";
import ForecastPanel from "./components/ForecastPanel";

// Use environment variable or fallback to production URL
const API_URL = process.env.REACT_APP_API_URL || "https://simple-weather-868c.onrender.com/api";

function App() {
	const [weatherData, setWeatherData] = useState(null);
	const [error, setError] = useState(null);
	const [location, setLocation] = useState("");
	const [loading, setLoading] = useState(false);

	// Ref to store the current AbortController
	const abortControllerRef = useRef(null);

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

		// Cleanup function to abort any pending requests
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	const fetchWeatherData = async (location) => {
		// Abort any pending request
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		// Create new AbortController for this request
		abortControllerRef.current = new AbortController();

		const url = `${API_URL}/fetch_weather_data?location=${encodeURIComponent(location)}`;
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(url, {
				method: "GET",
				signal: abortControllerRef.current.signal
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.detail || "Failed to fetch weather data");
			}

			const data = await response.json();
			setWeatherData(data);
		} catch (err) {
			// Don't show error if request was aborted (user started new search)
			if (err.name === 'AbortError') {
				return;
			}

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

	const handleRetryDefault = () => {
		fetchWeatherData("paris");
	};

	const today = new Date();
	const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
	const formattedDate = today.toLocaleDateString("en-UK", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return (
		<div className="w-full min-h-screen bg-gray-50 py-8 px-4 md:px-8">
			<div className="max-w-[90vw] mx-auto animate-fade-in">
				{loading && !weatherData ? (
					<LoadingSpinner />
				) : error && !weatherData ? (
					<ErrorDisplay error={error} onRetry={handleRetryDefault} />
				) : weatherData ? (
					<>
						{/* Header */}
						<div className="mb-8 flex justify-between items-start">
							<div>
								<h1 className="text-2xl font-semibold text-gray-800 mb-1">Weather Dashboard</h1>
								<p className="text-gray-500 text-sm">{dayName}, {formattedDate}</p>
							</div>
							<div className="w-full max-w-md">
								<SearchBar
									location={location}
									onChange={handleLocationChange}
									onSubmit={handleLocationSubmit}
									error={error}
									loading={loading}
								/>
							</div>
						</div>

						{/* Main Layout */}
						<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
							{/* Left Column - Main weather + Metrics */}
							<div className="lg:col-span-3 space-y-6">
								<WeatherCard
									weatherData={weatherData}
									dayName={dayName}
									formattedDate={formattedDate}
								/>
								<MetricsPanel weatherData={weatherData} />
							</div>

							{/* Right Column - Forecast */}
							<div className="lg:col-span-1">
								<ForecastPanel weatherData={weatherData} />
							</div>
						</div>
					</>
				) : null}
			</div>
		</div>
	);
}

export default App;
