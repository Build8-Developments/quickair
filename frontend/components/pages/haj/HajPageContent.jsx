"use client";
import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import HotelCard from "./HotelCard";
import PricingTable from "./PricingTable";
import RitualCard from "./RitualCard";

/**
 * Service icon component - renders appropriate icon based on service type
 */
function ServiceIcon({ iconType, size = 32 }) {
  const iconStyle = {
    width: size,
    height: size,
    fill: "currentColor",
  };

  const icons = {
    star: (
      <svg viewBox="0 0 24 24" style={iconStyle}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    plane: (
      <svg viewBox="0 0 24 24" style={iconStyle}>
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" style={iconStyle}>
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    train: (
      <svg viewBox="0 0 24 24" style={iconStyle}>
        <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    ),
    book: (
      <svg viewBox="0 0 24 24" style={iconStyle}>
        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
      </svg>
    ),
    list: (
      <svg viewBox="0 0 24 24" style={iconStyle}>
        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
      </svg>
    ),
  };

  return icons[iconType] || icons.star;
}

/**
 * ServicesSection Component
 * Displays a grid of 6 service cards with icons, titles, and descriptions
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 6.1, 6.2, 6.3
 */
function ServicesSection({ isRTL }) {
  const { t } = useTranslation();

  const services = [
    {
      id: "comfort",
      icon: "star",
      titleKey: "haj.services.comfort.title",
      descKey: "haj.services.comfort.description",
    },
    {
      id: "vip-lounge",
      icon: "plane",
      titleKey: "haj.services.vipLounge.title",
      descKey: "haj.services.vipLounge.description",
    },
    {
      id: "admin",
      icon: "users",
      titleKey: "haj.services.adminSupervision.title",
      descKey: "haj.services.adminSupervision.description",
    },
    {
      id: "train",
      icon: "train",
      titleKey: "haj.services.haramainTrain.title",
      descKey: "haj.services.haramainTrain.description",
    },
    {
      id: "religious",
      icon: "book",
      titleKey: "haj.services.religiousSupervision.title",
      descKey: "haj.services.religiousSupervision.description",
    },
    {
      id: "programs",
      icon: "list",
      titleKey: "haj.services.multiplePrograms.title",
      descKey: "haj.services.multiplePrograms.description",
    },
  ];

  return (
    <section
      className="layout-pt-lg layout-pb-lg"
      style={{
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
        padding: "80px 0",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div className="container" style={{ padding: "0 30px" }}>
        {/* Section Header */}
        <div className="row justify-center text-center mb-50">
          <div className="col-lg-8">
            <span
              className="text-accent-1 text-15 fw-500 mb-10 d-block"
              data-aos="fade-up"
            >
              {t("haj.services.sectionTitle")}
            </span>
            <h2
              className="text-30 md:text-24 fw-700 text-dark-1 mb-20"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {t("haj.services.sectionSubtitle")}
            </h2>
            <p
              className="text-15 text-light-2 lh-18"
              data-aos="fade-up"
              data-aos-delay="200"
              style={{ textAlign: "center", direction: isRTL ? "rtl" : "ltr" }}
            >
              {t("haj.services.intro")}
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div
          className="row"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "30px",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          {services.map((service, index) => (
            <div
              key={service.id}
              style={{
                flex: "1 1 calc(33.333% - 30px)",
                maxWidth: "calc(33.333% - 20px)",
                minWidth: "300px",
              }}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div
                className="service-card bg-white rounded-12 border-1 border-light-1"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  direction: isRTL ? "rtl" : "ltr",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  padding: "35px 30px",
                  height: "100%",
                  minHeight: "280px",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 15px 50px rgba(1, 159, 177, 0.2)";
                  e.currentTarget.style.borderColor = "var(--color-accent-1)";
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "var(--color-light-1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="d-flex items-center justify-center rounded-full"
                  style={{
                    width: "70px",
                    height: "70px",
                    backgroundColor: "rgba(1, 159, 177, 0.1)",
                    color: "var(--color-accent-1)",
                    marginBottom: "25px",
                    flexShrink: 0,
                  }}
                >
                  <ServiceIcon iconType={service.icon} size={32} />
                </div>
                <h3
                  className="text-18 fw-600 text-dark-1"
                  style={{
                    lineHeight: 1.4,
                    marginBottom: "15px",
                    flexShrink: 0,
                  }}
                >
                  {t(service.titleKey)}
                </h3>
                <p
                  className="text-14 text-light-2 lh-17"
                  style={{
                    marginBottom: 0,
                    flex: 1,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {t(service.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * VIP Feature icon component - renders appropriate icon based on feature type
 */
function VIPFeatureIcon({ featureIndex, size = 28 }) {
  const iconStyle = {
    width: size,
    height: size,
    fill: "currentColor",
  };

  const icons = [
    <svg key="arafat" viewBox="0 0 24 24" style={iconStyle}>
      <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.84L18 11v7H6v-7l6-5.16z" />
    </svg>,
    <svg key="outdoor" viewBox="0 0 24 24" style={iconStyle}>
      <path d="M20 12h-3V3H7v9H4l8 8 8-8zm-8 3.17L9.83 13H11V5h2v8h1.17L12 15.17zM18 20H6v2h12v-2z" />
    </svg>,
    <svg key="restaurant" viewBox="0 0 24 24" style={iconStyle}>
      <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
    </svg>,
    <svg key="kadana" viewBox="0 0 24 24" style={iconStyle}>
      <path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm12-3h-8v8H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4zm2 8h-8V9h6c1.1 0 2 .9 2 2v4z" />
    </svg>,
    <svg key="corridors" viewBox="0 0 24 24" style={iconStyle}>
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" />
    </svg>,
    <svg key="mosque" viewBox="0 0 24 24" style={iconStyle}>
      <path d="M12 2C8 2 4 6 4 10c0 2.5 1.5 4.5 3 6v4h10v-4c1.5-1.5 3-3.5 3-6 0-4-4-8-8-8zm0 2c3 0 6 3 6 6 0 1.5-.5 3-2 4.5V18H8v-3.5C6.5 13 6 11.5 6 10c0-3 3-6 6-6zm-1 4v2H9v2h2v2h2v-2h2v-2h-2V8h-2z" />
    </svg>,
  ];

  return icons[featureIndex] || icons[0];
}

/**
 * VIPPackageSection Component
 * Displays the VIP Luxury Hajj package with all details
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10
 */
function VIPPackageSection({ isRTL }) {
  const { t } = useTranslation();

  const features = [
    t("haj.vipPackage.features.arafatStay"),
    t("haj.vipPackage.features.outdoorSeating"),
    t("haj.vipPackage.features.fiveStarRestaurant"),
    t("haj.vipPackage.features.kadanaStay"),
    t("haj.vipPackage.features.roomCorridors"),
    t("haj.vipPackage.features.kadanaMosque"),
  ];

  const hotels = [
    {
      location: t("haj.hotels.madinah.location"),
      name: t("haj.hotels.madinah.name"),
      features: [
        t("haj.hotels.madinah.feature1"),
        t("haj.hotels.madinah.feature2"),
      ],
      nightsDates: t("haj.hotels.madinah.nights"),
    },
    {
      location: t("haj.hotels.makkah.location"),
      name: t("haj.hotels.makkah.name"),
      features: [
        t("haj.hotels.makkah.feature1"),
        t("haj.hotels.makkah.feature2"),
      ],
      nightsDates: t("haj.hotels.makkah.nights"),
    },
  ];

  const pricing = {
    doubleRoom: t("haj.pricing.vip.double"),
    tripleRoom: t("haj.pricing.vip.triple"),
    quadRoom: t("haj.pricing.vip.quad"),
  };

  const rituals = [
    {
      title: t("haj.vipPackage.arafatRitual.title"),
      description: t("haj.vipPackage.arafatRitual.description"),
      imageUrl:
        "https://cnn-arabic-images.cnn.io/cloudinary/image/upload/w_1920,c_scale,q_auto/cnnarabic/2023/06/27/images/243914.avif",
    },
    {
      title: t("haj.vipPackage.minaRitual.title"),
      imageUrl:
        "https://cdn4.premiumread.com/?url=https://www.al-madina.com/uploads/images/2024/06/16/2315534.jpg",
      features: [
        t("haj.vipPackage.minaRitual.featuresTitle"),
        t("haj.vipPackage.minaRitual.feature1"),
        t("haj.vipPackage.minaRitual.feature2"),
        t("haj.vipPackage.minaRitual.feature3"),
      ],
    },
  ];

  return (
    <section
      className="vip-package-section layout-pt-lg layout-pb-lg"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div className="container" style={{ padding: "0 30px" }}>
        {/* Package Header */}
        <div
          className="row justify-center text-center mb-40"
          data-aos="fade-up"
        >
          <div className="col-lg-10">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#d4af37",
                color: "#ffffff",
                padding: "8px 20px",
                borderRadius: "30px",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "20px",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{ width: "18px", height: "18px", fill: "currentColor" }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{t("haj.vipPackage.badge")}</span>
            </div>
            <h2
              className="text-30 md:text-24 fw-700 text-dark-1 mb-15"
              style={{ lineHeight: 1.5 }}
            >
              {t("haj.vipPackage.title")}
            </h2>
            <div
              className="lottery-note rounded-12"
              style={{
                backgroundColor: "rgba(1, 159, 177, 0.08)",
                padding: "15px 25px",
                display: "inline-block",
                marginTop: "10px",
              }}
            >
              <p
                style={{
                  fontSize: "15px",
                  color: "#555",
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                {t("haj.vipPackage.lotteryNote")}
              </p>
            </div>
          </div>
        </div>

        {/* VIP Features Grid */}
        <div
          className="vip-features-grid mb-50"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h3
            className="text-20 fw-600 text-dark-1 mb-25"
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {t("haj.vipPackage.featuresTitle")}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="vip-feature-card bg-white rounded-12 border-1 border-light-1"
                style={{
                  padding: "20px 25px",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  flexDirection: "row",
                  textAlign: isRTL ? "right" : "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(212, 175, 55, 0.2)";
                  e.currentTarget.style.borderColor = "#d4af37";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "var(--color-light-1)";
                }}
              >
                <div
                  className="d-flex items-center justify-center rounded-full"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "rgba(212, 175, 55, 0.1)",
                    color: "#d4af37",
                    flexShrink: 0,
                  }}
                >
                  <VIPFeatureIcon featureIndex={index} size={24} />
                </div>
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#1a1a2e",
                  }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hotels Section */}
        <div className="hotels-section mb-50">
          <h3
            className="text-20 fw-600 text-dark-1 mb-25"
            style={{ textAlign: isRTL ? "right" : "left" }}
            data-aos="fade-up"
          >
            {t("haj.vipPackage.hotelsTitle")}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "25px",
            }}
          >
            {hotels.map((hotel, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <HotelCard hotel={hotel} isRTL={isRTL} />
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Table */}
        <div
          className="pricing-section mb-50"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h3
            className="text-20 fw-600 text-dark-1 mb-25"
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {t("haj.vipPackage.pricingTitle")}
          </h3>
          <PricingTable
            pricing={pricing}
            reservationAmount={t("haj.pricing.vip.reservation")}
            isRTL={isRTL}
          />
        </div>

        {/* Rituals Section */}
        <div className="rituals-section mb-40">
          <h3
            className="text-20 fw-600 text-dark-1 mb-25"
            style={{ textAlign: isRTL ? "right" : "left" }}
            data-aos="fade-up"
          >
            {t("haj.vipPackage.ritualsTitle")}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "25px",
            }}
          >
            {rituals.map((ritual, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <RitualCard ritual={ritual} isRTL={isRTL} />
              </div>
            ))}
          </div>
        </div>

        {/* Direct Visa Note */}
        <div
          className="direct-visa-note"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div
            className="rounded-12"
            style={{
              backgroundColor: "rgba(212, 175, 55, 0.1)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              padding: "20px 25px",
              display: "flex",
              alignItems: "flex-start",
              gap: "15px",
              flexDirection: "row",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              style={{
                width: "24px",
                height: "24px",
                fill: "#d4af37",
                flexShrink: 0,
                marginTop: "2px",
              }}
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <p
              style={{
                fontSize: "14px",
                color: "#555",
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              {t("haj.vipPackage.directVisaNote")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * DistinguishedPackageSection Component
 * Displays the Distinguished Hajj package with all details
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8
 */
function DistinguishedPackageSection({ isRTL }) {
  const { t } = useTranslation();

  const hotels = [
    {
      location: t("haj.hotels.madinah.location"),
      name: t("haj.hotels.madinah.name"),
      features: [
        t("haj.hotels.madinah.feature1"),
        t("haj.hotels.madinah.feature2"),
      ],
      nightsDates: t("haj.hotels.madinah.nights"),
    },
    {
      location: t("haj.hotels.makkah.location"),
      name: t("haj.hotels.makkah.name"),
      features: [
        t("haj.hotels.makkah.feature1"),
        t("haj.hotels.makkah.feature2"),
      ],
      nightsDates: t("haj.hotels.makkah.nights"),
    },
  ];

  const pricing = {
    doubleRoom: t("haj.pricing.distinguished.double"),
    tripleRoom: t("haj.pricing.distinguished.triple"),
    quadRoom: t("haj.pricing.distinguished.quad"),
    note: t("haj.distinguishedPackage.priceWithoutAirfare"),
  };

  const rituals = [
    {
      title: t("haj.distinguishedPackage.arafatRitual.title"),
      description: t("haj.distinguishedPackage.arafatRitual.description"),
      imageUrl:
        "https://cnn-arabic-images.cnn.io/cloudinary/image/upload/w_1920,c_scale,q_auto/cnnarabic/2023/06/27/images/243914.avif",
    },
    {
      title: t("haj.distinguishedPackage.minaRitual.title"),
      description: t("haj.distinguishedPackage.minaRitual.description"),
      imageUrl:
        "https://cdn4.premiumread.com/?url=https://www.al-madina.com/uploads/images/2024/06/16/2315534.jpg",
    },
  ];

  return (
    <section
      className="distinguished-package-section layout-pt-lg layout-pb-lg"
      style={{
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div className="container" style={{ padding: "0 30px" }}>
        {/* Package Header */}
        <div
          className="row justify-center text-center mb-40"
          data-aos="fade-up"
        >
          <div className="col-lg-10">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "var(--color-accent-1)",
                color: "#ffffff",
                padding: "8px 20px",
                borderRadius: "30px",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "20px",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{ width: "18px", height: "18px", fill: "currentColor" }}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>{t("haj.distinguishedPackage.badge")}</span>
            </div>
            <h2
              className="text-30 md:text-24 fw-700 text-dark-1 mb-15"
              style={{ lineHeight: 1.5 }}
            >
              {t("haj.distinguishedPackage.title")}
            </h2>
            <div
              className="ministry-note rounded-12"
              style={{
                backgroundColor: "rgba(1, 159, 177, 0.08)",
                padding: "15px 25px",
                display: "inline-block",
                marginTop: "10px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#555",
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                {t("haj.distinguishedPackage.ministryNote")}
              </p>
            </div>
          </div>
        </div>

        {/* Hotels Section */}
        <div className="hotels-section mb-50">
          <h3
            className="text-20 fw-600 text-dark-1 mb-25"
            style={{ textAlign: isRTL ? "right" : "left" }}
            data-aos="fade-up"
          >
            {t("haj.distinguishedPackage.hotelsTitle")}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "25px",
            }}
          >
            {hotels.map((hotel, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <HotelCard hotel={hotel} isRTL={isRTL} />
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Table with Airfare Note */}
        <div
          className="pricing-section mb-50"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h3
            className="text-20 fw-600 text-dark-1 mb-25"
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {t("haj.distinguishedPackage.pricingTitle")}
          </h3>
          <PricingTable
            pricing={pricing}
            reservationAmount={t("haj.pricing.distinguished.reservation")}
            isRTL={isRTL}
          />
        </div>

        {/* Rituals Section */}
        <div className="rituals-section">
          <h3
            className="text-20 fw-600 text-dark-1 mb-25"
            style={{ textAlign: isRTL ? "right" : "left" }}
            data-aos="fade-up"
          >
            {t("haj.distinguishedPackage.ritualsTitle")}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "25px",
            }}
          >
            {rituals.map((ritual, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <RitualCard ritual={ritual} isRTL={isRTL} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * HeroSection Component
 * Displays the main hero section with title, date, and subtitle
 */
function HeroSection({ isRTL }) {
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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("https://images.pexels.com/photos/2895295/pexels-photo-2895295.jpeg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
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
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "80px 20px",
        }}
      >
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
          {t("haj.hero.title")}
        </h1>
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
          {t("haj.hero.date")}
        </div>
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
          {t("haj.hero.subtitle")}
        </p>
      </div>
    </section>
  );
}

export default function HajPageContent({ locale }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = locale === "ar" || language === "ar";

  // Hajj steps data from translations
  const hajSteps = [
    {
      titleKey: "haj.steps.ihram.title",
      descKey: "haj.steps.ihram.description",
    },
    {
      titleKey: "haj.steps.tawaf.title",
      descKey: "haj.steps.tawaf.description",
    },
    { titleKey: "haj.steps.sai.title", descKey: "haj.steps.sai.description" },
    {
      titleKey: "haj.steps.arafat.title",
      descKey: "haj.steps.arafat.description",
    },
    {
      titleKey: "haj.steps.muzdalifah.title",
      descKey: "haj.steps.muzdalifah.description",
    },
    { titleKey: "haj.steps.rami.title", descKey: "haj.steps.rami.description" },
  ];

  return (
    <div
      style={{
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      {/* Hero Section */}
      <HeroSection isRTL={isRTL} />

      {/* Services Section */}
      <ServicesSection isRTL={isRTL} />

      {/* VIP Package Section */}
      <VIPPackageSection isRTL={isRTL} />

      {/* Distinguished Package Section */}
      <DistinguishedPackageSection isRTL={isRTL} />
    </div>
  );
}
