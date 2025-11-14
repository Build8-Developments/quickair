/**
 * Location Service
 * Handles all location-related API calls
 * Uses the base API client for consistency
 */

import { executeGraphQL } from "../client";
import {
  GET_ALL_LOCATIONS,
  SEARCH_LOCATIONS,
  GET_FEATURED_LOCATIONS,
  GET_LOCATION_BY_SLUG,
  GET_LOCATIONS_BY_TYPE,
} from "../queries/location";

/**
 * Get all locations
 * @param {object} params - Query parameters
 * @param {string} params.locale - Locale code ('en' or 'ar')
 * @param {number} params.limit - Maximum number of results
 * @param {string} params.sort - Sort order
 * @returns {Promise<Array>} Array of locations
 */
export async function getAllLocations({
  locale = "en",
  limit = 100,
  sort = "name:asc",
} = {}) {
  try {
    const data = await executeGraphQL(GET_ALL_LOCATIONS, {
      locale,
      pagination: { limit },
      sort: [sort],
    });

    return data?.locations || [];
  } catch (error) {
    console.error("[LocationService] Error fetching all locations:", error);
    return [];
  }
}

/**
 * Search locations by query
 * @param {object} params - Search parameters
 * @param {string} params.query - Search query string
 * @param {string} params.locale - Locale code ('en' or 'ar')
 * @param {number} params.limit - Maximum number of results
 * @returns {Promise<Array>} Array of matching locations
 */
export async function searchLocations({
  query,
  locale = "en",
  limit = 10,
} = {}) {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const data = await executeGraphQL(SEARCH_LOCATIONS, {
      locale,
      filters: {
        or: [
          { name: { containsi: query } },
          { country: { containsi: query } },
          { shortDescription: { containsi: query } },
        ],
      },
      pagination: { limit },
    });

    return data?.locations || [];
  } catch (error) {
    console.error("[LocationService] Error searching locations:", error);
    return [];
  }
}

/**
 * Get featured locations
 * @param {object} params - Query parameters
 * @param {string} params.locale - Locale code ('en' or 'ar')
 * @param {number} params.limit - Maximum number of results
 * @returns {Promise<Array>} Array of featured locations
 */
export async function getFeaturedLocations({ locale = "en", limit = 20 } = {}) {
  try {
    const data = await executeGraphQL(GET_FEATURED_LOCATIONS, {
      locale,
      filters: { featured: { eq: true } },
      pagination: { limit },
      sort: ["name:asc"],
    });

    return data?.locations || [];
  } catch (error) {
    console.error(
      "[LocationService] Error fetching featured locations:",
      error
    );
    return [];
  }
}

/**
 * Get location by slug
 * @param {object} params - Query parameters
 * @param {string} params.slug - Location slug
 * @param {string} params.locale - Locale code ('en' or 'ar')
 * @returns {Promise<object|null>} Location object or null
 */
export async function getLocationBySlug({ slug, locale = "en" } = {}) {
  try {
    if (!slug) {
      throw new Error("Slug is required");
    }

    const data = await executeGraphQL(GET_LOCATION_BY_SLUG, {
      locale,
      filters: { slug: { eq: slug } },
    });

    const locations = data?.locations || [];
    return locations.length > 0 ? locations[0] : null;
  } catch (error) {
    console.error("[LocationService] Error fetching location by slug:", error);
    return null;
  }
}

/**
 * Get locations grouped by type
 * @param {object} params - Query parameters
 * @param {string} params.locale - Locale code ('en' or 'ar')
 * @param {number} params.limit - Maximum number of results
 * @returns {Promise<object>} Object with locations grouped by type
 */
export async function getLocationsByType({ locale = "en", limit = 100 } = {}) {
  try {
    const data = await executeGraphQL(GET_LOCATIONS_BY_TYPE, {
      locale,
      pagination: { limit },
      sort: ["type:asc", "name:asc"],
    });

    const locations = data?.locations || [];

    // Group by type
    const grouped = locations.reduce((acc, location) => {
      const type = location.type || "Other";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(location);
      return acc;
    }, {});

    return grouped;
  } catch (error) {
    console.error("[LocationService] Error fetching locations by type:", error);
    return {};
  }
}
