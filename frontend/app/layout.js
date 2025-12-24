/**
 * Root Layout - Minimal wrapper for locale-based routing
 * The actual layout with providers is in app/[locale]/layout.jsx
 * This file exists only to satisfy Next.js requirements
 */

import { siteInfo, defaultSEO } from "@/data/seo";

export const metadata = {
  title: {
    default: defaultSEO.en.title,
    template: "%s | QuickAir",
  },
  description: defaultSEO.en.description,
  keywords: defaultSEO.en.keywords,
  authors: [{ name: siteInfo.siteName }],
  openGraph: {
    type: "website",
    siteName: siteInfo.siteName,
    url: siteInfo.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    site: siteInfo.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  // This layout is minimal - the [locale] layout handles everything
  return children;
}
