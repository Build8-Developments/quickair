import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import OffersList from "@/components/offers/OffersList";
import PageHeader from "@/components/common/PageHeader";
import { getAllOffers } from "@/lib/api/services/offer";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const metadata = generateLocalizedMetadata("offersList", locale);
  const baseUrl = siteInfo.siteUrl;

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/offers`,
      languages: {
        en: `${baseUrl}/en/offers`,
        ar: `${baseUrl}/ar/offers`,
        "x-default": `${baseUrl}/en/offers`,
      },
    },
  };
}

export default async function OffersPage({ params }) {
  const { locale } = await params;
  const isRTL = locale === "ar";

  // Server-side data fetching with locale from URL
  const offers = await getAllOffers({
    locale,
    limit: 100,
    sort: "createdAt:desc",
  });

  const pageTitle = locale === "ar" 
    ? "عروض السفر الحصرية" 
    : "Exclusive Travel Offers";
  
  const pageDescription = locale === "ar"
    ? "اكتشف مجموعتنا المختارة من عروض السفر الحصرية وباقات العطلات"
    : "Discover our handpicked selection of exclusive travel offers and vacation packages";

  return (
    <>
      <main style={{ overflowX: "hidden" }}>
        <Header3 locale={locale} />
        <div className="header-margin"></div>

        <PageHeader
          icon="offers"
          title={pageTitle}
          description={pageDescription}
        />

        {/* Offers List */}
        <OffersList
          initialOffers={offers}
          totalCount={offers.length}
          isLoading={false}
          locale={locale}
        />

        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
