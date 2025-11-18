import React from "react";

function ErrorDisplay({ error, onRetry }) {
	return (
		<div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md animate-fade-in">
			<h2 className="text-red-800 font-bold text-lg mb-2">Error</h2>
			<p className="text-red-600">{error}</p>
			{onRetry && (
				<button
					onClick={onRetry}
					className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
				>
					Try Default Location
				</button>
			)}
		</div>
	);
}

export default ErrorDisplay;
