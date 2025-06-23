import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { TiWeatherDownpour } from "react-icons/ti";
import getCurrentLocation from "./current"

// const API_URL = "http://127.0.0.1:8000/api"; 
const API_URL = "https://simple-weather-868c.onrender.com/api"; 

function App() {
	const [weatherData, setWeatherData] = useState(null);
	const [error, setError] = useState(null);
	const [location, setLocation] = useState("");

// 	const [imageUrl, setImageUrl] = useState('');
//   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchRandomImage = async () => {
// //       try {
// //         const response = await fetch(`https://api.unsplash.com/photos/random?query=${keyword}&client_id=<YOUR_ACCESS_KEY>`);
        
// //         if (!response.ok) {
// //           throw new Error('Network response was not ok');
// //         }

// //         const data = await response.json();
// //         setImageUrl(data.urls.regular); // Use 'regular' size image
// //       } catch (error) {
// //         setError(error.message);
// //       }
// //     };

// //     fetchRandomImage();
// //   }, [keyword]);

	useEffect(() => {
		// Fetch initial weather data with the user's current location
		async function fetchInitialWeather() {
			try {
				const currentLocation = await getCurrentLocation();
				setLocation(currentLocation); // Set the location state
				fetchWeatherData(currentLocation); // Fetch weather data using current location
				setLocation("")
			} catch (error) {
				console.error("Error retrieving current location:", error);
				// Fallback to a default location if geolocation fails
				fetchWeatherData("Colombo");
			}
		}
		fetchInitialWeather();
	}, []);

	const fetchWeatherData = async (location) => {
		const url = `${API_URL}/fetch_weather_data?location=${encodeURIComponent(location)}`;
		try {
			const response = await fetch(url, {
				method: "GET"
			});
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Network response was not ok: ${errorText}`);
			}
			const data = await response.json();
			setWeatherData(data);
			setError(null);
			console.log(data);
		} catch (err) {
			setError(
				err.message ||
					"Failed to fetch data. Check the location or network."
			);
			console.error("Error fetching data:", err);
		}
	};

	const handleLocationChange = (e) => {
		setLocation(e.target.value);
	};

	const handleLocationSubmit = (e) => {
		e.preventDefault();
		fetchWeatherData(location);
		setLocation("")
	};

	const today = new Date();
	const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
	const formattedDate = today.toLocaleDateString("en-UK", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return (
		<div className="w-full h-screen flex justify-center items-center">
			<div className="lg:w-[70%] w-[90%] h-[80vh] flex flex-col lg:flex-row justify-center items-center">
				{/* {error && <div className="text-red-500">Error: {error}</div>} */}

				{weatherData ? (
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
									{/* <TiWeatherDownpour className="text-9xl" /> */}
									<img src={weatherData.current.condition.icon} className="w-auto"/>
									<div className="flex flex-col gap-2">
										<h1 className="text-5xl font-black tracking-wider">
											{weatherData.current.temp_c}
											°C
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
										className="p-2 border border-gray-300 font-medium text-sm opacity-35 focus:opacity-100 focus:scale-105 rounded-md w-full transition-transform ease-in-out duration-500"
									/>
								</form>
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
										{weatherData.current.precip_mm}%
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
									<p className="flex-grow">UV</p>
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
				) : (
					<div className="text-xs"></div>
				)}
			</div>
		</div>
	);
}

export default App;
