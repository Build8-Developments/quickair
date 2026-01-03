import { Suspense } from "react";
import CreateTripFlow from "@/components/pages/createTrip/CreateTripFlow";
import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import { siteInfo } from "@/data/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = siteInfo.siteUrl;

  const titles = {
    en: "Create Your Dream Trip - QuickAir",
    ar: "أنشئ رحلة أحلامك - QuickAir",
  };

  const descriptions = {
    en: "Plan your perfect journey with our interactive trip builder. Get visa assistance, choose packages, set your budget, and explore amazing destinations.",
    ar: "خطط لرحلتك المثالية مع منشئ الرحلات التفاعلي. احصل على مساعدة التأشيرة، اختر الباقات، حدد ميزانيتك، واستكشف وجهات مذهلة.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: `${baseUrl}/${locale}/create-trip`,
      languages: {
        en: `${baseUrl}/en/create-trip`,
        ar: `${baseUrl}/ar/create-trip`,
        "x-default": `${baseUrl}/en/create-trip`,
      },
    },
  };
}

export default async function CreateTripPage({ params }) {
  const { locale } = await params;

  return (
    <>
      <Header3 locale={locale} />
      <div className="header-margin"></div>
      <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
        <CreateTripFlow locale={locale} />
      </Suspense>
      <FooterTwo locale={locale} />
    </>
  );
}
