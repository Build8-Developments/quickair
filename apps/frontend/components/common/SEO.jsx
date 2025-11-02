"use client";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { seoConfig, defaultSEO } from "@/data/seo";

export default function SEO({ page, customTitle, customDescription }) {
  const { language } = useLanguage();

  useEffect(() => {
    // Get the SEO data for the current page and language
    const pageSEO = seoConfig[page]?.[language] || defaultSEO[language];

    // Use custom values if provided, otherwise use config
    const title = customTitle || pageSEO.title;
    const description = customDescription || pageSEO.description;
    const keywords = pageSEO.keywords;

    // Update document title
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;
  }, [page, customTitle, customDescription, language]);

  return null; // This component doesn't render anything
}
