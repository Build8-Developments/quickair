import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import PageHeader from "@/components/tours/PageHeader";
import TourList3 from "@/components/tours/TourList3";
import { generatePageMetadata } from "@/utils/seo";
import { getServerLocale } from "@/lib/locale";
import React from "react";

export async function generateMetadata() {
  const locale = await getServerLocale();
  return generatePageMetadata("tourList", locale);
}

export default function page() {
  return (
    <>
      <main>
        <Header3 />
        <PageHeader />
        <TourList3 />
        <FooterTwo />
      </main>
    </>
  );
}
