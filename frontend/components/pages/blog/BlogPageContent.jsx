"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BlogHero from "./BlogHero";
import { STRAPI_CONFIG } from "@/config/api";

export default function BlogPageContent({ locale, initialPosts = [] }) {
  const isRTL = locale === "ar";
  const [posts] = useState(initialPosts);
  const [loading] = useState(false);
  const router = useRouter();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getImageUrl = (coverImage) => {
    // Strapi v5: flat { url, alternativeText }
    const url = coverImage?.url || coverImage?.data?.attributes?.url;
    if (!url) return "https://placehold.co/800x500.png";
    if (url.startsWith("http")) return url;
    return `${STRAPI_CONFIG.url}${url}`;
  };

  const handleCardClick = (slug) => {
    router.push(`/${locale}/blog/${slug}`);
  };

  return (
    <>
      {/* Hero Section */}
      <BlogHero locale={locale} />

      {/* Blog Posts Grid */}
      <section className="layout-pb-lg pt-40">
        <div className="container">
          {loading ? (
            <div className="text-center py-60">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row y-gap-30">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="col-lg-4 col-md-6"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <article
                    onClick={() => handleCardClick(post.slug)}
                    className="bg-white rounded-12 overflow-hidden border border-light-1"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      height: "100%",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 15px 40px rgba(5, 7, 60, 0.1)";
                      e.currentTarget.style.transform = "translateY(-5px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Image Container */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "220px",
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={getImageUrl(post.coverImage)}
                        alt={post.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      {post.category && (
                        <div
                          style={{
                            position: "absolute",
                            top: "15px",
                            [isRTL ? "right" : "left"]: "15px",
                            backgroundColor: "var(--color-accent-1)",
                            color: "#ffffff",
                            padding: "6px 12px",
                            fontSize: "12px",
                            fontWeight: "500",
                            borderRadius: "4px",
                          }}
                        >
                          {post.category?.replace(/-/g, " ")}
                        </div>
                      )}
                    </div>

                    {/* Content Container */}
                    <div
                      style={{
                        padding: "25px",
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          marginBottom: "15px",
                          fontSize: "13px",
                          color: "var(--color-light-2)",
                        }}
                      >
                        <span>
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                        {post.readTime && (
                          <>
                            <span>•</span>
                            <span>
                              {post.readTime}{" "}
                              {isRTL ? "دقائق قراءة" : "min read"}
                            </span>
                          </>
                        )}
                      </div>
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "var(--color-dark-1)",
                          marginBottom: "10px",
                          lineHeight: "1.5",
                        }}
                      >
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p
                          style={{
                            fontSize: "14px",
                            color: "var(--color-light-2)",
                            marginBottom: "20px",
                            flexGrow: 1,
                            lineHeight: "1.7",
                          }}
                        >
                          {post.excerpt}
                        </p>
                      )}
                      <span
                        style={{
                          color: "var(--color-accent-1)",
                          fontSize: "14px",
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        {isRTL ? "اقرأ المزيد" : "Read More"}
                        <span
                          style={{
                            transform: isRTL ? "rotate(180deg)" : "none",
                          }}
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-60">
              <p className="text-18 text-light-2">
                {isRTL
                  ? "لا توجد مقالات في هذه الفئة"
                  : "No articles in this category"}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
