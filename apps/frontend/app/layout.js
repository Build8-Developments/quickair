import ScrollToTop from "@/components/common/ScrollToTop";
import "../public/css/style.css";
import "../public/css/hero-search.css";

import { Rubik } from "next/font/google";
import ScrollTopBehaviour from "@/components/common/ScrollTopBehavier";
import Wrapper from "@/components/layout/Wrapper";
import { LanguageProvider } from "@/contexts/LanguageContext";

const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

if (typeof window !== "undefined") {
  import("bootstrap");
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head></head>
      <body className={rubik.className}>
        <LanguageProvider>
          <Wrapper>{children}</Wrapper>
          <ScrollToTop />
          <ScrollTopBehaviour />
        </LanguageProvider>
      </body>
    </html>
  );
}
