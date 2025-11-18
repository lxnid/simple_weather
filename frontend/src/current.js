export default function getCurrentLocation() {
	return new Promise((resolve, reject) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const latitude = position.coords.latitude;
					const longitude = position.coords.longitude;
					resolve(`${latitude}%:%${longitude}`);
				},
				(error) => {
					console.error("Error getting location:", error);
					reject("Unable to retrieve location");
				},
				{
					timeout: 10000, // 10 second timeout
					enableHighAccuracy: false,
					maximumAge: 300000 // Cache position for 5 minutes
				}
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
			reject("Geolocation not supported");
		}
	});
}
