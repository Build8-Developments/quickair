// GraphQL queries for fetching SEO data from Strapi

/**
 * GraphQL query to fetch SEO data for an Offer
 */
export const GET_OFFER_SEO = `
  query GetOfferSEO($slug: String!, $locale: I18NLocaleCode!) {
    offers(filters: { slug: { eq: $slug } }, locale: $locale) {
      data {
        id
        attributes {
          title
          slug
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
            ogImageAlt
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to fetch SEO data for a Tour
 */
export const GET_TOUR_SEO = `
  query GetTourSEO($slug: String!, $locale: I18NLocaleCode!) {
    tours(filters: { slug: { eq: $slug } }, locale: $locale) {
      data {
        id
        attributes {
          title
          slug
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
            ogImageAlt
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to fetch SEO data for a Destination
 */
export const GET_DESTINATION_SEO = `
  query GetDestinationSEO($slug: String!, $locale: I18NLocaleCode!) {
    destinations(filters: { slug: { eq: $slug } }, locale: $locale) {
      data {
        id
        attributes {
          name
          slug
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
            ogImageAlt
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to fetch SEO data for a Blog Post
 */
export const GET_BLOG_SEO = `
  query GetBlogSEO($slug: String!, $locale: I18NLocaleCode!) {
    blogs(filters: { slug: { eq: $slug } }, locale: $locale) {
      data {
        id
        attributes {
          title
          slug
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
            ogImageAlt
          }
        }
      }
    }
  }
`;

/**
 * Generic GraphQL query builder for any content type with SEO
 */
export const buildSEOQuery = (contentType) => `
  query Get${contentType}SEO($slug: String!, $locale: I18NLocaleCode!) {
    ${contentType.toLowerCase()}s(filters: { slug: { eq: $slug } }, locale: $locale) {
      data {
        id
        attributes {
          title
          slug
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
            ogImageAlt
          }
        }
      }
    }
  }
`;
