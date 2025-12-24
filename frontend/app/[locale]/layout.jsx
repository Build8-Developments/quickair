import ScrollToTop from "@/components/common/ScrollToTop";
import AIChatbot from "@/components/chatbot/AIChatbot";
import "../../public/css/style.css";
import "../../public/css/hero-search.css";
import "../../public/css/mega-menu-cards.css";
import "../../public/css/flight-search.css";
import "../../public/css/offer-skeleton.css";
import "../../public/css/hotel-skeleton.css";
import "../../public/css/faq-page.css";
import "../../styles/rtl-support.css";

import { Rubik } from "next/font/google";
import ScrollTopBehaviour from "@/components/common/ScrollTopBehavier";
import Wrapper from "@/components/layout/Wrapper";
import { LanguageProvider } from "@/contexts/LanguageContext";
import BootstrapClient from "@/components/common/BootstrapClient";
import { i18nConfig, getLocaleDirection } from "@/lib/i18n-config";
import { siteInfo, defaultSEO } from "@/data/seo";
import { notFound } from "next/navigation";

const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

// Generate static params for all locales
export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

// Generate metadata with hreflang and canonical
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const seo = defaultSEO[locale] || defaultSEO.en;
  const baseUrl = siteInfo.siteUrl;

  return {
    title: {
      default: seo.title,
      template: "%s | QuickAir",
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: siteInfo.siteName }],
    openGraph: {
      type: "website",
      siteName: siteInfo.siteName,
      url: `${baseUrl}/${locale}`,
      locale: locale === "ar" ? "ar_SA" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: siteInfo.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        ar: `${baseUrl}/ar`,
        "x-default": `${baseUrl}/en`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  // Validate locale
  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  const dir = getLocaleDirection(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* Hreflang tags for SEO */}
        <link rel="alternate" hrefLang="en" href={`${siteInfo.siteUrl}/en`} />
        <link rel="alternate" hrefLang="ar" href={`${siteInfo.siteUrl}/ar`} />
        <link rel="alternate" hrefLang="x-default" href={`${siteInfo.siteUrl}/en`} />
      </head>
      <body className={rubik.className} suppressHydrationWarning>
        <BootstrapClient />
        <LanguageProvider initialLanguage={locale}>
          <Wrapper>{children}</Wrapper>
          <AIChatbot />
          <ScrollToTop />
          <ScrollTopBehaviour />
        </LanguageProvider>
      </body>
    </html>
  );
}
