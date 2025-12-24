import { LanguageProvider } from "@/contexts/LanguageContext";
import BootstrapClient from "@/components/common/BootstrapClient";
import ScrollToTop from "@/components/common/ScrollToTop";
import ScrollTopBehaviour from "@/components/common/ScrollTopBehavier";
import Wrapper from "@/components/layout/Wrapper";

import "../../public/css/style.css";
import "../../styles/rtl-support.css";

import { Rubik } from "next/font/google";

const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

/**
 * Layout for legacy pages outside [locale] route
 * Provides LanguageProvider with default English locale
 */
export default function PagesLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body className={rubik.className}>
        <BootstrapClient />
        <LanguageProvider initialLanguage="en">
          <Wrapper>{children}</Wrapper>
          <ScrollToTop />
          <ScrollTopBehaviour />
        </LanguageProvider>
      </body>
    </html>
  );
}
