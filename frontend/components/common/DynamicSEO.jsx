"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchStrapiSEO, getSEOWithFallback } from "@/utils/strapiSEO";
import { defaultSEO } from "@/data/seo";

/**
 * Dynamic SEO component for Strapi content
 * Fetches SEO data from Strapi based on content type and slug
 *
 * @param {string} contentType - Type of content (offer, tour, destination, blog)
 * @param {string} slug - Content slug
 * @param {string} fallbackPage - Fallback page key from seo.js if Strapi data not found
 * @param {object} customSEO - Custom SEO overrides (optional)
 */
export default function DynamicSEO({
  contentType,
  slug,
  fallbackPage = "home",
  customSEO = {},
}) {
  const { language } = useLanguage();
  const [seoData, setSeoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSEO() {
      setIsLoading(true);

      // Fetch SEO data from Strapi with fallback
      const data = await getSEOWithFallback(
        contentType,
        slug,
        language,
        fallbackPage
      );

      // Merge with custom SEO if provided
      const finalSEO = {
        ...data,
        ...customSEO,
      };

      setSeoData(finalSEO);
      setIsLoading(false);
    }

    if (contentType && slug) {
      loadSEO();
    } else {
      // Use default SEO if no content type/slug provided
      setSeoData(defaultSEO[language]);
      setIsLoading(false);
    }
  }, [contentType, slug, language, fallbackPage, customSEO]);

  useEffect(() => {
    if (!seoData || isLoading) return;

    // Update document title
    document.title = seoData.title;

    // Update meta description
    updateMetaTag("name", "description", seoData.description);

    // Update meta keywords
    updateMetaTag("name", "keywords", seoData.keywords);

    // Update OG tags
    updateMetaTag("property", "og:title", seoData.title);
    updateMetaTag("property", "og:description", seoData.description);
    updateMetaTag(
      "property",
      "og:locale",
      language === "ar" ? "ar_SA" : "en_US"
    );

    if (seoData.ogImage) {
      updateMetaTag("property", "og:image", seoData.ogImage);
      updateMetaTag(
        "property",
        "og:image:alt",
        seoData.ogImageAlt || seoData.title
      );
    }

    // Update Twitter Card tags
    updateMetaTag("name", "twitter:title", seoData.title);
    updateMetaTag("name", "twitter:description", seoData.description);

    if (seoData.ogImage) {
      updateMetaTag("name", "twitter:image", seoData.ogImage);
    }
  }, [seoData, language, isLoading]);

  return null; // This component doesn't render anything
}

/**
 * Helper function to update or create meta tags
 */
function updateMetaTag(attribute, key, value) {
  if (!value) return;

  let element = document.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", value);
}
