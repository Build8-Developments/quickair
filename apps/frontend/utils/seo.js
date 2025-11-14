import { seoConfig, defaultSEO, siteInfo } from "@/data/seo";

/**
 * Generate metadata for Next.js pages
 * @param {string} page - The page key from seoConfig (e.g., 'home', 'tourList', 'about')
 * @param {string} language - Current language ('en' or 'ar')
 * @param {object} custom - Custom overrides { title, description, image }
 * @returns {object} Next.js metadata object
 */
export function generatePageMetadata(page, language = "en", custom = {}) {
  const pageSEO = seoConfig[page]?.[language] || defaultSEO[language];

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
      url: siteInfo.siteUrl,
      siteName: siteInfo.siteName,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
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
