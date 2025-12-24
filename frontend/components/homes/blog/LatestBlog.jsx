"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blogData";

export default function LatestBlog({ locale }) {
  const isRTL = locale === "ar";
  const latestPosts = blogPosts.slice(0, 3);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="layout-pt-lg layout-pb-lg">
      <div className="container">
        <div className="row justify-center text-center mb-40">
          <div className="col-lg-8">
            <span
              className="text-accent-1 text-15 fw-500 mb-10 d-block"
              data-aos="fade-up"
            >
              {isRTL ? "مدونة السفر" : "Travel Blog"}
            </span>
            <h2
              className="text-30 md:text-24 fw-700 text-dark-1"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {isRTL ? "أحدث المقالات والنصائح" : "Latest Articles & Tips"}
            </h2>
          </div>
        </div>

        <div className="row y-gap-30">
          {latestPosts.map((post, index) => (
            <div
              key={post.id}
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <Link
                href={`/${locale}/blog/${post.id}`}
                style={{ textDecoration: "none" }}
              >
                <article
                  className="bg-white rounded-12 overflow-hidden border-1 border-light-1"
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
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "220px",
                      flexShrink: 0,
                    }}
                  >
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
                      <span>{formatDate(post.date)}</span>
                      <span>•</span>
                      <span>{isRTL ? post.readTimeAr : post.readTimeEn}</span>
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
                      {isRTL ? post.titleAr : post.titleEn}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--color-light-2)",
                        marginBottom: "20px",
                        flexGrow: 1,
                        lineHeight: "1.7",
                      }}
                    >
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
                      <span style={{ transform: isRTL ? "rotate(180deg)" : "none" }}>
                        →
                      </span>
                    </span>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-40" data-aos="fade-up">
          <Link
            href={`/${locale}/blog`}
            className="button -md -accent-1 text-white"
            style={{
              padding: "14px 32px",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            {isRTL ? "عرض جميع المقالات" : "View All Articles"}
          </Link>
        </div>
      </div>
    </section>
  );
}
