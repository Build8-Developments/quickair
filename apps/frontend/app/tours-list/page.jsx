import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import PageHeader from "@/components/tours/PageHeader";
import TourList3 from "@/components/tours/TourList3";
import React from "react";

export const metadata = {
  title: "Tour-list-4 || ViaTour - Travel & Tour React NextJS Template",
  description: "ViaTour - Travel & Tour React NextJS Template",
};

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
