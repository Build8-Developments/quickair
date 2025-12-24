"use client";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { i18nConfig, localeNames, getAlternateLocale } from "@/lib/i18n-config";

/**
 * SEO-friendly Language Switcher
 * Changes URL path to switch language - no localStorage
 */
export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { language: locale } = useLanguage();

  /**
   * Get the path for a different locale
   * Replaces the current locale segment with the new one
   */
  const getLocalizedPath = (newLocale) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");
    // Return new path with new locale
    return `/${newLocale}${pathWithoutLocale || ""}`;
  };

  const handleLanguageChange = (newLocale) => {
    if (newLocale === locale) return;
    const newPath = getLocalizedPath(newLocale);
    router.push(newPath);
  };

  const alternateLocale = getAlternateLocale(locale);

  return (
    <button
      onClick={() => handleLanguageChange(alternateLocale)}
      className="language-switcher-btn"
      aria-label={`Switch to ${localeNames[alternateLocale]}`}
    >
      <span className={`lang-option ${locale === "en" ? "active" : ""}`}>
        EN
      </span>
      <span className="separator">|</span>
      <span className={`lang-option ${locale === "ar" ? "active" : ""}`}>
        AR
      </span>
    </button>
  );
}

/**
 * Language Switcher as Links (better for SEO - crawlable)
 * Use this version if you want search engines to discover alternate language pages
 */
export function LanguageSwitcherLinks() {
  const pathname = usePathname();
  const { language: locale } = useLanguage();

  const getLocalizedPath = (newLocale) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");
    return `/${newLocale}${pathWithoutLocale || ""}`;
  };

  return (
    <div className="language-switcher-links">
      {i18nConfig.locales.map((loc) => (
        <a
          key={loc}
          href={getLocalizedPath(loc)}
          className={`lang-link ${locale === loc ? "active" : ""}`}
          hrefLang={loc}
          aria-current={locale === loc ? "true" : undefined}
        >
          {localeNames[loc]}
        </a>
      ))}
    </div>
  );
}
