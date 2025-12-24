"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizedPath } from "@/lib/navigation";

/**
 * LocalizedLink - Automatically prefixes links with current locale
 * Use this instead of next/link for internal navigation
 * 
 * @example
 * <LocalizedLink href="/about">About Us</LocalizedLink>
 * // Renders as /en/about or /ar/about based on current locale
 */
export default function LocalizedLink({ href, children, locale: overrideLocale, ...props }) {
  const { language: currentLocale } = useLanguage();
  const targetLocale = overrideLocale || currentLocale;

  // If href already has locale prefix, use as-is
  if (href.match(/^\/(en|ar)(\/|$)/)) {
    return <Link href={href} {...props}>{children}</Link>;
  }

  // If it's an external link or anchor, use as-is
  if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
    return <Link href={href} {...props}>{children}</Link>;
  }

  // Add locale prefix
  const localizedHref = localizedPath(href, targetLocale);

  return <Link href={localizedHref} {...props}>{children}</Link>;
}
