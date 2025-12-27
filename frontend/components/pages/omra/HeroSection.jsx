"use client";
import React from "react";
import { useTranslation } from "react-i18next";

/**
 * HeroSection Component for Omra Page
 * Displays the main hero section with background image, title, season, and subtitle
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
 */
export default function HeroSection({ isRTL }) {
  const { t } = useTranslation();

  return (
    <section
      className="hero-section"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "450px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        direction: isRTL ? "rtl" : "ltr",
        marginTop: "80px",
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("https://images.unsplash.com/photo-1693590614566-1d3ea9ef32f7")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Gradient Overlay for text readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(180deg, rgba(1, 159, 177, 0.85) 0%, rgba(1, 122, 137, 0.9) 50%, rgba(5, 7, 60, 0.95) 100%)",
        }}
      />
      {/* Content */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "80px 20px",
        }}
      >
        {/* Title */}
        <h1
          data-aos="fade-up"
          data-aos-duration="800"
          style={{
            fontSize: "clamp(56px, 12vw, 96px)",
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: "15px",
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            fontFamily: isRTL ? "'Noto Kufi Arabic', sans-serif" : "inherit",
          }}
        >
          {t("omra.hero.title")}
        </h1>
        {/* Season */}
        <div
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="100"
          style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.95)",
            marginBottom: "30px",
            letterSpacing: "3px",
          }}
        >
          {t("omra.hero.season")}
        </div>
        {/* Decorative Divider */}
        <div
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="200"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "30px",
            gap: "15px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8))",
            }}
          />
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "rgba(255, 255, 255, 0.9)",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              width: "80px",
              height: "2px",
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 0.8), transparent)",
            }}
          />
        </div>
        {/* Subtitle */}
        <p
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="300"
          style={{
            fontSize: "clamp(15px, 2.5vw, 18px)",
            color: "rgba(255, 255, 255, 0.9)",
            maxWidth: "800px",
            margin: "0 auto",
            lineHeight: 1.9,
            textAlign: "center",
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          {t("omra.hero.subtitle")}
        </p>
      </div>
    </section>
  );
}
