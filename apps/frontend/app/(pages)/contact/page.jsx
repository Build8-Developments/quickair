import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import ContactForm from "@/components/pages/contact/ContactForm";
import Locations from "@/components/pages/contact/Locations";
import Map from "@/components/pages/contact/Map";
import { generatePageMetadata } from "@/utils/seo";
import { getServerLocale } from "@/lib/locale";
import React from "react";

export async function generateMetadata() {
  const locale = await getServerLocale();
  return generatePageMetadata("contact", locale);
}

export default function page() {
  return (
    <>
      <main>
        <Header3 />
        <Map />
        <Locations />
        <ContactForm />

        <FooterTwo />
      </main>
    </>
  );
}
