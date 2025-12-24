"use client";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcherButton() {
  const { language, changeLanguage } = useLanguage();

  const handleToggle = () => {
    changeLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <button
      onClick={handleToggle}
      className="language-switcher-btn"
      aria-label="Switch Language"
    >
      <span className={`lang-option ${language === "en" ? "active" : ""}`}>
        EN
      </span>
      <span className="separator">|</span>
      <span className={`lang-option ${language === "ar" ? "active" : ""}`}>
        AR
      </span>
    </button>
  );
}
