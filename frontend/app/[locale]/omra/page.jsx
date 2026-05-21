import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import PageHero from "@/components/common/PageHero";
import OmraPageContent from "@/components/pages/omra/OmraPageContent";
import { PilgrimageContentProvider } from "@/contexts/PilgrimageContentContext";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";
import { pilgrimageAPI } from "@/services/api";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const metadata = generateLocalizedMetadata("omra", locale);
  const baseUrl = siteInfo.siteUrl;

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/omra`,
      languages: {
        en: `${baseUrl}/en/omra`,
        ar: `${baseUrl}/ar/omra`,
        "x-default": `${baseUrl}/en/omra`,
      },
    },
  };
}

async function getUmrahPageData(locale) {
  try {
    return (await pilgrimageAPI.getUmrahPage(locale)) || null;
  } catch (error) {
    console.error("Error fetching Umrah page from Strapi:", error);
    return null;
  }
}

export default async function OmraPage({ params }) {
  const { locale } = await params;
  const pageData = await getUmrahPageData(locale);
  const hero = pageData?.content?.hero;

  return (
    <>
      <main style={{ overflowX: "hidden" }}>
        <Header3 locale={locale} />
        <PageHero
          locale={locale}
          title={hero?.title || (locale === "ar" ? "العمرة" : "Umrah")}
          badge={hero?.season || (locale === "ar" ? "رحلة روحانية" : "Spiritual Journey")}
          image="/img/about-bg.webp"
          description={
            hero?.subtitle ||
            (locale === "ar"
              ? "باقات عمرة مرنة وخدمات متكاملة لتجربة مريحة ومطمئنة."
              : "Flexible Umrah packages and complete services for a calm, comfortable journey.")
          }
          icon="about"
        />
        <PilgrimageContentProvider
          namespace="omra"
          content={pageData?.content}
          media={pageData?.media}
        >
          <OmraPageContent locale={locale} />
        </PilgrimageContentProvider>
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
