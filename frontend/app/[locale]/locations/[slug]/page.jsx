import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import { siteInfo } from "@/data/seo";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const baseUrl = siteInfo.siteUrl;

  // You can fetch location data here for dynamic metadata
  return {
    title: locale === "ar" ? `${slug} | QuickAir` : `${slug} | QuickAir`,
    alternates: {
      canonical: `${baseUrl}/${locale}/locations/${slug}`,
      languages: {
        en: `${baseUrl}/en/locations/${slug}`,
        ar: `${baseUrl}/ar/locations/${slug}`,
        "x-default": `${baseUrl}/en/locations/${slug}`,
      },
    },
  };
}

export default async function LocationPage({ params }) {
  const { slug, locale } = await params;

  // Fetch location data server-side with locale
  // const location = await getLocationBySlug(slug, locale);

  return (
    <>
      <main>
        <Header3 locale={locale} />
        {/* Location content component */}
        <div className="location-page-content">
          {/* Your location component here */}
        </div>
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
