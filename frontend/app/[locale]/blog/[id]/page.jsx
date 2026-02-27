import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import BlogDetailContent from "@/components/pages/blog/BlogDetailContent";
import { blogsAPI } from "@/services/api";
import { siteInfo } from "@/data/seo";
import { notFound } from "next/navigation";

// ISR: individual posts are rendered on first visit and cached for 60 s
export const revalidate = 60;
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { id, locale } = await params;

  try {
    const post = await blogsAPI.getBySlug(id, locale);

    if (!post) {
      return {
        title: locale === "ar" ? "المقال غير موجود" : "Blog Post Not Found",
      };
    }

    const baseUrl = siteInfo.siteUrl;

    return {
      title: `${post.title} | QuickAir Blog`,
      description: post.excerpt || post.title,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        locale: locale === "ar" ? "ar_SA" : "en_US",
        images: post.coverImage?.url
          ? [{ url: post.coverImage.url, alt: post.title }]
          : [],
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
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: locale === "ar" ? "المقال غير موجود" : "Blog Post Not Found",
    };
  }
}

async function getBlogPost(slug, locale) {
  try {
    const post = await blogsAPI.getBySlug(slug, locale);
    return post;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

async function getRelatedPosts(category, currentSlug, locale) {
  try {
    const allPosts = await blogsAPI.getAll({ locale, limit: 10 });
    return (allPosts || [])
      .filter((p) => p.category === category && p.slug !== currentSlug)
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

export default async function BlogDetailPage({ params }) {
  const { id, locale } = await params;
  const post = await getBlogPost(id, locale);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, post.slug, locale);

  return (
    <>
      <main style={{ overflowX: "hidden" }}>
        <Header3 locale={locale} />
        <BlogDetailContent
          post={post}
          relatedPosts={relatedPosts}
          locale={locale}
        />
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
