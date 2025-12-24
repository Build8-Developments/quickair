/**
 * Server-side locale utilities
 * For URL-based localization - locale comes from route params
 * 
 * @deprecated Use params.locale from page/layout props instead
 * This file is kept for backward compatibility during migration
 */

import { headers } from "next/headers";
import { i18nConfig } from "./i18n-config";

/**
 * Get current locale from URL path (server-side)
 * Extracts locale from the pathname in the request headers
 * @returns {Promise<string>} Current locale ('en' or 'ar')
 * @deprecated Pass locale from params.locale in page components instead
 */
export async function getServerLocale() {
  try {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || headersList.get("x-invoke-path") || "";
    
    // Extract locale from pathname (e.g., /en/about -> en)
    const match = pathname.match(/^\/(en|ar)/);
    if (match) {
      return match[1];
    }
  } catch (error) {
    // Fallback if headers not available
  }
  
  return i18nConfig.defaultLocale;
}
