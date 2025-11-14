/**
 * Location React Hooks
 * Client-side hooks for location data fetching with state management
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { locationService } from "../index";

/**
 * Hook to search locations with debouncing
 * @param {object} options - Hook options
 * @param {string} options.query - Search query
 * @param {string} options.locale - Locale code
 * @param {number} options.debounceMs - Debounce delay in milliseconds
 * @returns {object} { locations, loading, error }
 */
export function useLocationSearch({
  query,
  locale = "en",
  debounceMs = 300,
} = {}) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setLocations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(async () => {
      try {
        const results = await locationService.searchLocations({
          query,
          locale,
        });
        setLocations(results);
      } catch (err) {
        console.error("Search error:", err);
        setError(err.message);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, locale, debounceMs]);

  return { locations, loading, error };
}

/**
 * Hook to fetch all locations
 * @param {object} options - Hook options
 * @param {string} options.locale - Locale code
 * @param {number} options.limit - Maximum results
 * @returns {object} { locations, loading, error, refetch }
 */
export function useAllLocations({ locale = "en", limit = 100 } = {}) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await locationService.getAllLocations({ locale, limit });
      setLocations(results);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, [locale, limit]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return { locations, loading, error, refetch: fetchLocations };
}

/**
 * Hook to fetch featured locations
 * @param {object} options - Hook options
 * @param {string} options.locale - Locale code
 * @param {number} options.limit - Maximum results
 * @returns {object} { locations, loading, error, refetch }
 */
export function useFeaturedLocations({ locale = "en", limit = 20 } = {}) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await locationService.getFeaturedLocations({
        locale,
        limit,
      });
      setLocations(results);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, [locale, limit]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return { locations, loading, error, refetch: fetchLocations };
}
