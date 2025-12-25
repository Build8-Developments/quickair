import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import BranchesPageContent from "@/components/pages/branches/BranchesPageContent";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const metadata = generateLocalizedMetadata("branches", locale);
  const baseUrl = siteInfo.siteUrl;

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/branches`,
      languages: {
        en: `${baseUrl}/en/branches`,
        ar: `${baseUrl}/ar/branches`,
        "x-default": `${baseUrl}/en/branches`,
      },
    },
  };
}

export default async function BranchesPage({ params }) {
  const { locale } = await params;

  return (
    <>
      <main>
        <Header3 locale={locale} />
        <BranchesPageContent locale={locale} />
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
