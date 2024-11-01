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
				}
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
			reject("Geolocation not supported");
		}
	});
};