"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

export default function BodyContent({ children }) {
  const { language } = useLanguage();

  useEffect(() => {
    // Apply the appropriate font class based on language
    const fontClass = language === "ar" ? "font-arabic" : "font-english";
    document.documentElement.setAttribute("data-font", fontClass);
  }, [language]);

  return <>{children}</>;
}
