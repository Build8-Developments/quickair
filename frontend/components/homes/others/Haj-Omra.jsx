"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

const getCardStyles = (isRTL) => ({
  container: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "12px",
    display: "block",
  },
  image: {
    objectFit: "cover",
    transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    width: "100%",
    height: "auto",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)",
    transition: "opacity 0.4s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: isRTL ? "flex-end" : "flex-start",
    paddingTop: "30px",
    paddingBottom: "30px",
    paddingLeft: isRTL ? "30%" : "30px",
    paddingRight: isRTL ? "30px" : "30%",
    textAlign: isRTL ? "right" : "left",
  },
  title: {
    color: "#fff",
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "10px",
    transform: "translateY(20px)",
    transition: "transform 0.4s ease, opacity 0.4s ease",
  },
  description: {
    color: "rgba(255,255,255,0.9)",
    fontSize: "15px",
    lineHeight: "1.6",
    transform: "translateY(20px)",
    transition: "transform 0.4s ease 0.1s, opacity 0.4s ease 0.1s",
  },
  cta: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    marginTop: "15px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transform: "translateY(20px)",
    transition: "transform 0.4s ease 0.2s, opacity 0.4s ease 0.2s",
    flexDirection: isRTL ? "row-reverse" : "row",
  },
});

function HajOmraCard({
  href,
  imageSrc,
  imageAlt,
  title,
  description,
  ctaText,
  delay,
  isRTL,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const cardStyles = getCardStyles(isRTL);

  return (
    <div
      className="col-lg-6 col-md-6 col-sm-12"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <Link
        href={href}
        style={cardStyles.container}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={750}
          height={600}
          style={{
            ...cardStyles.image,
            transform: isHovered ? "scale(1.08)" : "scale(1)",
          }}
        />
        <div
          style={{
            ...cardStyles.overlay,
            opacity: isHovered ? 1 : 0.7,
          }}
        >
          <h3
            style={{
              ...cardStyles.title,
              transform: isHovered ? "translateY(0)" : "translateY(20px)",
              opacity: isHovered ? 1 : 0,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              ...cardStyles.description,
              transform: isHovered ? "translateY(0)" : "translateY(20px)",
              opacity: isHovered ? 1 : 0,
            }}
          >
            {description}
          </p>
          <span
            style={{
              ...cardStyles.cta,
              transform: isHovered ? "translateY(0)" : "translateY(20px)",
              opacity: isHovered ? 1 : 0,
            }}
          >
            {ctaText}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: isRTL ? "scaleX(-1)" : "none",
              }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    </div>
  );
}

export default function HajOmra({ locale = "en" }) {
  const { isRTL: contextIsRTL } = useLanguage();
  const { t } = useTranslation();

  // Use locale prop as fallback for RTL detection
  const isRTL = contextIsRTL || locale === "ar";

  const cards = [
    {
      href: `/${locale}/haj`,
      imageSrc: "/hij.png",
      imageAlt: t("home.haj"),
      title: t("home.haj", "Hajj"),
      description: t(
        "home.hajDescription",
        "Embark on the sacred pilgrimage to Mecca. Experience the spiritual journey of a lifetime with our comprehensive Hajj packages."
      ),
      ctaText: t("home.explorePackages", "Explore Packages"),
      delay: "",
    },
    {
      href: `/${locale}/omra`,
      imageSrc: "/omra.png",
      imageAlt: t("home.omra"),
      title: t("home.omra", "Umrah"),
      description: t(
        "home.omraDescription",
        "Perform the lesser pilgrimage at any time of the year. Discover our carefully curated Umrah packages for a blessed journey."
      ),
      ctaText: t("home.explorePackages", "Explore Packages"),
      delay: "100",
    },
  ];

  return (
    <section className="layout-pt-xl layout-pb-xl">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-auto">
            <div className="text-15 text-accent-1 mb-10">
              {t("home.spiritualJourneys")}
            </div>
            <h2 data-aos="fade-up" data-aos-delay="" className="text-30">
              {t("home.hajOmraPackages")}
            </h2>
          </div>
        </div>

        <div className="row y-gap-30 justify-between pt-40 sm:pt-20">
          {cards.map((card, index) => (
            <HajOmraCard key={index} {...card} isRTL={isRTL} />
          ))}
        </div>
      </div>
    </section>
  );
}
