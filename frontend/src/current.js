const currentLocation = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const latitude = position.coords.latitude;
				const longitude = position.coords.longitude;
                
			},
			(error) => {
				console.error("Error getting location:", error);
			}
		);
	} else {
		console.error("Geolocation is not supported by this browser.");
	}
};
