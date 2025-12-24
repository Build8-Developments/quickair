import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import BlogPageContent from "@/components/pages/blog/BlogPageContent";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const metadata = generateLocalizedMetadata("blog", locale);
  const baseUrl = siteInfo.siteUrl;

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: {
        en: `${baseUrl}/en/blog`,
        ar: `${baseUrl}/ar/blog`,
        "x-default": `${baseUrl}/en/blog`,
      },
    },
  };
}

export default async function BlogPage({ params }) {
  const { locale } = await params;

  return (
    <>
      <main style={{ overflowX: "hidden" }}>
        <Header3 locale={locale} />
        <div className="header-margin"></div>
        <BlogPageContent locale={locale} />
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
