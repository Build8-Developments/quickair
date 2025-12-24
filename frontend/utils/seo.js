import { seoConfig, defaultSEO, siteInfo } from "@/data/seo";

/**
 * Generate metadata for Next.js pages (legacy - for backward compatibility)
 * @param {string} page - The page key from seoConfig (e.g., 'home', 'tourList', 'about')
 * @param {string} language - Current language ('en' or 'ar')
 * @param {object} custom - Custom overrides { title, description, image }
 * @returns {object} Next.js metadata object
 */
export function generatePageMetadata(page, language = "en", custom = {}) {
  return generateLocalizedMetadata(page, language, custom);
}

/**
 * Generate SEO-optimized metadata for localized pages
 * Includes hreflang, canonical URLs, and proper locale handling
 * @param {string} page - The page key from seoConfig
 * @param {string} locale - Current locale ('en' or 'ar')
 * @param {object} custom - Custom overrides { title, description, image }
 * @returns {object} Next.js metadata object
 */
export function generateLocalizedMetadata(page, locale = "en", custom = {}) {
  const pageSEO = seoConfig[page]?.[locale] || defaultSEO[locale];

  const title = custom.title || pageSEO.title;
  const description = custom.description || pageSEO.description;
  const keywords = custom.keywords || pageSEO.keywords;
  const ogImage = custom.image || pageSEO.ogImage;

  const fullImageUrl = ogImage.startsWith("http")
    ? ogImage
    : `${siteInfo.siteUrl}${ogImage}`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: siteInfo.siteName }],
    openGraph: {
      title,
      description,
      url: `${siteInfo.siteUrl}/${locale}`,
      siteName: siteInfo.siteName,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === "ar" ? "ar_SA" : "en_US",
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
  };
}

/**
 * Get SEO data for a specific page and language
 * Useful for client components
 */
export function getSEOData(page, language = "en") {
  return seoConfig[page]?.[language] || defaultSEO[language];
}
