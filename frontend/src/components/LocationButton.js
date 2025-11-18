import React from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";

function LocationButton({ onClick, loading }) {
	return (
		<button
			onClick={onClick}
			disabled={loading}
			className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
			aria-label="Use my current location"
		>
			<FaLocationCrosshairs className="w-4 h-4" />
			<span className="text-sm">Use My Location</span>
		</button>
	);
}

export default LocationButton;
