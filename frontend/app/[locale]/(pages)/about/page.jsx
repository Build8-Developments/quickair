import BrandsOne from "@/components/homes/brands/BrandsOne";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import Hero from "@/components/pages/about/Hero";
import Information from "@/components/pages/about/Information";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const metadata = generateLocalizedMetadata("about", locale);
  const baseUrl = siteInfo.siteUrl;

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
      languages: {
        en: `${baseUrl}/en/about`,
        ar: `${baseUrl}/ar/about`,
        "x-default": `${baseUrl}/en/about`,
      },
    },
  };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;

  return (
    <>
      <main>
        <Header3 locale={locale} />
        <div className="header-margin"></div>
        <Hero locale={locale} />
        <Information locale={locale} />
        <BrandsOne locale={locale} />
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
