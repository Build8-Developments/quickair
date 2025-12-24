import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import FaqHero from "@/components/pages/faq/FaqHero";
import FaqContent from "@/components/pages/faq/FaqContent";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const metadata = generateLocalizedMetadata("faq", locale);
  const baseUrl = siteInfo.siteUrl;

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/faq`,
      languages: {
        en: `${baseUrl}/en/faq`,
        ar: `${baseUrl}/ar/faq`,
        "x-default": `${baseUrl}/en/faq`,
      },
    },
  };
}

export default async function FaqPage({ params }) {
  const { locale } = await params;

  return (
    <>
      <main>
        <Header3 locale={locale} />
        <FaqHero locale={locale} />
        <FaqContent locale={locale} />
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
