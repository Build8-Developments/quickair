import {
  GET_ALL_HOTELS,
  GET_FEATURED_TRIPS,
  GET_HOTEL_WITH_OFFER,
} from "@/lib/api/queries/hotel";
import { executeGraphQL } from "@/lib/api/client";

export async function getAllHotels({ locale = "en" } = {}) {
  try {
    const data = await executeGraphQL(GET_ALL_HOTELS, { locale });
    return data?.hotels || [];
  } catch (error) {
    // Silent fail during build - data will be fetched at runtime
    if (process.env.NODE_ENV !== "production" || typeof window !== "undefined") {
      console.error("[HotelService] Error fetching hotels:", error);
    }
    return [];
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
        (option) => option.hotel?.documentId === id
      );
    }

    return {
      hotel,
      offer,
      hotelOption,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production" || typeof window !== "undefined") {
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
    if (process.env.NODE_ENV !== "production" || typeof window !== "undefined") {
      console.error("[HotelService] Error fetching featured trips:", error);
    }
    return [];
  }
}
