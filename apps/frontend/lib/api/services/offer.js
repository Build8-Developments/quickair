/**
 * Offer Service
 * Handles all offer-related API calls
 * Uses the base API client for consistency
 */

import { executeGraphQL } from "../client";
import {
  GET_ALL_OFFERS,
  GET_OFFER_BY_ID,
  GET_OFFERS_BY_LOCATION,
  GET_FEATURED_OFFERS,
  SEARCH_OFFERS,
} from "../queries/offer";

/**
 * Get all offers
 * @param {object} params - Query parameters
 * @param {string} params.locale - Locale code ('en' or 'ar')
 * @param {number} params.limit - Maximum number of results
 * @param {string} params.sort - Sort order
 * @param {object} params.filters - Additional filters
 * @returns {Promise<Array>} Array of offers
 */
export async function getAllOffers({
  locale = "en",
  limit = 100,
  sort = "createdAt:desc",
  filters = {},
} = {}) {
  try {
    const data = await executeGraphQL(GET_ALL_OFFERS, {
      locale,
      pagination: { limit },
      sort: [sort],
      filters,
    });

    return data?.offers || [];
  } catch (error) {
    console.error("[OfferService] Error fetching all offers:", error);
    return [];
  }
}

/**
 * Get offer by documentId
 * @param {object} params - Query parameters
 * @param {string} params.id - Offer documentId
 * @param {string} params.locale - Locale code ('en' or 'ar')
 * @returns {Promise<object|null>} Offer object or null
 */
export async function getOfferById({ id, locale = "en" } = {}) {
  try {
    if (!id) {
      throw new Error("DocumentId is required");
    }

    const data = await executeGraphQL(GET_OFFER_BY_ID, {
      documentId: id,
      locale,
    });

    return data?.offer || null;
  } catch (error) {
    console.error("[OfferService] Error fetching offer by id:", error);
    return null;
  }
}

/**
 * Get offers by location
 * @param {object} params - Query parameters
 * @param {string} params.locationSlug - Location slug
 * @param {string} params.locale - Locale code ('en' or 'ar')
 * @param {number} params.limit - Maximum number of results
 * @returns {Promise<Array>} Array of offers
 */
export async function getOffersByLocation({
  locationSlug,
  locale = "en",
  limit = 20,
} = {}) {
  try {
    if (!locationSlug) {
      throw new Error("Location slug is required");
    }

    const data = await executeGraphQL(GET_OFFERS_BY_LOCATION, {
      locale,
      filters: {
        location: {
          slug: { eq: locationSlug },
        },
      },
      pagination: { limit },
      sort: ["createdAt:desc"],
    });

    return data?.offers || [];
  } catch (error) {
    console.error("[OfferService] Error fetching offers by location:", error);
    return [];
  }
}

/**
 * Get featured/latest offers
 * @param {object} params - Query parameters
 * @param {string} params.locale - Locale code ('en' or 'ar')
 * @param {number} params.limit - Maximum number of results
 * @returns {Promise<Array>} Array of featured offers
 */
export async function getFeaturedOffers({ locale = "en", limit = 10 } = {}) {
  try {
    const data = await executeGraphQL(GET_FEATURED_OFFERS, {
      locale,
      pagination: { limit },
    });

    return data?.offers || [];
  } catch (error) {
    console.error("[OfferService] Error fetching featured offers:", error);
    return [];
  }
}

/**
 * Search offers
 * @param {object} params - Search parameters
 * @param {string} params.query - Search query string
 * @param {string} params.locale - Locale code ('en' or 'ar')
 * @param {number} params.limit - Maximum number of results
 * @returns {Promise<Array>} Array of matching offers
 */
export async function searchOffers({ query, locale = "en", limit = 20 } = {}) {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const data = await executeGraphQL(SEARCH_OFFERS, {
      locale,
      filters: {
        or: [
          { title: { containsi: query } },
          { location: { name: { containsi: query } } },
        ],
      },
      pagination: { limit },
    });

    return data?.offers || [];
  } catch (error) {
    console.error("[OfferService] Error searching offers:", error);
    return [];
  }
}

/**
 * Get offers by month/year
 * @param {object} params - Query parameters
 * @param {string} params.month - Month name
 * @param {string} params.year - Year
 * @param {string} params.locale - Locale code ('en' or 'ar')
 * @param {number} params.limit - Maximum number of results
 * @returns {Promise<Array>} Array of offers
 */
export async function getOffersByDate({
  month,
  year,
  locale = "en",
  limit = 20,
} = {}) {
  try {
    const filters = {};
    if (month) filters.month = { eq: month };
    if (year) filters.year = { eq: year };

    const data = await executeGraphQL(GET_ALL_OFFERS, {
      locale,
      filters,
      pagination: { limit },
      sort: ["createdAt:desc"],
    });

    return data?.offers || [];
  } catch (error) {
    console.error("[OfferService] Error fetching offers by date:", error);
    return [];
  }
}
