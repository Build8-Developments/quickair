import { GET_ALL_HOTELS, GET_FEATURED_TRIPS } from "@/lib/api/queries/hotel";
import { executeGraphQL } from "@/lib/api/client";

export async function getAllHotels({ locale = "en" } = {}) {
  try {
    const data = await executeGraphQL(GET_ALL_HOTELS, { locale });
    console.log(data);
    return data?.hotels || [];
  } catch (error) {
    console.error("[HotelService] Error fetching hotels:", error);
    return [];
  }
}

export async function getFeaturedTrips({ locale = "en", limit = 10 } = {}) {
  try {
    const data = await executeGraphQL(GET_FEATURED_TRIPS, { locale, limit });
    return data?.offers || [];
  } catch (error) {
    console.error("[HotelService] Error fetching featured trips:", error);
    return [];
  }
}
