"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  // Load language from cookie or localStorage on mount
  useEffect(() => {
    // Check cookie first (for consistency with server)
    const cookieLanguage = document.cookie
      .split("; ")
      .find((row) => row.startsWith("language="))
      ?.split("=")[1];

    const savedLanguage = cookieLanguage || localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
      // Update HTML attributes
      document.documentElement.lang = savedLanguage;
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
    }
  }, []);

  // Save language to localStorage and update HTML attributes
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);

    // Also save to cookie for server components
    document.cookie = `language=${newLanguage}; path=/; max-age=31536000`; // 1 year

    // Update HTML lang attribute for accessibility
    document.documentElement.lang = newLanguage;
    // Update direction for RTL languages
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr";
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
