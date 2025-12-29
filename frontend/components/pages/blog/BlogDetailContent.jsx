"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { STRAPI_CONFIG } from "@/config/api";

const categories = [
  { id: "travel-tips", nameEn: "Travel Tips", nameAr: "نصائح السفر" },
  { id: "destinations", nameEn: "Destinations", nameAr: "الوجهات" },
  { id: "hotels", nameEn: "Hotels", nameAr: "الفنادق" },
  { id: "offers", nameEn: "Offers", nameAr: "العروض" },
  { id: "news", nameEn: "News", nameAr: "الأخبار" },
  { id: "guides", nameEn: "Guides", nameAr: "الأدلة" },
];

export default function BlogDetailContent({ post, relatedPosts = [], locale }) {
  const isRTL = locale === "ar";

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getImageUrl = (coverImage) => {
    if (!coverImage?.data?.attributes?.url) return "https://placehold.co/800x500.png";
    const url = coverImage.data.attributes.url;
    if (url.startsWith("http")) return url;
    return `${STRAPI_CONFIG.url}${url}`;
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? (isRTL ? cat.nameAr : cat.nameEn) : category;
  };

  return (
    <>
      {/* Featured Image - Full Width */}
      <section style={{ paddingTop: "140px", paddingBottom: "50px" }}>
        <div className="container">
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "500px",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Image
              src={getImageUrl(post.coverImage)}
              alt={post.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            {/* Gradient Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Article Header */}
      <section style={{ paddingBottom: "40px" }}>
        <div className="container">
          <div className="row justify-center">
            <div className="col-lg-8" style={{ textAlign: isRTL ? "right" : "left" }}>
              {/* Breadcrumb */}
              <nav
                style={{
                  marginBottom: "25px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "14px",
                  justifyContent: isRTL ? "flex-end" : "flex-start",
                }}
              >
                {isRTL ? (
                  <>
                    <span style={{ color: "var(--color-light-2)" }}>
                      {getCategoryLabel(post.category)}
                    </span>
                    <span style={{ color: "var(--color-light-2)" }}>/</span>
                    <Link
                      href={`/${locale}/blog`}
                      style={{
                        color: "var(--color-accent-1)",
                        textDecoration: "none",
                        fontWeight: "500",
                      }}
                    >
                      المدونة
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/${locale}/blog`}
                      style={{
                        color: "var(--color-accent-1)",
                        textDecoration: "none",
                        fontWeight: "500",
                      }}
                    >
                      Blog
                    </Link>
                    <span style={{ color: "var(--color-light-2)" }}>/</span>
                    <span style={{ color: "var(--color-light-2)" }}>
                      {getCategoryLabel(post.category)}
                    </span>
                  </>
                )}
              </nav>

              {/* Category Badge */}
              {post.category && (
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: "var(--color-accent-1)",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {getCategoryLabel(post.category)}
                </span>
              )}

              {/* Title */}
              <h1
                style={{
                  fontSize: "42px",
                  fontWeight: "700",
                  color: "var(--color-dark-1)",
                  lineHeight: "1.3",
                  marginBottom: "25px",
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {post.title}
              </h1>

              {/* Meta Info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  paddingBottom: "30px",
                  borderBottom: "1px solid #eee",
                  flexWrap: "wrap",
                  justifyContent: isRTL ? "flex-end" : "flex-start",
                }}
              >
                {post.author && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-light-2)" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span style={{ fontSize: "14px", color: "var(--color-light-2)" }}>
                      {post.author}
                    </span>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-light-2)" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span style={{ fontSize: "14px", color: "var(--color-light-2)" }}>
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                </div>
                {post.readTime && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-light-2)" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span style={{ fontSize: "14px", color: "var(--color-light-2)" }}>
                      {post.readTime} {isRTL ? "دقائق قراءة" : "min read"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section style={{ paddingBottom: "60px" }}>
        <div className="container">
          <div className="row justify-center">
            <div className="col-lg-8">
              {post.excerpt && (
                <p
                  style={{
                    fontSize: "20px",
                    lineHeight: "1.8",
                    color: "#555",
                    marginBottom: "30px",
                    fontStyle: "italic",
                    textAlign: isRTL ? "right" : "left",
                    direction: isRTL ? "rtl" : "ltr",
                  }}
                >
                  {post.excerpt}
                </p>
              )}
              
              <article
                className="blog-article-content"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  direction: isRTL ? "rtl" : "ltr",
                }}
                dangerouslySetInnerHTML={{
                  __html: post.content,
                }}
              />

              {/* Share Section */}
              <div
                style={{
                  marginTop: "50px",
                  paddingTop: "30px",
                  borderTop: "1px solid #eee",
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "var(--color-dark-1)",
                    marginBottom: "15px",
                  }}
                >
                  {isRTL ? "شارك هذا المقال" : "Share this article"}
                </p>
                <div style={{ display: "flex", gap: "12px" }}>
                  {["facebook", "twitter", "linkedin"].map((social) => (
                    <button
                      key={social}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        border: "1px solid #e0e0e0",
                        background: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--color-accent-1)";
                        e.currentTarget.style.borderColor = "var(--color-accent-1)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#fff";
                        e.currentTarget.style.borderColor = "#e0e0e0";
                        e.currentTarget.style.color = "inherit";
                      }}
                    >
                      <i className={`icon-${social} text-16`}></i>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section
          style={{
            paddingTop: "60px",
            paddingBottom: "60px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div className="container">
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "var(--color-dark-1)",
                textAlign: "center",
                marginBottom: "40px",
              }}
            >
              {isRTL ? "مقالات ذات صلة" : "Related Articles"}
            </h2>

            <div className="row y-gap-30">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="col-lg-4 col-md-6">
                  <Link href={`/${locale}/blog/${relatedPost.slug}`} style={{ textDecoration: "none" }}>
                    <article
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "16px",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        height: "100%",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.06)";
                      }}
                    >
                      <div style={{ position: "relative", width: "100%", height: "200px" }}>
                        <Image
                          src={getImageUrl(relatedPost.coverImage)}
                          alt={relatedPost.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ padding: "24px", textAlign: isRTL ? "right" : "left" }}>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--color-accent-1)",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {getCategoryLabel(relatedPost.category)}
                        </span>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "var(--color-dark-1)",
                            lineHeight: "1.5",
                            marginTop: "10px",
                          }}
                        >
                          {relatedPost.title}
                        </h3>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <section style={{ paddingTop: "50px", paddingBottom: "80px" }}>
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <Link
              href={`/${locale}/blog`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 32px",
                backgroundColor: "var(--color-accent-1)",
                borderRadius: "10px",
                textDecoration: "none",
                color: "#fff",
                fontWeight: "600",
                fontSize: "15px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{ transform: isRTL ? "rotate(180deg)" : "none", display: "inline-block" }}>←</span>
              {isRTL ? "العودة إلى المدونة" : "Back to Blog"}
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .blog-article-content {
          font-size: 17px;
          line-height: 1.9;
          color: #444;
        }
        .blog-article-content h2 {
          font-size: 26px;
          font-weight: 700;
          margin-top: 45px;
          margin-bottom: 20px;
          color: var(--color-dark-1);
        }
        .blog-article-content h3 {
          font-size: 22px;
          font-weight: 600;
          margin-top: 35px;
          margin-bottom: 15px;
          color: var(--color-dark-1);
        }
        .blog-article-content p {
          margin-bottom: 24px;
          color: #555;
        }
        .blog-article-content ul,
        .blog-article-content ol {
          margin-bottom: 24px;
          padding-${isRTL ? "right" : "left"}: 30px;
        }
        .blog-article-content li {
          margin-bottom: 12px;
          color: #555;
        }
        .blog-article-content a {
          color: var(--color-accent-1);
          text-decoration: underline;
        }
        .blog-article-content blockquote {
          border-${isRTL ? "right" : "left"}: 4px solid var(--color-accent-1);
          padding: 20px 25px;
          margin: 30px 0;
          background: #f8f9fa;
          font-style: italic;
          color: #666;
        }
        .blog-article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 20px 0;
        }
        @media (max-width: 768px) {
          .blog-article-content {
            font-size: 16px;
          }
          .blog-article-content h2 {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
}
