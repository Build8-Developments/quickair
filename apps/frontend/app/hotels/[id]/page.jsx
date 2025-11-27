import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import HotelDetail from "@/components/tourSingle/pages/HotelDetail";
import { getHotelWithOffer } from "@/lib/api/services/hotel";
import { getServerLocale } from "@/lib/locale";
import { getStrapiURL } from "@/lib/strapi";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const locale = await getServerLocale();
  const data = await getHotelWithOffer({ id, locale });

  if (!data || !data.hotel) {
    return {
      title: "Hotel Not Found",
    };
  }

  const { hotel, offer } = data;
  const { name, location, stars, seo, coverImage } = hotel;

  return {
    title:
      seo?.metaTitle ||
      `${name} - ${stars} Star Hotel in ${
        location?.name || "Destination"
      } | QuickAir`,
    description:
      seo?.metaDescription ||
      `Book your stay at ${name}, a ${stars} star hotel in ${
        location?.name || "the best destination"
      }${offer ? ` - Available for ${offer.month} ${offer.year}` : ""}`,
    keywords:
      seo?.keywords ||
      `${name}, ${location?.name}, ${stars} star hotel, hotel booking, accommodation`,
    openGraph: {
      title: seo?.metaTitle || name,
      description: seo?.metaDescription,
      images: [
        {
          url: getStrapiURL(
            coverImage?.url || seo?.metaImage?.url || "/img/default-hotel.jpg"
          ),
          alt: coverImage?.alternativeText || name,
        },
      ],
    },
  };
}

export default async function page(props) {
  const params = await props.params;
  const { id } = params;
  const locale = await getServerLocale();

  // Fetch hotel with its offer from Strapi with current locale
  const data = await getHotelWithOffer({ id, locale });

  if (!data || !data.hotel) {
    notFound();
  }

  const { hotel, offer, hotelOption } = data;

  return (
    <>
      <main>
        <Header3 />
        <HotelDetail hotel={hotel} offer={offer} hotelOption={hotelOption} />
        <FooterTwo />
      </main>
    </>
  );
}
