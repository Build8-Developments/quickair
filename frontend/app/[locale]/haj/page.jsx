import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import PageHero from "@/components/common/PageHero";
import HajPageContent from "@/components/pages/haj/HajPageContent";
import { PilgrimageContentProvider } from "@/contexts/PilgrimageContentContext";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";
import { pilgrimageAPI } from "@/services/api";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const metadata = generateLocalizedMetadata("haj", locale);
  const baseUrl = siteInfo.siteUrl;

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/haj`,
      languages: {
        en: `${baseUrl}/en/haj`,
        ar: `${baseUrl}/ar/haj`,
        "x-default": `${baseUrl}/en/haj`,
      },
    },
  };
}

async function getHajPageData(locale) {
  try {
    return (await pilgrimageAPI.getHajPage(locale)) || null;
  } catch (error) {
    console.error("Error fetching Haj page from Strapi:", error);
    return null;
  }
}

export default async function HajPage({ params }) {
  const { locale } = await params;
  const pageData = await getHajPageData(locale);
  const hero = pageData?.content?.hero;

  return (
    <>
      <main style={{ overflowX: "hidden" }}>
        <Header3 locale={locale} />
        <PageHero
          locale={locale}
          title={hero?.title || (locale === "ar" ? "الحج" : "Hajj")}
          badge={hero?.date || (locale === "ar" ? "رحلة مقدسة" : "Sacred Journey")}
          image="/img/about-bg.webp"
          description={
            hero?.subtitle ||
            (locale === "ar"
              ? "برامج حج متكاملة بإشراف متخصص وخبرة طويلة في خدمة ضيوف الرحمن."
              : "Comprehensive Hajj programs with expert supervision and long-standing pilgrimage experience.")
          }
          icon="about"
        />
        <PilgrimageContentProvider
          namespace="haj"
          content={pageData?.content ?? null}
          media={pageData?.media ?? null}
        >
          <HajPageContent locale={locale} />
        </PilgrimageContentProvider>
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
