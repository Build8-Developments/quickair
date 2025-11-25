export const GET_ALL_HOTELS = `
  query Hotels($locale: I18NLocaleCode) {
  hotels(locale: $locale) {
    amenities {
      name
    }
    coverImage {
      url
      name
    }
    documentId
    name
    shortDescription
    stars
  }
}
`;

// Custom query for Featured Trips with complete offer data
export const GET_FEATURED_TRIPS = `
  query GetFeaturedTrips($locale: I18NLocaleCode, $limit: Int) {
    offers(
      locale: $locale
      pagination: { limit: $limit }
      sort: ["createdAt:desc"]
    ) {
      documentId
      title
      description
      month
      year
      coverImage {
        url
        name
      }
      location {
        name
        country
        type
      }
      hotelOptions {
        nights
        currency
        available
        specialOffer
        hotel {
          name
          stars
          location {
            name
          }
          amenities {
            name
          }
        }
        mealPlan {
          name
          code
        }
        roomPricing {
          roomType
          singlePrice
          doublePrice
          triplePrice
        }
      }
      optionalTrips {
        title
        description
        pricePerPerson
        currency
      }
    }
  }
`;
