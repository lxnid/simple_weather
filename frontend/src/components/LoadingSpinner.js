import React from "react";

function LoadingSpinner({ message = "Loading weather data..." }) {
	return (
		<div className="flex flex-col items-center justify-center gap-6 py-12 animate-fade-in">
			<div className="relative w-20 h-20">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-spin opacity-75"></div>
				<div className="absolute inset-2 bg-white rounded-full"></div>
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
				</div>
			</div>
			<div className="flex flex-col items-center gap-2">
				<p className="text-gray-700 font-semibold text-lg">{message}</p>
				<p className="text-sm text-gray-500">Please wait while we fetch the latest weather...</p>
			</div>
		</div>
	);
}

export default LoadingSpinner;
