import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import HotelsList from "@/components/hotels/HotelsList";
import PageHeader from "@/components/common/PageHeader";
import { getAllHotelsPaginated } from "@/lib/api/services/hotel";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";

// Force dynamic rendering to avoid build-time API calls
export const dynamic = "force-dynamic";

// Default page size for hotels list (Requirements: 2.3)
const PAGE_SIZE = 12;

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

export default async function HotelsPage({ params, searchParams }) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  // Extract page from searchParams (Requirements: 1.1, 1.2)
  const pageParam = resolvedSearchParams?.page;

  // Parse the page parameter - default to 1 if invalid (Requirements: 1.3, 1.4)
  // Non-numeric, negative, or zero values default to page 1
  let requestedPage = parseInt(pageParam, 10);
  if (isNaN(requestedPage) || requestedPage < 1) {
    requestedPage = 1;
  }

  // Fetch paginated data for the requested page
  let paginatedResult = await getAllHotelsPaginated({
    locale,
    page: requestedPage,
    pageSize: PAGE_SIZE,
  });

  // Handle case where requested page exceeds total pages (Requirements: 1.4)
  // If we got empty results but there are items in the database,
  // the user requested a page that doesn't exist - normalize to last valid page
  if (
    paginatedResult.items.length === 0 &&
    paginatedResult.total > 0 &&
    requestedPage > paginatedResult.totalPages
  ) {
    // Re-fetch the last valid page
    paginatedResult = await getAllHotelsPaginated({
      locale,
      page: paginatedResult.totalPages,
      pageSize: PAGE_SIZE,
    });
  }

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

        {/* Hotels List with server-side pagination data */}
        <HotelsList
          initialHotels={paginatedResult.items}
          totalCount={paginatedResult.total}
          currentPage={paginatedResult.page}
          totalPages={paginatedResult.totalPages}
          pageSize={paginatedResult.pageSize}
          isLoading={false}
          locale={locale}
        />

        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
