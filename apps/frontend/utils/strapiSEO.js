import { defaultSEO, siteInfo } from "@/data/seo";
import {
  GET_OFFER_SEO,
  GET_TOUR_SEO,
  GET_DESTINATION_SEO,
  GET_BLOG_SEO,
} from "@/graphql/seoQueries";

// Strapi GraphQL endpoint
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const GRAPHQL_ENDPOINT = `${STRAPI_URL}/graphql`;

/**
 * Map content types to their GraphQL queries
 */
const QUERY_MAP = {
  offer: GET_OFFER_SEO,
  tour: GET_TOUR_SEO,
  destination: GET_DESTINATION_SEO,
  blog: GET_BLOG_SEO,
};

/**
 * Map content types to their data key in GraphQL response
 */
const DATA_KEY_MAP = {
  offer: "offers",
  tour: "tours",
  destination: "destinations",
  blog: "blogs",
};

/**
 * Fetch SEO data from Strapi using GraphQL
 * @param {string} contentType - Type of content (offer, tour, destination, blog)
 * @param {string} slug - Content slug
 * @param {string} language - Language code (en or ar)
 * @returns {Promise<object|null>} SEO data or null
 */
export async function fetchStrapiSEO(contentType, slug, language = "en") {
  try {
    const query = QUERY_MAP[contentType];

    if (!query) {
      console.warn(`No GraphQL query defined for content type: ${contentType}`);
      return null;
    }

    const locale = language === "ar" ? "ar" : "en";

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          slug,
          locale,
        },
      }),
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      console.error(`Failed to fetch SEO data: ${response.statusText}`);
      return null;
    }

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }

    const dataKey = DATA_KEY_MAP[contentType];
    const items = result.data?.[dataKey]?.data;

    if (!items || items.length === 0) {
      console.warn(
        `No ${contentType} found with slug: ${slug} for locale: ${locale}`
      );
      return null;
    }

    const item = items[0];
    const attributes = item.attributes;
    const seoData = attributes.seo;

    if (!seoData) {
      console.warn(`No SEO data found for ${contentType}: ${slug}`);
      return null;
    }

    // Format the SEO data
    return formatStrapiSEO(seoData, attributes, language);
  } catch (error) {
    console.error("Error fetching Strapi SEO:", error);
    return null;
  }
}

/**
 * Format Strapi SEO data to match our SEO structure
 * @param {object} seoData - SEO component data from Strapi
 * @param {object} attributes - Content attributes (for fallback)
 * @param {string} language - Language code
 * @returns {object} Formatted SEO data
 */
function formatStrapiSEO(seoData, attributes, language) {
  const ogImageData = seoData.ogImage?.data?.attributes;
  const ogImageUrl = ogImageData?.url
    ? ogImageData.url.startsWith("http")
      ? ogImageData.url
      : `${STRAPI_URL}${ogImageData.url}`
    : null;

  return {
    title: seoData.metaTitle || attributes.title || attributes.name,
    description: seoData.metaDescription || "",
    keywords: seoData.keywords || "",
    ogImage: ogImageUrl,
    ogImageAlt:
      seoData.ogImageAlt ||
      ogImageData?.alternativeText ||
      attributes.title ||
      attributes.name,
  };
}

/**
 * Get SEO data with fallback to default config
 * @param {string} contentType - Type of content
 * @param {string} slug - Content slug
 * @param {string} language - Language code
 * @param {string} fallbackPage - Fallback page key from seo.js config
 * @returns {Promise<object>} SEO data
 */
export async function getSEOWithFallback(
  contentType,
  slug,
  language,
  fallbackPage = "home"
) {
  // Try to fetch from Strapi
  const strapiSEO = await fetchStrapiSEO(contentType, slug, language);

  // If Strapi data exists, return it
  if (strapiSEO) {
    return strapiSEO;
  }

  // Otherwise, fall back to default config
  console.log(`Using fallback SEO for ${contentType}:${slug}`);
  return defaultSEO[language];
}

/**
 * Generate complete metadata object for Next.js
 * Combines Strapi data with site info
 * @param {object} seoData - SEO data object
 * @param {string} language - Language code
 * @returns {object} Complete metadata object
 */
export function generateMetadataFromStrapi(seoData, language = "en") {
  const { title, description, keywords, ogImage, ogImageAlt } = seoData;

  const fullImageUrl = ogImage || `${siteInfo.siteUrl}/img/seo/default-og.jpg`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: siteInfo.siteName }],
    openGraph: {
      title,
      description,
      url: siteInfo.siteUrl,
      siteName: siteInfo.siteName,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt || title,
        },
      ],
      locale: language === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: siteInfo.twitterHandle,
      images: [fullImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: siteInfo.siteUrl,
      languages: {
        en: `${siteInfo.siteUrl}/en`,
        ar: `${siteInfo.siteUrl}/ar`,
      },
    },
  };
}
