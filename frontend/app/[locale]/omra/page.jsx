import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import OmraPageContent from "@/components/pages/omra/OmraPageContent";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const metadata = generateLocalizedMetadata("omra", locale);
  const baseUrl = siteInfo.siteUrl;

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/omra`,
      languages: {
        en: `${baseUrl}/en/omra`,
        ar: `${baseUrl}/ar/omra`,
        "x-default": `${baseUrl}/en/omra`,
      },
    },
  };
}

export default async function OmraPage({ params }) {
  const { locale } = await params;

  return (
    <>
      <main style={{ overflowX: "hidden" }}>
        <Header3 locale={locale} />
        <div className="header-margin"></div>
        <OmraPageContent locale={locale} />
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
