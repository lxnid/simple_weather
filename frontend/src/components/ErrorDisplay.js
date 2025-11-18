import React from "react";

function ErrorDisplay({ error, onRetry }) {
	return (
		<div className="flex flex-col items-center justify-center gap-6 py-12 animate-fade-in max-w-md mx-auto">
			<div className="relative w-20 h-20">
				<div className="absolute inset-0 bg-red-100 rounded-full"></div>
				<div className="absolute inset-0 flex items-center justify-center text-3xl">
					⚠️
				</div>
			</div>

			<div className="text-center gap-3 flex flex-col">
				<h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
					Oops! Something went wrong
				</h2>
				<p className="text-gray-600 text-base leading-relaxed">
					{error}
				</p>
			</div>

			{onRetry && (
				<button
					onClick={onRetry}
					className="mt-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
				>
					Try Default Location
				</button>
			)}

			<p className="text-xs text-gray-500 mt-4">
				Please check your internet connection and try again
			</p>
		</div>
	);
}

export default ErrorDisplay;
