import React from "react";
import { FaSearch } from "react-icons/fa";

function SearchBar({ location, onChange, onSubmit, error, loading }) {
	return (
		<div className="w-full">
			<div className="mb-2">
				<label className="text-sm font-semibold text-gray-700 block mb-2">
					📍 Search Location
				</label>
			</div>
			<form onSubmit={onSubmit} className="relative">
				<input
					type="text"
					placeholder="Enter city name..."
					value={location}
					onChange={onChange}
					aria-label="Search for a location"
					className="p-4 pr-14 border-2 border-blue-200 bg-white font-medium text-base placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl w-full transition-all duration-200 shadow-sm"
				/>
				<button
					type="submit"
					aria-label="Search"
					className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
					disabled={loading}
				>
					<FaSearch className="w-5 h-5" />
				</button>
			</form>
			{error && (
				<div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-lg animate-fade-in flex items-center gap-2">
					⚠️ {error}
				</div>
			)}
			{loading && (
				<div className="mt-3 p-3 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium rounded-lg animate-fade-in flex items-center gap-2">
					<span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
					Loading weather data...
				</div>
			)}
		</div>
	);
}

export default SearchBar;
