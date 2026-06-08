import { useState, useEffect } from "react";
import { searchAirports } from "@/lib/airportSearch";

/**
 * Custom hook for searching airports by name, city, or IATA code
 * @param {Object} options - Search options
 * @param {string} options.query - Search query string
 * @param {string} options.locale - Language locale (en/ar)
 * @param {number} options.debounceMs - Debounce delay in milliseconds
 * @param {number} options.maxResults - Maximum number of results to return
 * @param {number} options.minQueryLength - Min chars before search (0 = show popular)
 * @returns {Object} { airports, loading, error }
 */
export function useAirportSearch({
  query = "",
  locale = "en",
  debounceMs = 300,
  maxResults = 20,
  minQueryLength = 0,
}) {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length > 0 && trimmed.length < minQueryLength) {
      setAirports([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      try {
        setAirports(searchAirports(trimmed, locale, maxResults));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, locale, debounceMs, maxResults, minQueryLength]);

  return { airports, loading, error };
}
