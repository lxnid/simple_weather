import React from "react";

function LoadingSpinner({ message = "Loading weather data..." }) {
	return (
		<div className="flex flex-col items-center gap-4 animate-fade-in">
			<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-600"></div>
			<p className="text-gray-600 font-medium">{message}</p>
		</div>
	);
}

export default LoadingSpinner;
