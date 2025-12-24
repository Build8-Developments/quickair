"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { blogPosts, categories } from "@/data/blogData";

export default function BlogPageContent({ locale }) {
  const isRTL = locale === "ar";
  const [activeCategory, setActiveCategory] = useState("all");
  const router = useRouter();

  const filteredPosts = activeCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCardClick = (postId) => {
    router.push(`/${locale}/blog/${postId}`);
  };

  return (
    <>
      {/* Header Section */}
      <section className="layout-pb-md" style={{ paddingTop: "140px" }}>
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-lg-8">
              <span className="text-accent-1 text-15 fw-500 mb-10 d-block" data-aos="fade-up">
                {isRTL ? "مدونة السفر" : "Travel Blog"}
              </span>
              <h1 className="text-40 md:text-30 fw-700 text-dark-1 mb-20" data-aos="fade-up" data-aos-delay="100">
                {isRTL ? "أحدث المقالات والنصائح" : "Latest Articles & Tips"}
              </h1>
              <p className="text-15 text-light-2" data-aos="fade-up" data-aos-delay="200">
                {isRTL
                  ? "اكتشف أحدث نصائح السفر والوجهات المميزة وأدلة الحج والعمرة"
                  : "Discover the latest travel tips, featured destinations, and Hajj & Omra guides"}
              </p>
            </div>
          </div>
        </div>
      </section>

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
          <div className="row y-gap-30">
            {filteredPosts.map((post, index) => (
              <div key={post.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={index * 50}>
                <article
                  onClick={() => handleCardClick(post.id)}
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
                      src={post.image}
                      alt={isRTL ? post.titleAr : post.titleEn}
                      fill
                      style={{ objectFit: "cover" }}
                    />
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
                      {isRTL ? post.categoryAr : post.categoryEn}
                    </div>
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
                      <span>{formatDate(post.date)}</span>
                      <span>•</span>
                      <span>{isRTL ? post.readTimeAr : post.readTimeEn}</span>
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "var(--color-dark-1)", marginBottom: "10px", lineHeight: "1.5" }}>
                      {isRTL ? post.titleAr : post.titleEn}
                    </h3>
                    <p style={{ fontSize: "14px", color: "var(--color-light-2)", marginBottom: "20px", flexGrow: 1, lineHeight: "1.7" }}>
                      {isRTL ? post.excerptAr : post.excerptEn}
                    </p>
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

          {filteredPosts.length === 0 && (
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
