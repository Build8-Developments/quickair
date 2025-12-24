import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import OfferDetail from "@/components/tourSingle/pages/offerDetail";
import { getOfferById } from "@/lib/api/services/offer";
import { siteInfo } from "@/data/seo";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id, locale } = await params;

  // Fetch offer data server-side using locale from URL
  const offer = await getOfferById({ id, locale });

  if (!offer) {
    return {
      title: locale === "ar" ? "العرض غير موجود" : "Offer Not Found",
    };
  }

  const { title, location, month, year, seo, coverImage } = offer;
  const baseUrl = siteInfo.siteUrl;

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
      locale: locale === "ar" ? "ar_SA" : "en_US",
      images: [
        {
          url:
            coverImage?.url || seo?.metaImage?.url || "/img/default-offer.jpg",
          alt: coverImage?.alternativeText || title,
        },
      ],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/tours/${id}`,
      languages: {
        en: `${baseUrl}/en/tours/${id}`,
        ar: `${baseUrl}/ar/tours/${id}`,
        "x-default": `${baseUrl}/en/tours/${id}`,
      },
    },
  };
}

export default async function TourDetailPage({ params }) {
  const { id, locale } = await params;

  // Server-side data fetching with locale from URL params
  const offer = await getOfferById({ id, locale });

  if (!offer) {
    notFound();
  }

  return (
    <>
      <main>
        <Header3 locale={locale} />
        <OfferDetail offer={offer} locale={locale} />
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
