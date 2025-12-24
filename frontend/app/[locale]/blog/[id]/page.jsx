import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import BlogDetailContent from "@/components/pages/blog/BlogDetailContent";
import { blogPosts } from "@/data/blogData";
import { siteInfo } from "@/data/seo";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return {
      title: locale === "ar" ? "المقال غير موجود" : "Blog Post Not Found",
    };
  }

  const title = locale === "ar" ? post.titleAr : post.titleEn;
  const description = locale === "ar" ? post.excerptAr : post.excerptEn;
  const baseUrl = siteInfo.siteUrl;

  return {
    title: `${title} | QuickAir Blog`,
    description,
    openGraph: {
      title,
      description,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      images: [{ url: post.image, alt: title }],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${id}`,
      languages: {
        en: `${baseUrl}/en/blog/${id}`,
        ar: `${baseUrl}/ar/blog/${id}`,
        "x-default": `${baseUrl}/en/blog/${id}`,
      },
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { id, locale } = await params;
  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    notFound();
  }

  return (
    <>
      <main style={{ overflowX: "hidden" }}>
        <Header3 locale={locale} />
        <div className="header-margin"></div>
        <BlogDetailContent post={post} locale={locale} />
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
