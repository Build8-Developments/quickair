/**
 * Server-side locale utilities
 * Get current locale from cookies for server components
 */

import { cookies } from "next/headers";

/**
 * Get current locale from cookies
 * Falls back to 'en' if not set
 * @returns {Promise<string>} Current locale ('en' or 'ar')
 */
export async function getServerLocale() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("language")?.value;
  return locale === "ar" ? "ar" : "en";
}
