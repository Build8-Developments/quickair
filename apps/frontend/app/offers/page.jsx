import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import OffersList from "@/components/offers/OffersList";
import { getAllOffers } from "@/lib/api/services/offer";
import { getServerLocale } from "@/lib/locale";

export const metadata = {
  title: "Travel Offers & Packages | QuickAir",
  description:
    "Browse our exclusive travel offers and vacation packages. Find the best deals on flights, hotels, and complete holiday packages to destinations worldwide.",
  keywords:
    "travel offers, vacation packages, travel deals, holiday packages, cheap flights, hotel deals",
  openGraph: {
    title: "Travel Offers & Packages | QuickAir",
    description:
      "Browse our exclusive travel offers and vacation packages. Find the best deals to destinations worldwide.",
    images: [
      {
        url: "/img/offers/offers-banner.jpg",
        alt: "QuickAir Travel Offers",
      },
    ],
  },
};

export default async function OffersPage() {
  const locale = await getServerLocale();

  // Fetch all offers from Strapi
  const offers = await getAllOffers({
    locale,
    limit: 100,
    sort: "createdAt:desc",
  });

  return (
    <>
      <main style={{ overflowX: "hidden" }}>
        <div className="header-margin"></div>
        <Header3 />

        {/* Page Header */}
        <section className="pageHeader -type-3">
          <div className="pageHeader__bg">
            <div className="bg-image js-lazy"></div>
          </div>

          <div className="container">
            <div className="row justify-center">
              <div className="col-12">
                <div className="pageHeader__content">
                  <h1 className="pageHeader__title">
                    Travel Offers & Packages
                  </h1>

                  <p className="pageHeader__text">
                    Discover our handpicked selection of exclusive travel offers
                    and vacation packages
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Offers List */}
        <OffersList initialOffers={offers} totalCount={offers.length} />

        <FooterTwo />
      </main>
    </>
  );
}
