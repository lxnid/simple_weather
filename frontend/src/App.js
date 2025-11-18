import React, { useEffect, useState, useRef } from "react";
import getCurrentLocation from "./current";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorDisplay from "./components/ErrorDisplay";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import MetricsPanel from "./components/MetricsPanel";

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
		<div className="w-full h-screen flex justify-center items-center bg-white">
			<div className="lg:w-[70%] w-[90%] lg:h-[80vh] h-[90vh] flex flex-col lg:flex-row justify-center items-center">
				{loading && !weatherData ? (
					<LoadingSpinner />
				) : error && !weatherData ? (
					<ErrorDisplay error={error} onRetry={handleRetryDefault} />
				) : weatherData ? (
					<>
						<WeatherCard
							weatherData={weatherData}
							dayName={dayName}
							formattedDate={formattedDate}
						/>
						<div className="w-[80%] lg:w-[50%] h-[60%] lg:h-[90%] bg-neutral-300 rounded-b-3xl lg:rounded-e-3xl flex flex-col gap-8 justify-center items-start p-8 lg:p-14 py-12 lg:py-20 animate-fade-in">
							<div className="w-full">
								<SearchBar
									location={location}
									onChange={handleLocationChange}
									onSubmit={handleLocationSubmit}
									error={error}
									loading={loading}
								/>
							</div>
							<MetricsPanel weatherData={weatherData} />
						</div>
					</>
				) : null}
			</div>
		</div>
	);
}

export default App;
