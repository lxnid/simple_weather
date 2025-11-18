import { FaSearch } from "react-icons/fa";

function SearchBar({ location, onChange, onSubmit, error, loading }) {
	return (
		<div className="w-full group">
			<form onSubmit={onSubmit} className="relative">
				<div className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-focus-within:text-slate-600">
					<FaSearch className="w-4 h-4 text-gray-400 group-focus-within:text-slate-600 group-focus-within:scale-110 transition-all duration-300" />
				</div>
				<input
					type="text"
					placeholder="Search location here"
					value={location}
					onChange={onChange}
					aria-label="Search for a location"
					className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all duration-300 shadow-sm hover:shadow-md hover:border-gray-300"
				/>
			</form>
			{error && (
				<div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg animate-fade-in hover:bg-red-100 transition-colors">
					{error}
				</div>
			)}
			{loading && (
				<div className="mt-2 p-2 bg-slate-50 text-slate-700 text-xs rounded-lg animate-fade-in flex items-center gap-2">
					<span className="inline-block w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse"></span>
					Loading...
				</div>
			)}
		</div>
	);
}

export default SearchBar;
