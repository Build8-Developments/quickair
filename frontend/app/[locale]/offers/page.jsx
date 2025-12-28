import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import OffersList from "@/components/offers/OffersList";
import PageHeader from "@/components/common/PageHeader";
import { getAllOffersPaginated } from "@/lib/api/services/offer";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";

// Force dynamic rendering to avoid build-time API calls
export const dynamic = "force-dynamic";

// Default page size for offers list (Requirements: 2.4)
const PAGE_SIZE = 12;

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

export default async function OffersPage({ params, searchParams }) {
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

  // Fetch paginated data for the requested page (Requirements: 2.4)
  let paginatedResult = await getAllOffersPaginated({
    locale,
    page: requestedPage,
    pageSize: PAGE_SIZE,
    sort: "createdAt:desc",
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
    paginatedResult = await getAllOffersPaginated({
      locale,
      page: paginatedResult.totalPages,
      pageSize: PAGE_SIZE,
      sort: "createdAt:desc",
    });
  }

  const pageTitle =
    locale === "ar" ? "عروض السفر الحصرية" : "Exclusive Travel Offers";

  const pageDescription =
    locale === "ar"
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

        {/* Offers List with server-side pagination data */}
        <OffersList
          initialOffers={paginatedResult.items}
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
