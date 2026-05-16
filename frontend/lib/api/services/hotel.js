import {
  GET_ALL_HOTELS,
  GET_ALL_HOTELS_PAGINATED,
  GET_FEATURED_TRIPS,
  GET_HOTEL_WITH_OFFER,
  GET_HOTEL_BY_SLUG,
} from "@/lib/api/queries/hotel";
import { executeGraphQL } from "@/lib/api/client";

export async function getAllHotels({ locale = "en" } = {}) {
  try {
    const data = await executeGraphQL(GET_ALL_HOTELS, { locale });
    return data?.hotels || [];
  } catch (error) {
    // Silent fail during build - data will be fetched at runtime
    if (
      process.env.NODE_ENV !== "production" ||
      typeof window !== "undefined"
    ) {
      console.error("[HotelService] Error fetching hotels:", error);
    }
    return [];
  }
}

/**
 * Get all hotels with server-side pagination
 * @param {object} params - Query parameters
 * @param {string} params.locale - Locale code ('en' or 'ar')
 * @param {number} params.page - Page number (1-indexed)
 * @param {number} params.pageSize - Items per page
 * @param {object} params.filters - GraphQL filter object
 * @param {array} params.sort - Sort array (e.g., ["createdAt:desc"])
 * @returns {Promise<object>} Paginated result with items, total, page, pageSize, totalPages
 * Requirements: 2.1, 2.2, 2.3
 */
export async function getAllHotelsPaginated({
  locale = "en",
  page = 1,
  pageSize = 12,
  filters = null,
  sort = ["createdAt:desc"],
} = {}) {
  try {
    // Calculate start offset from page number (0-indexed for GraphQL)
    const start = (page - 1) * pageSize;

    const data = await executeGraphQL(GET_ALL_HOTELS_PAGINATED, {
      locale,
      pagination: { start, limit: pageSize },
      filters,
      sort,
    });

    const items = data?.hotels || [];
    const total = data?.hotels_connection?.pageInfo?.total || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  } catch (error) {
    // Silent fail during build - data will be fetched at runtime
    if (
      process.env.NODE_ENV !== "production" ||
      typeof window !== "undefined"
    ) {
      console.error("[HotelService] Error fetching paginated hotels:", error);
    }
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }
}

export async function getHotelWithOffer({ id, locale = "en" } = {}) {
  try {
    const data = await executeGraphQL(GET_HOTEL_WITH_OFFER, {
      hotelId: id,
      locale,
    });

    if (!data?.hotel) {
      return null;
    }

    const hotel = data.hotel;
    const offers = data.offers || [];
    const offer = offers.length > 0 ? offers[0] : null;

    // Find the specific hotel option for this hotel within the offer
    let hotelOption = null;
    if (offer && offer.hotelOptions) {
      hotelOption = offer.hotelOptions.find(
        (option) => option.hotel?.documentId === id,
      );
    }

    return {
      hotel,
      offer,
      hotelOption,
    };
  } catch (error) {
    if (
      process.env.NODE_ENV !== "production" ||
      typeof window !== "undefined"
    ) {
      console.error("[HotelService] Error fetching hotel with offer:", error);
    }
    return null;
  }
}

export async function getFeaturedTrips({ locale = "en", limit = 10 } = {}) {
  try {
    const data = await executeGraphQL(GET_FEATURED_TRIPS, { locale, limit });
    return data?.offers || [];
  } catch (error) {
    if (
      process.env.NODE_ENV !== "production" ||
      typeof window !== "undefined"
    ) {
      console.error("[HotelService] Error fetching featured trips:", error);
    }
    return [];
  }
}

/**
 * Resolve a hotel identifier (documentId or slug) to a documentId.
 * If the id looks like a UUID/documentId, returns it as-is.
 * Otherwise, queries by slug and returns the documentId.
 */
export async function resolveHotelId(id, locale = "en") {
  // Strapi documentIds are typically 24-char hex or UUID-like strings.
  // Slugs contain dashes and lowercase letters.
  const looksLikeDocId = /^[a-f0-9]{24}$/.test(id) || /^[0-9a-f-]{36}$/.test(id);
  if (looksLikeDocId) return id;

  // Treat as slug — look up the documentId
  try {
    const data = await executeGraphQL(GET_HOTEL_BY_SLUG, { slug: id, locale });
    const hotels = data?.hotels || [];
    return hotels[0]?.documentId || null;
  } catch {
    return null;
  }
}
