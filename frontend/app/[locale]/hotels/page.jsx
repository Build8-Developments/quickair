import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import HotelsList from "@/components/hotels/HotelsList";
import PageHeader from "@/components/common/PageHeader";
import { getAllHotels } from "@/lib/api/services/hotel";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";

// Force dynamic rendering to avoid build-time API calls
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const metadata = generateLocalizedMetadata("hotelsList", locale);
  const baseUrl = siteInfo.siteUrl;

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/hotels`,
      languages: {
        en: `${baseUrl}/en/hotels`,
        ar: `${baseUrl}/ar/hotels`,
        "x-default": `${baseUrl}/en/hotels`,
      },
    },
  };
}

export default async function HotelsPage({ params }) {
  const { locale } = await params;
  const isRTL = locale === "ar";

  // Server-side data fetching with locale from URL
  const hotels = await getAllHotels({ locale });

  const pageTitle = locale === "ar" ? "الفنادق الفاخرة" : "Premium Hotels";

  const pageDescription =
    locale === "ar"
      ? "استكشف مجموعتنا المنتقاة من الفنادق الفاخرة حول العالم"
      : "Explore our curated collection of premium hotels worldwide";

  return (
    <>
      <main style={{ overflowX: "hidden" }}>
        <Header3 locale={locale} />
        <div className="header-margin"></div>

        <PageHeader
          icon="hotels"
          title={pageTitle}
          description={pageDescription}
        />

        {/* Hotels List */}
        <HotelsList
          initialHotels={hotels}
          totalCount={hotels.length}
          isLoading={false}
          locale={locale}
        />

        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
