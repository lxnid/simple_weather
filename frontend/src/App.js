import React, { useEffect, useState, useRef } from "react";
import getCurrentLocation from "./current";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorDisplay from "./components/ErrorDisplay";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import MetricsPanel from "./components/MetricsPanel";
import TemperatureToggle from "./components/TemperatureToggle";
import LocationButton from "./components/LocationButton";
import SearchHistory from "./components/SearchHistory";
import ForecastCard from "./components/ForecastCard";
import { getSearchHistory, addToSearchHistory, clearSearchHistory, removeFromSearchHistory } from "./utils/storage";

// Use environment variable or fallback to production URL
const API_URL = process.env.REACT_APP_API_URL || "https://simple-weather-868c.onrender.com/api";

function App() {
	const [weatherData, setWeatherData] = useState(null);
	const [forecastData, setForecastData] = useState(null);
	const [error, setError] = useState(null);
	const [location, setLocation] = useState("");
	const [loading, setLoading] = useState(false);
	const [temperatureUnit, setTemperatureUnit] = useState('C');
	const [searchHistory, setSearchHistory] = useState([]);

	// Ref to store the current AbortController
	const abortControllerRef = useRef(null);

	useEffect(() => {
		// Load search history from localStorage
		setSearchHistory(getSearchHistory());

		// Fetch initial weather data with the user's current location
		async function fetchInitialWeather() {
			setLoading(true);
			try {
				const currentLocation = await getCurrentLocation();
				await fetchWeatherData(currentLocation);
				await fetchForecastData(currentLocation);
			} catch (error) {
				console.error("Error retrieving current location:", error);
				// Fallback to a default location if geolocation fails
				await fetchWeatherData("paris");
				await fetchForecastData("paris");
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

	const fetchForecastData = async (location) => {
		const url = `${API_URL}/fetch_forecast_data?location=${encodeURIComponent(location)}&days=5`;

		try {
			const response = await fetch(url, {
				method: "GET"
			});

			if (!response.ok) {
				console.error("Failed to fetch forecast data");
				return;
			}

			const data = await response.json();
			setForecastData(data);
		} catch (err) {
			console.error("Error fetching forecast:", err);
			// Don't show error for forecast - it's optional
		}
	};

	const handleLocationSubmit = async (e) => {
		e.preventDefault();

		// Validate input is not empty
		if (!location.trim()) {
			setError("Please enter a location");
			return;
		}

		// Add to search history
		addToSearchHistory(location);
		setSearchHistory(getSearchHistory());

		await fetchWeatherData(location);
		await fetchForecastData(location);
		setLocation("");
	};

	const handleHistorySelect = async (query) => {
		await fetchWeatherData(query);
		await fetchForecastData(query);
	};

	const handleHistoryClear = () => {
		clearSearchHistory();
		setSearchHistory([]);
	};

	const handleHistoryRemove = (query) => {
		removeFromSearchHistory(query);
		setSearchHistory(getSearchHistory());
	};

	const handleUseMyLocation = async () => {
		setLoading(true);
		try {
			const currentLocation = await getCurrentLocation();
			await fetchWeatherData(currentLocation);
			await fetchForecastData(currentLocation);
		} catch (error) {
			setError("Unable to get your location. Please check your browser permissions.");
		} finally {
			setLoading(false);
		}
	};

	const handleRetryDefault = async () => {
		await fetchWeatherData("paris");
		await fetchForecastData("paris");
	};

	const handleTemperatureToggle = (unit) => {
		setTemperatureUnit(unit);
	};

	const today = new Date();
	const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
	const formattedDate = today.toLocaleDateString("en-UK", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return (
		<div className="w-full min-h-screen flex justify-center items-center py-8">
			<div className="w-[75%] flex flex-col justify-center items-start gap-6">
				{loading && !weatherData ? (
					<LoadingSpinner />
				) : error && !weatherData ? (
					<ErrorDisplay error={error} onRetry={handleRetryDefault} />
				) : weatherData ? (
					<>
						{/* Weather Card Section */}
						<div className="w-full flex flex-col gap-4">
							<div className="flex items-center justify-between">
								<LocationButton onClick={handleUseMyLocation} loading={loading} />
								<TemperatureToggle unit={temperatureUnit} onToggle={handleTemperatureToggle} />
							</div>
							<WeatherCard
								weatherData={weatherData}
								dayName={dayName}
								formattedDate={formattedDate}
								unit={temperatureUnit}
							/>
						</div>

						{/* Details Panel */}
						<div className="w-full bg-neutral-200 rounded-3xl flex flex-col gap-6 p-8 lg:p-10 animate-fade-in">
							{/* Search Section */}
							<div className="w-full">
								<SearchBar
									location={location}
									onChange={handleLocationChange}
									onSubmit={handleLocationSubmit}
									error={error}
									loading={loading}
								/>
								<SearchHistory
									history={searchHistory}
									onSelect={handleHistorySelect}
									onClear={handleHistoryClear}
									onRemove={handleHistoryRemove}
								/>
							</div>

							{/* Metrics Panel */}
							<MetricsPanel weatherData={weatherData} unit={temperatureUnit} />

							{/* Forecast Section */}
							{forecastData && (
								<ForecastCard forecastData={forecastData} unit={temperatureUnit} />
							)}
						</div>
					</>
				) : null}
			</div>
		</div>
	);
}

export default App;
