import { useState, useEffect } from "react";
import airportsData from "@/data/airports.js";

/**
 * Custom hook for searching airports by name, city, or IATA code
 * @param {Object} options - Search options
 * @param {string} options.query - Search query string
 * @param {string} options.locale - Language locale (en/ar)
 * @param {number} options.debounceMs - Debounce delay in milliseconds
 * @param {number} options.maxResults - Maximum number of results to return
 * @returns {Object} { airports, loading, error }
 */
export function useAirportSearch({
  query = "",
  locale = "en",
  debounceMs = 300,
  maxResults = 10,
}) {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't search if query is too short
    if (query.trim().length < 2) {
      setAirports([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Debounce the search
    const timeoutId = setTimeout(() => {
      try {
        const searchQuery = query.toLowerCase().trim();

        // Search in name, city, country, and IATA code
        const results = airportsData.filter((airport) => {
          return (
            airport.name.toLowerCase().includes(searchQuery) ||
            airport.city.toLowerCase().includes(searchQuery) ||
            airport.country.toLowerCase().includes(searchQuery) ||
            airport.iata.toLowerCase().includes(searchQuery)
          );
        });

        // Sort results: prioritize exact IATA matches, then city matches, then name matches
        const sortedResults = results.sort((a, b) => {
          const aIataMatch = a.iata.toLowerCase() === searchQuery;
          const bIataMatch = b.iata.toLowerCase() === searchQuery;
          if (aIataMatch && !bIataMatch) return -1;
          if (!aIataMatch && bIataMatch) return 1;

          const aCityMatch = a.city.toLowerCase().startsWith(searchQuery);
          const bCityMatch = b.city.toLowerCase().startsWith(searchQuery);
          if (aCityMatch && !bCityMatch) return -1;
          if (!aCityMatch && bCityMatch) return 1;

          return 0;
        });

        setAirports(sortedResults.slice(0, maxResults));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, locale, debounceMs, maxResults]);

  return { airports, loading, error };
}
