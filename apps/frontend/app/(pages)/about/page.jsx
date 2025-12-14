import BrandsOne from "@/components/homes/brands/BrandsOne";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import Hero from "@/components/pages/about/Hero";
import Information from "@/components/pages/about/Information";
import { generatePageMetadata } from "@/utils/seo";
import { getServerLocale } from "@/lib/locale";
import React from "react";

export async function generateMetadata() {
  const locale = await getServerLocale();
  return generatePageMetadata("about", locale);
}

export default function page() {
  return (
    <>
      <main>
        <Header3 />
        <Hero />
        <Information />
        <BrandsOne />
        <FooterTwo />
      </main>
    </>
  );
}
