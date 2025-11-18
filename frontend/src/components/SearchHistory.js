import React from "react";
import { FaHistory, FaTimes } from "react-icons/fa";

function SearchHistory({ history, onSelect, onClear, onRemove }) {
	if (!history || history.length === 0) {
		return null;
	}

	return (
		<div className="mt-3 bg-white rounded-lg p-3 shadow-sm animate-fade-in">
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-2 text-gray-600">
					<FaHistory className="w-3 h-3" />
					<span className="text-xs font-semibold">Recent Searches</span>
				</div>
				<button
					onClick={onClear}
					className="text-xs text-red-600 hover:text-red-700 transition-colors focus:outline-none focus:underline"
					aria-label="Clear search history"
				>
					Clear All
				</button>
			</div>
			<div className="flex flex-wrap gap-2">
				{history.map((item, index) => (
					<div
						key={index}
						className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded-md px-2 py-1 text-xs text-gray-700 transition-colors animate-slide-left"
						style={{ animationDelay: `${index * 30}ms` }}
					>
						<button
							onClick={() => onSelect(item)}
							className="focus:outline-none focus:underline"
							aria-label={`Search for ${item}`}
						>
							{item}
						</button>
						<button
							onClick={() => onRemove(item)}
							className="text-gray-500 hover:text-red-600 transition-colors focus:outline-none"
							aria-label={`Remove ${item} from history`}
						>
							<FaTimes className="w-2 h-2" />
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default SearchHistory;
