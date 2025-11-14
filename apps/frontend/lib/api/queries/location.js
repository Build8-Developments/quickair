/**
 * GraphQL queries for Location collection type
 * Updated for Strapi 5 GraphQL schema (no data/attributes wrapper)
 * Supports both English and Arabic locales
 */

// Get all locations for search dropdown
export const GET_ALL_LOCATIONS = `
  query GetAllLocations($locale: I18NLocaleCode, $pagination: PaginationArg, $sort: [String]) {
    locations(locale: $locale, pagination: $pagination, sort: $sort) {
      documentId
      name
      slug
      type
      country
      shortDescription
      featured
    }
  }
`;

// Search locations by query
export const SEARCH_LOCATIONS = `
  query SearchLocations($locale: I18NLocaleCode, $filters: LocationFiltersInput, $pagination: PaginationArg) {
    locations(locale: $locale, filters: $filters, pagination: $pagination) {
      documentId
      name
      slug
      type
      country
      shortDescription
    }
  }
`;

// Get featured locations
export const GET_FEATURED_LOCATIONS = `
  query GetFeaturedLocations($locale: I18NLocaleCode, $filters: LocationFiltersInput, $pagination: PaginationArg, $sort: [String]) {
    locations(locale: $locale, filters: $filters, pagination: $pagination, sort: $sort) {
      documentId
      name
      slug
      type
      country
      shortDescription
      featured
    }
  }
`;

// Get single location with offers
export const GET_LOCATION_BY_SLUG = `
  query GetLocationBySlug($locale: I18NLocaleCode, $filters: LocationFiltersInput) {
    locations(locale: $locale, filters: $filters) {
      documentId
      name
      slug
      type
      country
      description
      shortDescription
      featured
      image {
        url
        alternativeText
      }
      offers {
        documentId
        title
        slug
        month
        year
        coverImage {
          url
          alternativeText
        }
        hotelOptions {
          hotel {
            name
          }
          nights
          mealPlan {
            code
            name
          }
        }
      }
      seo {
        metaTitle
        metaDescription
        keywords
        metaImage {
          url
        }
      }
    }
  }
`;

// Get locations grouped by type
export const GET_LOCATIONS_BY_TYPE = `
  query GetLocationsByType($locale: I18NLocaleCode, $pagination: PaginationArg, $sort: [String]) {
    locations(locale: $locale, pagination: $pagination, sort: $sort) {
      documentId
      name
      slug
      type
      country
    }
  }
`;
