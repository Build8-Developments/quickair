import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import HajPageContent from "@/components/pages/haj/HajPageContent";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const metadata = generateLocalizedMetadata("haj", locale);
  const baseUrl = siteInfo.siteUrl;

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/haj`,
      languages: {
        en: `${baseUrl}/en/haj`,
        ar: `${baseUrl}/ar/haj`,
        "x-default": `${baseUrl}/en/haj`,
      },
    },
  };
}

export default async function HajPage({ params }) {
  const { locale } = await params;

  return (
    <>
      <main style={{ overflowX: "hidden" }}>
        <Header3 locale={locale} />
        <div className="header-margin"></div>
        <HajPageContent locale={locale} />
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
