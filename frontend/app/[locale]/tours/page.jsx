import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";
import { getAllOffers } from "@/lib/api/services/offer";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const metadata = generateLocalizedMetadata("tourList", locale);
  const baseUrl = siteInfo.siteUrl;

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/tours`,
      languages: {
        en: `${baseUrl}/en/tours`,
        ar: `${baseUrl}/ar/tours`,
        "x-default": `${baseUrl}/en/tours`,
      },
    },
  };
}

export default async function ToursPage({ params }) {
  const { locale } = await params;

  // Server-side data fetching with locale from URL
  const offers = await getAllOffers({ locale, limit: 100 });

  return (
    <>
      <main>
        <Header3 locale={locale} />
        {/* Tours list component - receives pre-fetched data */}
        <div className="tours-page-content">
          {/* Pass offers data to your tours list component */}
          {/* <ToursList offers={offers} locale={locale} /> */}
        </div>
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
