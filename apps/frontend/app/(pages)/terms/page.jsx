import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import Content from "@/components/pages/terms/Content";
import PageHeader from "@/components/pages/terms/PageHeader";
import { generatePageMetadata } from "@/utils/seo";
import { getServerLocale } from "@/lib/locale";
import React from "react";

export async function generateMetadata() {
  const locale = await getServerLocale();
  return generatePageMetadata("terms", locale);
}

export default function page() {
  return (
    <>
      <main>
        <Header3 />
        <PageHeader />
        <Content />
        <FooterTwo />
      </main>
    </>
  );
}
