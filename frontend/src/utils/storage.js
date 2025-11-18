const SEARCH_HISTORY_KEY = 'weather_search_history';
const MAX_HISTORY_ITEMS = 10;

/**
 * Get search history from localStorage
 * @returns {Array<string>} Array of search queries
 */
export function getSearchHistory() {
	try {
		const history = localStorage.getItem(SEARCH_HISTORY_KEY);
		return history ? JSON.parse(history) : [];
	} catch (error) {
		console.error('Error reading search history:', error);
		return [];
	}
}

/**
 * Add a search query to history
 * @param {string} query - Search query to add
 */
export function addToSearchHistory(query) {
	try {
		if (!query || query.trim() === '') return;

		const history = getSearchHistory();

		// Remove query if it already exists (to avoid duplicates)
		const filteredHistory = history.filter(item => item.toLowerCase() !== query.toLowerCase());

		// Add new query to beginning of array
		const newHistory = [query, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);

		localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
	} catch (error) {
		console.error('Error saving search history:', error);
	}
}

/**
 * Clear all search history
 */
export function clearSearchHistory() {
	try {
		localStorage.removeItem(SEARCH_HISTORY_KEY);
	} catch (error) {
		console.error('Error clearing search history:', error);
	}
}

/**
 * Remove a specific item from search history
 * @param {string} query - Query to remove
 */
export function removeFromSearchHistory(query) {
	try {
		const history = getSearchHistory();
		const newHistory = history.filter(item => item !== query);
		localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
	} catch (error) {
		console.error('Error removing from search history:', error);
	}
}
