/**
 * GraphQL queries for Offer collection type
 * Updated for Strapi 5 GraphQL schema (no data/attributes wrapper)
 * Supports both English and Arabic locales
 */

// Get all offers with optional filtering
export const GET_ALL_OFFERS = `
  query GetAllOffers($locale: I18NLocaleCode, $pagination: PaginationArg, $sort: [String], $filters: OfferFiltersInput) {
    offers(locale: $locale, pagination: $pagination, sort: $sort, filters: $filters) {
      documentId
      title
      slug
      description
      month
      year
      coverImage {
        url
        alternativeText
      }
      location {
        documentId
        name
        slug
        type
        country
      }
      hotelOptions {
        hotel {
          documentId
          externalImageUrl
          coverImage {
            url
          }
          location {
            country
          }
        }
        nights
        currency
        roomPricing {
          singleOccupancyPrice
          doubleOccupancyPrice
          tripleOccupancyPrice
        }
      }
    }
  }
`;

// Get all offers with pagination metadata for server-side pagination
// Supports filters parameter for filtered pagination
// Requirements: 2.1, 2.2
export const GET_ALL_OFFERS_PAGINATED = `
  query GetAllOffersPaginated($locale: I18NLocaleCode, $pagination: PaginationArg, $sort: [String], $filters: OfferFiltersInput) {
    offers(locale: $locale, pagination: $pagination, sort: $sort, filters: $filters) {
      documentId
      title
      slug
      description
      month
      year
      coverImage {
        url
        alternativeText
      }
      location {
        documentId
        name
        slug
        type
        country
      }
      hotelOptions {
        hotel {
          documentId
          externalImageUrl
          coverImage {
            url
          }
          location {
            country
          }
        }
        nights
        currency
        roomPricing {
          singleOccupancyPrice
          doubleOccupancyPrice
          tripleOccupancyPrice
        }
      }
    }
    offers_connection(locale: $locale, filters: $filters) {
      pageInfo {
        total
      }
    }
  }
`;

// Get single offer by documentId with full details
export const GET_OFFER_BY_ID = `
  query GetOfferById($documentId: ID!, $locale: I18NLocaleCode) {
    offer(documentId: $documentId, locale: $locale) {
      documentId
      title
      slug
      month
      year
      coverImage {
        url
        alternativeText
        formats
      }
      gallery {
        url
        alternativeText
        formats
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
        type
        country
        description
        image {
          url
          alternativeText
        }
      }
      hotelOptions {
        hotel {
          documentId
          name
          slug
          stars
          chain
          address
          shortDescription
          externalImageUrl
          coverImage {
            url
            alternativeText
          }
          location {
            name
            country
          }
          amenities {
            name
            icon
            category
          }
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

// Get offers by location
export const GET_OFFERS_BY_LOCATION = `
  query GetOffersByLocation($locale: I18NLocaleCode, $filters: OfferFiltersInput, $pagination: PaginationArg, $sort: [String]) {
    offers(locale: $locale, filters: $filters, pagination: $pagination, sort: $sort) {
      documentId
      title
      slug
      month
      year
      coverImage {
        url
        alternativeText
      }
      location {
        documentId
        name
        slug
      }
    }
  }
`;

// Get featured/latest offers
export const GET_FEATURED_OFFERS = `
  query GetFeaturedOffers($locale: I18NLocaleCode, $pagination: PaginationArg) {
    offers(locale: $locale, pagination: $pagination, sort: ["createdAt:desc"]) {
      documentId
      title
      slug
      month
      year
      coverImage {
        url
        alternativeText
      }
      location {
        documentId
        name
        slug
        country
      }
      hotelOptions {
        hotel {
          name
          stars
        }
        nights
      }
    }
  }
`;

// Search offers
export const SEARCH_OFFERS = `
  query SearchOffers($locale: I18NLocaleCode, $filters: OfferFiltersInput, $pagination: PaginationArg) {
    offers(locale: $locale, filters: $filters, pagination: $pagination) {
      documentId
      title
      slug
      month
      year
      coverImage {
        url
        alternativeText
      }
      location {
        name
        slug
        country
      }
    }
  }
`;

// Get filtered offers (optimized for client-side filtering with location slugs and months)
export const GET_FILTERED_OFFERS = `
  query GetFilteredOffers(
    $locale: I18NLocaleCode
    $pagination: PaginationArg
    $sort: [String]
    $filters: OfferFiltersInput
  ) {
    offers(locale: $locale, pagination: $pagination, sort: $sort, filters: $filters) {
      documentId
      title
      slug
      description
      month
      year
      coverImage {
        url
        alternativeText
      }
      location {
        documentId
        name
        slug
        type
        country
      }
      hotelOptions {
        hotel {
          documentId
          externalImageUrl
          coverImage {
            url
          }
          location {
            country
          }
        }
        nights
        currency
        roomPricing {
          singleOccupancyPrice
          doubleOccupancyPrice
          tripleOccupancyPrice
        }
      }
    }
  }
`;
