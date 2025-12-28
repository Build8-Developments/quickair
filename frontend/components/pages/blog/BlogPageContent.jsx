"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import { STRAPI_CONFIG } from "@/config/api";

const categories = [
  { id: "all", nameEn: "All", nameAr: "الكل" },
  { id: "travel-tips", nameEn: "Travel Tips", nameAr: "نصائح السفر" },
  { id: "destinations", nameEn: "Destinations", nameAr: "الوجهات" },
  { id: "hotels", nameEn: "Hotels", nameAr: "الفنادق" },
  { id: "offers", nameEn: "Offers", nameAr: "العروض" },
  { id: "news", nameEn: "News", nameAr: "الأخبار" },
  { id: "guides", nameEn: "Guides", nameAr: "الأدلة" },
];

export default function BlogPageContent({ locale, initialPosts = [] }) {
  const isRTL = locale === "ar";
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const filteredPosts = activeCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

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

  const handleCardClick = (slug) => {
    router.push(`/${locale}/blog/${slug}`);
  };

  return (
    <>
      {/* Header Section */}
      <PageHeader
        icon="blog"
        title={isRTL ? "المدونة" : "Blog"}
        description={isRTL
          ? "اكتشف أحدث نصائح السفر والوجهات المميزة وأدلة الحج والعمرة"
          : "Discover the latest travel tips, featured destinations, and Hajj & Omra guides"}
      />

      {/* Categories Filter */}
      <section className="pb-30">
        <div className="container">
          <div className="d-flex flex-wrap justify-center gap-10" data-aos="fade-up">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-20 py-10 rounded-8 text-14 fw-500 border-1 transition-all`}
                style={{
                  backgroundColor: activeCategory === cat.id ? "var(--color-accent-1)" : "transparent",
                  color: activeCategory === cat.id ? "#ffffff" : "var(--color-dark-1)",
                  borderColor: activeCategory === cat.id ? "var(--color-accent-1)" : "var(--color-light-1)",
                  cursor: "pointer",
                }}
              >
                {isRTL ? cat.nameAr : cat.nameEn}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="layout-pb-lg">
        <div className="container">
          {loading ? (
            <div className="text-center py-60">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row y-gap-30">
              {filteredPosts.map((post, index) => (
                <div key={post.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={index * 50}>
                  <article
                    onClick={() => handleCardClick(post.slug)}
                    className="bg-white rounded-12 overflow-hidden border-1 border-light-1"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      height: "100%",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 15px 40px rgba(5, 7, 60, 0.1)";
                      e.currentTarget.style.transform = "translateY(-5px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Image Container */}
                    <div style={{ position: "relative", width: "100%", height: "220px", flexShrink: 0 }}>
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
                          {getCategoryLabel(post.category)}
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
                      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px", fontSize: "13px", color: "var(--color-light-2)" }}>
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                        {post.readTime && (
                          <>
                            <span>•</span>
                            <span>{post.readTime} {isRTL ? "دقائق قراءة" : "min read"}</span>
                          </>
                        )}
                      </div>
                      <h3 style={{ fontSize: "18px", fontWeight: "600", color: "var(--color-dark-1)", marginBottom: "10px", lineHeight: "1.5" }}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p style={{ fontSize: "14px", color: "var(--color-light-2)", marginBottom: "20px", flexGrow: 1, lineHeight: "1.7" }}>
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
                        <span style={{ transform: isRTL ? "rotate(180deg)" : "none" }}>→</span>
                      </span>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-60">
              <p className="text-18 text-light-2">
                {isRTL ? "لا توجد مقالات في هذه الفئة" : "No articles in this category"}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
