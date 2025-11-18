import React from "react";
import { FaSearch } from "react-icons/fa";

function SearchBar({ location, onChange, onSubmit, error, loading }) {
	return (
		<div className="w-full">
			<form onSubmit={onSubmit} className="relative">
				<input
					type="text"
					placeholder="Search for a city..."
					value={location}
					onChange={onChange}
					aria-label="Search for a location"
					className="p-3 pr-12 border border-gray-300 bg-neutral-100 font-medium text-sm placeholder-gray-400 focus:outline-none focus:ring-neutral-500 rounded-lg w-full"
				/>
				<button
					type="submit"
					aria-label="Search"
					className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-500 p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={loading}
				>
					<FaSearch className="w-4 h-4" />
				</button>
			</form>
			{error && (
				<div className="mt-2 text-red-600 text-sm font-medium animate-fade-in">
					{error}
				</div>
			)}
			{loading && (
				<div className="mt-2 text-neutral-600 text-sm font-medium animate-fade-in">
					Loading...
				</div>
			)}
		</div>
	);
}

export default SearchBar;
