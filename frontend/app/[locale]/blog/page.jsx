import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import BlogPageContent from "@/components/pages/blog/BlogPageContent";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";
import { blogsAPI } from "@/services/api";

// ISR: revalidate every 60 s; build-time empty shell is replaced on first request
export const revalidate = 60;

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

async function getBlogPosts(locale) {
  try {
    const posts = await blogsAPI.getAll({ locale, limit: 50 });
    return posts || [];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export default async function BlogPage({ params }) {
  const { locale } = await params;
  const posts = await getBlogPosts(locale);

  return (
    <>
      <main style={{ overflowX: "hidden" }}>
        <Header3 locale={locale} />
        <BlogPageContent locale={locale} initialPosts={posts} />
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
