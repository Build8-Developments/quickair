import { NextResponse } from "next/server";
import { i18nConfig } from "@/lib/i18n-config";

/**
 * Middleware for locale-based routing
 * Redirects requests without locale prefix to the default locale
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") // Files with extensions (images, css, etc.)
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = i18nConfig.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Detect preferred locale from Accept-Language header or use default
  const acceptLanguage = request.headers.get("accept-language") || "";
  let detectedLocale = i18nConfig.defaultLocale;

  // Check if Arabic is preferred
  if (acceptLanguage.toLowerCase().includes("ar")) {
    detectedLocale = "ar";
  }

  // Redirect to locale-prefixed URL
  const newUrl = new URL(`/${detectedLocale}${pathname}`, request.url);
  newUrl.search = request.nextUrl.search;

  return NextResponse.redirect(newUrl);
}

export const config = {
  // Match all paths except static files and API
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|img|css|fonts).*)"],
};
