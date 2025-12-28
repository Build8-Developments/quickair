/**
 * Offer Service
 * Handles all offer-related API calls
 * Uses the base API client for consistency
 */

import { executeGraphQL } from "../client";
import {
  GET_ALL_OFFERS,
  GET_ALL_OFFERS_PAGINATED,
  GET_OFFER_BY_ID,
  GET_OFFERS_BY_LOCATION,
  GET_FEATURED_OFFERS,
  SEARCH_OFFERS,
  GET_FILTERED_OFFERS,
} from "../queries/offer";

// Helper to log errors only at runtime (not during build)
const logError = (message, error) => {
  if (process.env.NODE_ENV !== "production" || typeof window !== "undefined") {
    console.error(message, error);
  }
};

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
    logError("[OfferService] Error fetching all offers:", error);
    return [];
  }
}

/**
 * Get all offers with server-side pagination
 * @param {object} params - Query parameters
 * @param {string} params.locale - Locale code ('en' or 'ar')
 * @param {number} params.page - Page number (1-indexed)
 * @param {number} params.pageSize - Items per page
 * @param {string} params.sort - Sort order
 * @param {object} params.filters - Additional filters
 * @returns {Promise<object>} Paginated result with items, total, page, pageSize, totalPages
 * Requirements: 2.1, 2.2, 2.4
 */
export async function getAllOffersPaginated({
  locale = "en",
  page = 1,
  pageSize = 12,
  sort = "createdAt:desc",
  filters = {},
} = {}) {
  try {
    // Calculate start offset from page number (0-indexed for GraphQL)
    const start = (page - 1) * pageSize;

    const data = await executeGraphQL(GET_ALL_OFFERS_PAGINATED, {
      locale,
      pagination: { start, limit: pageSize },
      sort: [sort],
      filters,
    });

    const items = data?.offers || [];
    const total = data?.offers_connection?.pageInfo?.total || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  } catch (error) {
    logError("[OfferService] Error fetching paginated offers:", error);
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
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
    logError("[OfferService] Error fetching offer by id:", error);
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
    logError("[OfferService] Error fetching offers by location:", error);
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
    logError("[OfferService] Error fetching featured offers:", error);
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
    logError("[OfferService] Error searching offers:", error);
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
    logError("[OfferService] Error fetching offers by date:", error);
    return [];
  }
}

/**
 * Get filtered offers with location slugs and months
 * @param {object} params - Query parameters
 * @param {string[]} params.locationSlugs - Array of location slugs to filter by
 * @param {string[]} params.months - Array of months to filter by
 * @param {string} params.locale - Locale code ('en' or 'ar')
 * @param {number} params.limit - Maximum number of results
 * @param {string} params.sort - Sort order
 * @returns {Promise<Array>} Array of filtered offers
 */
export async function getFilteredOffers({
  locationSlugs = [],
  months = [],
  locale = "en",
  limit = 100,
  sort = "createdAt:desc",
} = {}) {
  try {
    const filters = {};

    // Build location filter if location slugs provided
    if (locationSlugs && locationSlugs.length > 0) {
      filters.location = {
        slug: { in: locationSlugs },
      };
    }

    // Build month filter if months provided
    if (months && months.length > 0) {
      filters.month = { in: months };
    }

    const data = await executeGraphQL(GET_FILTERED_OFFERS, {
      locale,
      filters,
      pagination: { limit },
      sort: [sort],
    });

    return data?.offers || [];
  } catch (error) {
    logError("[OfferService] Error fetching filtered offers:", error);
    return [];
  }
}
