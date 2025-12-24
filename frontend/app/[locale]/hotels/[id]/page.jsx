import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import { siteInfo } from "@/data/seo";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const baseUrl = siteInfo.siteUrl;

  // Fetch hotel data server-side for metadata
  // const hotel = await getHotelById({ id, locale });

  return {
    title: locale === "ar" ? `تفاصيل الفندق | QuickAir` : `Hotel Details | QuickAir`,
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
  // const hotel = await getHotelById({ id, locale });

  return (
    <>
      <main>
        <Header3 locale={locale} />
        {/* Hotel detail component */}
        <div className="hotel-detail-content">
          {/* Your hotel detail component here */}
        </div>
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
