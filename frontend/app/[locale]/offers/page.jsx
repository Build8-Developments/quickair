import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import OffersList from "@/components/offers/OffersList";
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
        <div className="header-margin"></div>
        <Header3 locale={locale} />

        {/* Page Header */}
        <section className="pageHeader -type-3">
          <div className="pageHeader__bg">
            <div className="bg-image js-lazy"></div>
          </div>

          <div className="container">
            <div className="row justify-center">
              <div className="col-12">
                <div
                  className="pageHeader__content"
                  style={{ textAlign: isRTL ? "right" : "left" }}
                >
                  <h1 className="pageHeader__title">{pageTitle}</h1>
                  <p className="pageHeader__text">{pageDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
