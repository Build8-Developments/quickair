import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import HotelDetail from "@/components/tourSingle/pages/HotelDetail";
import { getHotelWithOffer } from "@/lib/api/services/hotel";
import { siteInfo } from "@/data/seo";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const baseUrl = siteInfo.siteUrl;

  // Fetch hotel data server-side for metadata
  const data = await getHotelWithOffer({ id, locale });
  const hotel = data?.hotel;

  if (!hotel) {
    return {
      title: locale === "ar" ? "الفندق غير موجود" : "Hotel Not Found",
    };
  }

  return {
    title: hotel.seo?.metaTitle || `${hotel.name} | QuickAir`,
    description:
      hotel.seo?.metaDescription ||
      hotel.shortDescription ||
      `Explore ${hotel.name} - ${hotel.location?.name || "destination"}`,
    keywords:
      hotel.seo?.keywords ||
      `${hotel.name}, ${hotel.location?.name}, hotel, accommodation`,
    openGraph: {
      title: hotel.seo?.metaTitle || hotel.name,
      description: hotel.seo?.metaDescription || hotel.shortDescription,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      images: [
        {
          url:
            hotel.coverImage?.url ||
            hotel.seo?.metaImage?.url ||
            "/img/default-hotel.jpg",
          alt: hotel.coverImage?.alternativeText || hotel.name,
        },
      ],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/hotels/${id}`,
      languages: {
        en: `${baseUrl}/en/hotels/${id}`,
        ar: `${baseUrl}/ar/hotels/${id}`,
        "x-default": `${baseUrl}/en/hotels/${id}`,
      },
    },
  };
}

export default async function HotelDetailPage({ params }) {
  const { id, locale } = await params;

  // Server-side data fetching with locale from URL params
  const data = await getHotelWithOffer({ id, locale });

  if (!data?.hotel) {
    notFound();
  }

  const { hotel, offer, hotelOption } = data;

  return (
    <>
      <main>
        <Header3 locale={locale} />
        <div className="header-margin"></div>
        <HotelDetail hotel={hotel} offer={offer} hotelOption={hotelOption} />
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
