import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import PageHeader from "@/components/tours/PageHeader";
import TourList3 from "@/components/tours/TourList3";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const metadata = generateLocalizedMetadata("tourList", locale);
  const baseUrl = siteInfo.siteUrl;

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/tours-list`,
      languages: {
        en: `${baseUrl}/en/tours-list`,
        ar: `${baseUrl}/ar/tours-list`,
        "x-default": `${baseUrl}/en/tours-list`,
      },
    },
  };
}

export default async function ToursListPage({ params }) {
  const { locale } = await params;

  return (
    <>
      <main>
        <Header3 locale={locale} />
        <div className="header-margin"></div>
        <PageHeader locale={locale} />
        <TourList3 locale={locale} />
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
