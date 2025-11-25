"use client";
import { createContext, useContext, useState, useEffect } from "react";
import i18n from "@/lib/i18n";

const LanguageContext = createContext();

// Read language from cookie synchronously (not in useEffect)
const getInitialLanguage = () => {
  if (typeof window === "undefined") return "en";

  const cookieLanguage = document.cookie
    .split("; ")
    .find((row) => row.startsWith("language="))
    ?.split("=")[1];

  return cookieLanguage || localStorage.getItem("language") || "en";
};

export function LanguageProvider({ children, initialLanguage }) {
  const [language, setLanguage] = useState(
    initialLanguage || getInitialLanguage()
  );

  // Initialize i18n and HTML attributes on mount
  useEffect(() => {
    if (i18n.isInitialized) {
      i18n.changeLanguage(language);
    }
    // Update HTML attributes
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  // Save language to localStorage and reload page
  const changeLanguage = (newLanguage) => {
    // Save to localStorage
    localStorage.setItem("language", newLanguage);

    // Save to cookie for server components
    document.cookie = `language=${newLanguage}; path=/; max-age=31536000`; // 1 year

    // Force full page reload to ensure all components re-render with new language
    window.location.reload();
  };

  // Get locale for Strapi API requests
  const getLocale = () => {
    return language === "ar" ? "ar" : "en";
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, getLocale }}>
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
