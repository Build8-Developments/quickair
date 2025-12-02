import ScrollToTop from "@/components/common/ScrollToTop";
import AIChatbot from "@/components/chatbot/AIChatbot";
import "../public/css/style.css";
import "../public/css/hero-search.css";
import "../public/css/mega-menu-cards.css";
import "../public/css/flight-search.css";
import "../public/css/offer-skeleton.css";
import "../public/css/hotel-skeleton.css";
import "../public/css/faq-page.css";
import "../styles/rtl-support.css";

import { Rubik } from "next/font/google";
import ScrollTopBehaviour from "@/components/common/ScrollTopBehavier";
import Wrapper from "@/components/layout/Wrapper";
import { LanguageProvider } from "@/contexts/LanguageContext";
import BootstrapClient from "@/components/common/BootstrapClient";
import { cookies } from "next/headers";
import { siteInfo, defaultSEO } from "@/data/seo";

const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

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

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value || "en";
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <html lang={language} dir={dir} suppressHydrationWarning>
      <head></head>
      <body className={rubik.className} suppressHydrationWarning>
        <BootstrapClient />
        <LanguageProvider initialLanguage={language}>
          <Wrapper>{children}</Wrapper>
          <AIChatbot />
          <ScrollToTop />
          <ScrollTopBehaviour />
        </LanguageProvider>
      </body>
    </html>
  );
}
