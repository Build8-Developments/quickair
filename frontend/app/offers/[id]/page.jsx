import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import OfferDetail from "@/components/tourSingle/pages/offerDetail";
import { getOfferById } from "@/lib/api/services/offer";
import { getServerLocale } from "@/lib/locale";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const locale = await getServerLocale();
  const offer = await getOfferById({ id, locale });

  if (!offer) {
    return {
      title: "Offer Not Found",
    };
  }

  const { title, location, month, year, seo, coverImage } = offer;

  return {
    title: seo?.metaTitle || `${title} - ${month} ${year} | QuickAir`,
    description:
      seo?.metaDescription ||
      `Explore our exclusive travel package to ${
        location?.name || "destination"
      } for ${month} ${year}`,
    keywords:
      seo?.keywords ||
      `${location?.name}, ${month}, ${year}, travel packages, vacation`,
    openGraph: {
      title: seo?.metaTitle || title,
      description: seo?.metaDescription,
      images: [
        {
          url:
            coverImage?.url || seo?.metaImage?.url || "/img/default-offer.jpg",
          alt: coverImage?.alternativeText || title,
        },
      ],
    },
  };
}

export default async function page(props) {
  const params = await props.params;
  const { id } = params;
  const locale = await getServerLocale();

  // Fetch offer from Strapi with current locale
  const offer = await getOfferById({ id, locale });

  if (!offer) {
    notFound();
  }

  return (
    <>
      <main>
        <Header3 />
        <OfferDetail offer={offer} />
        <FooterTwo />
      </main>
    </>
  );
}
