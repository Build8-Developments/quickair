import BrandsOne from "@/components/homes/brands/BrandsOne";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import PageHero from "@/components/common/PageHero";
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
        <PageHero
          locale={locale}
          title={locale === "ar" ? "نحن Quick Air Travel" : "About Quick Air"}
          badge={locale === "ar" ? "منذ 1986" : "Since 1986"}
          image="/img/about-bg.webp"
          description={
            locale === "ar"
              ? "شريكك الموثوق في السفر منذ أكثر من 38 عاماً. نقدم خدمات سياحية متكاملة بمعايير عالمية."
              : "Your trusted travel partner for over 38 years, delivering world-class tourism services."
          }
          icon="about"
        />
        <Information locale={locale} />
        <BrandsOne locale={locale} />
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
