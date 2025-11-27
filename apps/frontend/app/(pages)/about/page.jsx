import BrandsOne from "@/components/homes/brands/BrandsOne";
import FeaturesOne from "@/components/homes/features/FeaturesOne";
import FeturesTwo from "@/components/homes/features/FeturesTwo";
import TestimonialsThree from "@/components/homes/testimonials/TestimonialsThree";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import Banner from "@/components/pages/about/Banner";
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
        <Banner />
        <FeaturesOne />
        <div className="mt-60">
          <FeturesTwo />
        </div>
        <TestimonialsThree />
        <BrandsOne />
        <FooterTwo />
      </main>
    </>
  );
}
