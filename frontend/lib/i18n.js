import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import translationEN from "../locales/en/translation.json";
import translationAR from "../locales/ar/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  ar: {
    translation: translationAR,
  },
};

// Initialize i18n for both server and client
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    react: {
      useSuspense: false, // Disable suspense for SSR
    },
  });
}

export default i18n;
