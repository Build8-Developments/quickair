/**
 * Internationalization Configuration
 * Central config for supported locales and default locale
 */

export const i18nConfig = {
  defaultLocale: "en",
  locales: ["en", "ar"],
};

export const localeNames = {
  en: "English",
  ar: "العربية",
};

export const localeDirections = {
  en: "ltr",
  ar: "rtl",
};

/**
 * Check if a locale is valid
 * @param {string} locale - Locale to check
 * @returns {boolean}
 */
export function isValidLocale(locale) {
  return i18nConfig.locales.includes(locale);
}

/**
 * Get the direction for a locale
 * @param {string} locale - Locale code
 * @returns {string} 'ltr' or 'rtl'
 */
export function getLocaleDirection(locale) {
  return localeDirections[locale] || "ltr";
}

/**
 * Get alternate locale
 * @param {string} currentLocale - Current locale
 * @returns {string} The other locale
 */
export function getAlternateLocale(currentLocale) {
  return currentLocale === "ar" ? "en" : "ar";
}
