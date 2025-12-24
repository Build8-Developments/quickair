"use client";
import { createContext, useContext, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import i18n from "@/lib/i18n";

const LanguageContext = createContext();

/**
 * Extract locale from URL pathname
 */
const getLocaleFromPath = (pathname) => {
  const match = pathname?.match(/^\/(en|ar)/);
  return match ? match[1] : "en";
};

/**
 * LanguageProvider - URL-based language context
 * Provides backward compatibility with existing components using useLanguage
 * Language is now determined by URL, not localStorage
 */
export function LanguageProvider({ children, initialLanguage }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Get language from URL path or use initialLanguage from server
  const language = initialLanguage || getLocaleFromPath(pathname);

  // Initialize i18n with the URL-based language
  useEffect(() => {
    if (i18n.isInitialized && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  // Change language by navigating to new URL (SEO-friendly)
  const changeLanguage = (newLanguage) => {
    if (newLanguage === language) return;
    
    // Replace current locale in path with new locale
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");
    const newPath = `/${newLanguage}${pathWithoutLocale || ""}`;
    
    router.push(newPath);
  };

  // Get locale for Strapi API requests
  const getLocale = () => {
    return language === "ar" ? "ar" : "en";
  };

  // Helper function for inline translations
  const t = (ar, en) => {
    return language === "ar" ? ar : en;
  };

  // Check if current language is RTL
  const isRTL = language === "ar";

  const value = useMemo(
    () => ({ language, changeLanguage, getLocale, t, isRTL }),
    [language, pathname]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
