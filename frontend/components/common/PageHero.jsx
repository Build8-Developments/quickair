"use client";

import React from "react";
import Image from "next/image";

// ─── built-in badge icons ─────────────────────────────────────────────────────
const ICONS = {
  blog: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  about: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  faq: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  contact: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.1 6.1l1.3-1.3a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
};

/**
 * PageHero — reusable full-width hero banner for interior pages.
 *
 * Props:
 *   locale      string              "en" | "ar"
 *   title       string              Main heading
 *   badge       string (optional)   Small text inside the orange badge pill
 *   description string (optional)   Paragraph below the title
 *   image       string (optional)   Background image path — pass any /img/... path
 *                                   Defaults to /img/blog-bg.webp
 *                                   e.g. image="/img/pageHeader/1.jpg"
 *   icon        string (optional)   "blog" | "about" | "faq" | "contact"
 *               ReactNode           Or pass any custom SVG/element
 */
export default function PageHero({
  locale = "en",
  title,
  badge,
  description,
  image = "/img/blog-bg.webp",
  icon,
}) {
  const isRTL = locale === "ar";
  const badgeIcon = typeof icon === "string" ? ICONS[icon] : icon;

  return (
    <section
      style={{
        position: "relative",
        minHeight: "400px",
        marginTop: "80px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Background image */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          src={image}
          alt={title || "Page hero"}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(5,16,54,0.85) 0%, rgba(5,16,54,0.6) 50%, rgba(235,88,55,0.4) 100%)",
          }}
        />
      </div>

      {/* Decorative glow blobs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(235,88,55,0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(30px)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        className="container"
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          padding: "60px 16px 80px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "800px",
            padding: "40px 50px",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            direction: isRTL ? "rtl" : "ltr",
          }}
          data-aos="fade-up"
        >
          {/* Badge */}
          {badge && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                background: "rgba(235,88,55,0.9)",
                borderRadius: "50px",
                marginBottom: "20px",
              }}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {badgeIcon}
              <span
                style={{
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                }}
              >
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          {title && (
            <h1
              style={{
                fontSize: "clamp(36px, 6vw, 56px)",
                fontWeight: "700",
                color: "white",
                marginBottom: "16px",
                lineHeight: "1.2",
                textShadow: "0 2px 20px rgba(0,0,0,0.3)",
              }}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {title}
            </h1>
          )}

          {/* Description */}
          {description && (
            <p
              style={{
                fontSize: "18px",
                color: "rgba(255,255,255,0.9)",
                lineHeight: "1.7",
                maxWidth: "600px",
                margin: "0 auto",
              }}
              data-aos="fade-up"
              data-aos-delay="300"
            >
              {description}
            </p>
          )}

          {/* Accent line */}
          <div
            style={{
              width: "60px",
              height: "4px",
              background: "linear-gradient(90deg, #EB5837, #ff8c6b)",
              borderRadius: "2px",
              margin: "24px auto 0",
            }}
            data-aos="fade-up"
            data-aos-delay="400"
          />
        </div>
      </div>

      {/* Bottom wave */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 3,
        }}
      >
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%" }}
          preserveAspectRatio="none"
        >
          <path
            d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
