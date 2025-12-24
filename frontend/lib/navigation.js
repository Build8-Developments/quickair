/**
 * Navigation utilities for locale-aware routing
 */

import { i18nConfig } from "./i18n-config";

/**
 * Create a localized path
 * @param {string} path - Path without locale (e.g., '/about')
 * @param {string} locale - Target locale
 * @returns {string} Localized path (e.g., '/en/about')
 */
export function localizedPath(path, locale) {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  // Remove any existing locale prefix
  const pathWithoutLocale = cleanPath.replace(/^(en|ar)\//, "").replace(/^(en|ar)$/, "");
  
  return `/${locale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ""}`;
}

/**
 * Get all localized versions of a path (for hreflang)
 * @param {string} path - Path without locale
 * @returns {object} Object with locale keys and full paths
 */
export function getAllLocalizedPaths(path) {
  const result = {};
  i18nConfig.locales.forEach((locale) => {
    result[locale] = localizedPath(path, locale);
  });
  result["x-default"] = localizedPath(path, i18nConfig.defaultLocale);
  return result;
}

/**
 * Extract path without locale prefix
 * @param {string} pathname - Full pathname (e.g., '/en/about')
 * @returns {string} Path without locale (e.g., '/about')
 */
export function getPathWithoutLocale(pathname) {
  const match = pathname.match(/^\/(en|ar)(\/.*)?$/);
  if (match) {
    return match[2] || "/";
  }
  return pathname;
}

/**
 * Extract locale from pathname
 * @param {string} pathname - Full pathname
 * @returns {string} Locale or default locale
 */
export function getLocaleFromPath(pathname) {
  const match = pathname.match(/^\/(en|ar)/);
  return match ? match[1] : i18nConfig.defaultLocale;
}
