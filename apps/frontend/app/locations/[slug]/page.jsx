import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import { getLocationBySlug } from "@/lib/api/services/location";
import { getServerLocale } from "@/lib/locale";
import { getStrapiURL } from "@/lib/strapi";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const location = await getLocationBySlug({ slug, locale });

  if (!location) {
    return {
      title: "Location Not Found",
    };
  }

  const { name, shortDescription, seo, image } = location;

  return {
    title: seo?.metaTitle || `${name} - Travel Offers | QuickAir`,
    description:
      seo?.metaDescription ||
      shortDescription ||
      `Explore amazing travel offers to ${name}`,
    keywords: seo?.keywords,
    openGraph: {
      title: seo?.metaTitle || name,
      description: seo?.metaDescription || shortDescription,
      images: [
        {
          url: image?.url || "/img/default-location.jpg",
          alt: image?.alternativeText || name,
        },
      ],
    },
  };
}

export default async function LocationPage({ params }) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const location = await getLocationBySlug({ slug, locale });

  if (!location) {
    notFound();
  }

  const { name, type, country, description, shortDescription, image, offers } =
    location;
  const locationOffers = offers || [];

  return (
    <>
      <main>
        <Header3 />

        {/* Page Header */}
        <section className="pageHeader -type-3">
          <div className="pageHeader__bg">
            {image?.data && (
              <Image
                width={1920}
                height={400}
                src={image.data.attributes.url}
                alt={image.data.attributes.alternativeText || name}
                className="img-ratio"
                priority
              />
            )}
          </div>
          <div className="container">
            <div className="row justify-center">
              <div className="col-auto">
                <div className="pageHeader__content">
                  <h1 className="pageHeader__title">{name}</h1>
                  <p className="pageHeader__text">
                    {type && country
                      ? `${type} in ${country}`
                      : type || country || "Destination"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Info */}
        {(description || shortDescription) && (
          <section className="layout-pt-md layout-pb-md">
            <div className="container">
              <div className="row justify-center">
                <div className="col-lg-8">
                  <div className="text-center">
                    {shortDescription && (
                      <h2 className="text-30 fw-600 mb-20">
                        {shortDescription}
                      </h2>
                    )}
                    {description && (
                      <p className="text-dark-1">{description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Offers for this Location */}
        <section className="layout-pt-md layout-pb-lg">
          <div className="container">
            <div className="row y-gap-20 justify-between items-end">
              <div className="col-auto">
                <h2 className="text-30 fw-600">Available Offers in {name}</h2>
                <p className="text-dark-1 mt-5">
                  {locationOffers.length}{" "}
                  {locationOffers.length === 1 ? "offer" : "offers"} available
                </p>
              </div>
            </div>

            <div className="row y-gap-30 pt-30">
              {locationOffers.length === 0 ? (
                <div className="col-12">
                  <div className="text-center py-60">
                    <h3 className="text-24 fw-500 mb-10">
                      No offers available yet
                    </h3>
                    <p className="text-dark-1">
                      Check back soon for amazing deals to {name}!
                    </p>
                    <Link
                      href="/tours-list"
                      className="button -md -accent-1 text-white mt-30"
                    >
                      Browse All Offers
                      <i className="icon-arrow-top-right text-16 ml-10"></i>
                    </Link>
                  </div>
                </div>
              ) : (
                locationOffers.map((offer) => (
                  <div key={offer.documentId} className="col-lg-4 col-md-6">
                    <Link
                      href={`/tours/${offer.documentId}`}
                      className="tourCard -type-1 py-10 px-10 border-1 rounded-12 -hover-shadow"
                    >
                      <div className="tourCard__header">
                        <div className="tourCard__image ratio ratio-28:20">
                          {offer.coverImage && (
                            <Image
                              width={421}
                              height={301}
                              src={getStrapiURL(offer.coverImage.url)}
                              alt={
                                offer.coverImage.alternativeText || offer.title
                              }
                              className="img-ratio rounded-12"
                            />
                          )}
                        </div>
                      </div>

                      <div className="tourCard__content px-10 pt-10">
                        <h3 className="tourCard__title text-18 fw-500 mt-5">
                          {offer.title}
                        </h3>

                        <div className="tourCard__meta mt-10">
                          <div className="d-flex items-center text-13 text-light-2">
                            <i className="icon-calendar mr-5"></i>
                            {offer.month} {offer.year}
                          </div>
                        </div>

                        {offer.hotelOptions?.[0]?.hotel && (
                          <div className="tourCard__info mt-10">
                            <div className="text-13 text-light-2">
                              <i className="icon-bed mr-5"></i>
                              {offer.hotelOptions[0].hotel.name}
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <FooterTwo />
      </main>
    </>
  );
}
