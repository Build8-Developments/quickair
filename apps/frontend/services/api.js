import {
  graphqlRequest,
  extractStrapiData,
  formatImageUrl,
} from "@/lib/graphql";
import { CACHE_CONFIG } from "@/config/api";

/**
 * Centralized API service for all data fetching
 * Uses GraphQL client and provides clean interfaces
 */

// ===================================
// OFFERS
// ===================================

export const offersAPI = {
  /**
   * Get all offers
   * @param {object} options - Query options (locale, pagination, etc.)
   * @returns {Promise<Array>} List of offers
   */
  async getAll(options = {}) {
    const { locale = "en", limit = 10, start = 0, filters = "" } = options;

    const query = `
      query GetOffers($locale: I18NLocaleCode!, $limit: Int, $start: Int) {
        offers(locale: $locale, pagination: { limit: $limit, start: $start }${filters}) {
          data {
            id
            attributes {
              title
              slug
              description
              price
              discount
              startDate
              endDate
              image {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              createdAt
              updatedAt
            }
          }
        }
      }
    `;

    const data = await graphqlRequest(
      query,
      { locale, limit, start },
      {
        revalidate: CACHE_CONFIG.revalidate.dynamic,
        tags: [CACHE_CONFIG.tags.offers],
      }
    );

    return extractStrapiData(data, "offers");
  },

  /**
   * Get single offer by slug
   * @param {string} slug - Offer slug
   * @param {string} locale - Language code
   * @returns {Promise<object>} Offer data
   */
  async getBySlug(slug, locale = "en") {
    const query = `
      query GetOffer($slug: String!, $locale: I18NLocaleCode!) {
        offers(filters: { slug: { eq: $slug } }, locale: $locale) {
          data {
            id
            attributes {
              title
              slug
              description
              price
              discount
              startDate
              endDate
              image {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              seo {
                metaTitle
                metaDescription
                keywords
                ogImage {
                  data {
                    attributes {
                      url
                      alternativeText
                    }
                  }
                }
              }
              createdAt
              updatedAt
            }
          }
        }
      }
    `;

    const data = await graphqlRequest(
      query,
      { slug, locale },
      {
        revalidate: CACHE_CONFIG.revalidate.dynamic,
        tags: [CACHE_CONFIG.tags.offers],
      }
    );

    const offers = extractStrapiData(data, "offers");
    return offers?.[0] || null;
  },
};

// ===================================
// TOURS
// ===================================

export const toursAPI = {
  /**
   * Get all tours
   */
  async getAll(options = {}) {
    const { locale = "en", limit = 10, start = 0 } = options;

    const query = `
      query GetTours($locale: I18NLocaleCode!, $limit: Int, $start: Int) {
        tours(locale: $locale, pagination: { limit: $limit, start: $start }) {
          data {
            id
            attributes {
              title
              slug
              description
              price
              duration
              rating
              images {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              destination {
                data {
                  attributes {
                    name
                    slug
                  }
                }
              }
              createdAt
            }
          }
        }
      }
    `;

    const data = await graphqlRequest(
      query,
      { locale, limit, start },
      {
        revalidate: CACHE_CONFIG.revalidate.dynamic,
        tags: [CACHE_CONFIG.tags.tours],
      }
    );

    return extractStrapiData(data, "tours");
  },

  /**
   * Get single tour by slug
   */
  async getBySlug(slug, locale = "en") {
    const query = `
      query GetTour($slug: String!, $locale: I18NLocaleCode!) {
        tours(filters: { slug: { eq: $slug } }, locale: $locale) {
          data {
            id
            attributes {
              title
              slug
              description
              price
              duration
              rating
              images {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              destination {
                data {
                  attributes {
                    name
                    slug
                  }
                }
              }
              seo {
                metaTitle
                metaDescription
                keywords
                ogImage {
                  data {
                    attributes {
                      url
                      alternativeText
                    }
                  }
                }
              }
              createdAt
            }
          }
        }
      }
    `;

    const data = await graphqlRequest(
      query,
      { slug, locale },
      {
        revalidate: CACHE_CONFIG.revalidate.dynamic,
        tags: [CACHE_CONFIG.tags.tours],
      }
    );

    const tours = extractStrapiData(data, "tours");
    return tours?.[0] || null;
  },
};

// ===================================
// DESTINATIONS
// ===================================

export const destinationsAPI = {
  /**
   * Get all destinations
   */
  async getAll(options = {}) {
    const { locale = "en", limit = 20, start = 0 } = options;

    const query = `
      query GetDestinations($locale: I18NLocaleCode!, $limit: Int, $start: Int) {
        destinations(locale: $locale, pagination: { limit: $limit, start: $start }) {
          data {
            id
            attributes {
              name
              slug
              description
              country
              image {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              createdAt
            }
          }
        }
      }
    `;

    const data = await graphqlRequest(
      query,
      { locale, limit, start },
      {
        revalidate: CACHE_CONFIG.revalidate.static,
        tags: [CACHE_CONFIG.tags.destinations],
      }
    );

    return extractStrapiData(data, "destinations");
  },

  /**
   * Get single destination by slug
   */
  async getBySlug(slug, locale = "en") {
    const query = `
      query GetDestination($slug: String!, $locale: I18NLocaleCode!) {
        destinations(filters: { slug: { eq: $slug } }, locale: $locale) {
          data {
            id
            attributes {
              name
              slug
              description
              country
              image {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              seo {
                metaTitle
                metaDescription
                keywords
                ogImage {
                  data {
                    attributes {
                      url
                      alternativeText
                    }
                  }
                }
              }
              createdAt
            }
          }
        }
      }
    `;

    const data = await graphqlRequest(
      query,
      { slug, locale },
      {
        revalidate: CACHE_CONFIG.revalidate.static,
        tags: [CACHE_CONFIG.tags.destinations],
      }
    );

    const destinations = extractStrapiData(data, "destinations");
    return destinations?.[0] || null;
  },
};

// ===================================
// BLOGS
// ===================================

export const blogsAPI = {
  /**
   * Get all blog posts
   */
  async getAll(options = {}) {
    const { locale = "en", limit = 10, start = 0 } = options;

    const query = `
      query GetBlogs($locale: I18NLocaleCode!, $limit: Int, $start: Int) {
        blogs(locale: $locale, pagination: { limit: $limit, start: $start }, sort: "createdAt:desc") {
          data {
            id
            attributes {
              title
              slug
              excerpt
              content
              coverImage {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              author {
                data {
                  attributes {
                    name
                  }
                }
              }
              createdAt
              publishedAt
            }
          }
        }
      }
    `;

    const data = await graphqlRequest(
      query,
      { locale, limit, start },
      {
        revalidate: CACHE_CONFIG.revalidate.dynamic,
        tags: [CACHE_CONFIG.tags.blogs],
      }
    );

    return extractStrapiData(data, "blogs");
  },

  /**
   * Get single blog post by slug
   */
  async getBySlug(slug, locale = "en") {
    const query = `
      query GetBlog($slug: String!, $locale: I18NLocaleCode!) {
        blogs(filters: { slug: { eq: $slug } }, locale: $locale) {
          data {
            id
            attributes {
              title
              slug
              excerpt
              content
              coverImage {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              author {
                data {
                  attributes {
                    name
                  }
                }
              }
              seo {
                metaTitle
                metaDescription
                keywords
                ogImage {
                  data {
                    attributes {
                      url
                      alternativeText
                    }
                  }
                }
              }
              createdAt
              publishedAt
            }
          }
        }
      }
    `;

    const data = await graphqlRequest(
      query,
      { slug, locale },
      {
        revalidate: CACHE_CONFIG.revalidate.dynamic,
        tags: [CACHE_CONFIG.tags.blogs],
      }
    );

    const blogs = extractStrapiData(data, "blogs");
    return blogs?.[0] || null;
  },
};

// Export all APIs
export default {
  offers: offersAPI,
  tours: toursAPI,
  destinations: destinationsAPI,
  blogs: blogsAPI,
};
