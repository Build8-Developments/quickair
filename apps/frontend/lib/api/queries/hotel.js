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
    location {
      documentId
      name
      slug
      type
      country
    }
  }
}
`;

// Get single hotel with its associated offer
export const GET_HOTEL_WITH_OFFER = `
  query GetHotelWithOffer($hotelId: ID!, $locale: I18NLocaleCode) {
    hotel(documentId: $hotelId, locale: $locale) {
      documentId
      name
      slug
      stars
      chain
      address
      description
      shortDescription
      featured
      website
      email
      phone
      coverImage {
        url
        alternativeText
        formats
      }
      images {
        url
        alternativeText
        formats
      }
      location {
        documentId
        name
        slug
        type
        country
      }
      amenities {
        name
        icon
        category
      }
      coordinates {
        latitude
        longitude
      }
      seo {
        metaTitle
        metaDescription
        keywords
        metaImage {
          url
          alternativeText
        }
      }
    }
    offers(
      locale: $locale
      filters: { hotelOptions: { hotel: { documentId: { eq: $hotelId } } } }
      pagination: { limit: 1 }
    ) {
      documentId
      title
      slug
      month
      year
      coverImage {
        url
        alternativeText
      }
      pdfFile {
        url
        name
        size
      }
      location {
        documentId
        name
        slug
        description
        image {
          url
          alternativeText
        }
      }
      hotelOptions {
        hotel {
          documentId
        }
        nights
        mealPlan {
          documentId
          name
        }
        currency
        roomPricing {
          roomType
          singleOccupancyPrice
          doubleOccupancyPrice
          tripleOccupancyPrice
          notes
        }
        kidsPricing {
          ageFrom
          ageTo
          discount
          isFree
          price
          notes
        }
        notes
        specialOffer
        available
      }
      inclusions {
        item
      }
      exclusions {
        item
      }
      policies
      optionalTrips {
        title
        description
        pricePerPerson
        currency
        inclusions {
          item
        }
      }
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
        }
        roomPricing {
          roomType
          singleOccupancyPrice
          doubleOccupancyPrice
          tripleOccupancyPrice
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
