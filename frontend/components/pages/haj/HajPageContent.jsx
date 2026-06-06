"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePilgrimageContent } from "@/contexts/PilgrimageContentContext";
import UmrahProgramCard from "@/components/pages/omra/UmrahProgramCard";
import TierTabs from "@/components/pages/pilgrimage/TierTabs";

/**
 * HajPageContent
 *
 * Mirrors the OmraPage structure but for Hajj programs:
 * - Hero section
 * - Services grid (kept from the previous implementation as it's still useful
 *   for Hajj services like VIP lounge, admin supervision, religious guide, etc.)
 * - Programs list — data-driven Hajj program cards (reuses UmrahProgramCard
 *   so the visual treatment is identical for both pilgrimages).
 *
 * Programs come from Strapi when present; we fall back to translations.
 */
export default function HajPageContent({ locale }) {
  const { language } = useLanguage();
  const { content } = usePilgrimageContent();
  const { t, i18n } = useTranslation();
  const isRTL = locale === "ar" || language === "ar";

  // Programs / labels — Strapi first, translations second.
  const arPrograms = i18n.getResource("ar", "translation", "haj.programs");
  const enPrograms = i18n.getResource("en", "translation", "haj.programs");
  const fallbackPrograms = locale === "ar" ? arPrograms : enPrograms;

  const programs =
    Array.isArray(content?.programs) && content.programs.length > 0
      ? content.programs
      : Array.isArray(fallbackPrograms)
        ? fallbackPrograms
        : [];

  const arTableLabels = i18n.getResource("ar", "translation", "haj.tableLabels");
  const enTableLabels = i18n.getResource("en", "translation", "haj.tableLabels");
  const fallbackTableLabels = locale === "ar" ? arTableLabels : enTableLabels;
  const tableLabels =
    content?.tableLabels && typeof content.tableLabels === "object"
      ? content.tableLabels
      : fallbackTableLabels && typeof fallbackTableLabels === "object"
        ? fallbackTableLabels
        : {};

  const sectionTitle =
    content?.programsSection?.title || t("haj.programsSection.title");
  const sectionSubtitle =
    content?.programsSection?.subtitle || t("haj.programsSection.subtitle");

  return (
    <div
      style={{
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      <ServicesSection isRTL={isRTL} />

      {programs.length > 0 && (
        <ProgramsSection
          programs={programs}
          tableLabels={tableLabels}
          title={sectionTitle}
          subtitle={sectionSubtitle}
          isRTL={isRTL}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

const SERVICE_ICONS = {
  star: (
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
  ),
  plane: (
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
  ),
  users: (
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  ),
  train: (
    <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5z" />
  ),
  book: (
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
  ),
  list: (
    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
  ),
};

function ServiceIcon({ iconType, size = 32 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={{ width: size, height: size, fill: "currentColor" }}
      aria-hidden
    >
      {SERVICE_ICONS[iconType] || SERVICE_ICONS.star}
    </svg>
  );
}

function ServicesSection({ isRTL }) {
  const { pt } = usePilgrimageContent();

  const services = [
    { id: "comfort", icon: "star", titleKey: "haj.services.comfort.title", descKey: "haj.services.comfort.description" },
    { id: "vip-lounge", icon: "plane", titleKey: "haj.services.vipLounge.title", descKey: "haj.services.vipLounge.description" },
    { id: "admin", icon: "users", titleKey: "haj.services.adminSupervision.title", descKey: "haj.services.adminSupervision.description" },
    { id: "train", icon: "train", titleKey: "haj.services.haramainTrain.title", descKey: "haj.services.haramainTrain.description" },
    { id: "religious", icon: "book", titleKey: "haj.services.religiousSupervision.title", descKey: "haj.services.religiousSupervision.description" },
    { id: "programs", icon: "list", titleKey: "haj.services.multiplePrograms.title", descKey: "haj.services.multiplePrograms.description" },
  ];

  return (
    <section
      className="pilgrimage-section pilgrimage-services layout-pt-lg layout-pb-lg"
      style={{
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
        padding: "80px 0",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div className="container" style={{ padding: "0 30px" }}>
        <div className="row justify-center text-center mb-50">
          <div className="col-lg-8">
            <span
              className="pilgrimage-section-kicker text-accent-1 text-15 fw-500 mb-10 d-block"
              data-aos="fade-up"
            >
              {pt("services.sectionTitle")}
            </span>
            <h2
              className="pilgrimage-section-title text-30 md:text-24 fw-700 text-dark-1 mb-20"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {pt("services.sectionSubtitle")}
            </h2>
            <p
              className="pilgrimage-section-subtitle text-15 text-light-2 lh-18"
              data-aos="fade-up"
              data-aos-delay="200"
              style={{ textAlign: "center", direction: isRTL ? "rtl" : "ltr" }}
            >
              {pt("services.intro")}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {services.map((service, index) => (
            <div
              key={service.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div
                className="pilgrimage-service-card service-card bg-white rounded-12 border-1 border-light-1"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  direction: isRTL ? "rtl" : "ltr",
                  transition: "all 0.3s ease",
                  cursor: "default",
                  padding: "32px 28px",
                  height: "100%",
                  minHeight: "260px",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 15px 50px rgba(1, 159, 177, 0.18)";
                  e.currentTarget.style.borderColor = "var(--color-accent-1)";
                  e.currentTarget.style.transform = "translateY(-4px)";
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
                    width: "64px",
                    height: "64px",
                    backgroundColor: "var(--color-accent-1)",
                    color: "#ffffff",
                    marginBottom: "20px",
                    flexShrink: 0,
                  }}
                >
                  <ServiceIcon iconType={service.icon} size={28} />
                </div>
                <h3
                  className="text-18 fw-600 text-dark-1"
                  style={{ lineHeight: 1.4, marginBottom: "12px" }}
                >
                  {pt(service.titleKey)}
                </h3>
                <p
                  className="text-14 text-light-2 lh-17"
                  style={{ marginBottom: 0, flex: 1 }}
                >
                  {pt(service.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Programs                                                                   */
/* -------------------------------------------------------------------------- */

function ProgramsSection({ programs, tableLabels, title, subtitle, isRTL }) {
  return (
    <section
      className="pilgrimage-programs-section haj-programs-section layout-pt-lg layout-pb-lg"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
        direction: isRTL ? "rtl" : "ltr",
        padding: "60px 0 80px",
      }}
    >
      <div className="container" style={{ padding: "0 30px" }}>
        {(title || subtitle) && (
          <div className="row justify-center text-center mb-50">
            <div className="col-lg-9">
              {title && (
                <h2
                  className="pilgrimage-section-title text-30 md:text-24 fw-700 text-dark-1 mb-15"
                  style={{
                    lineHeight: 1.5,
                    fontFamily: "'Noto Kufi Arabic', sans-serif",
                  }}
                  data-aos="fade-up"
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p
                  className="pilgrimage-section-subtitle text-15 text-light-2 lh-18"
                  style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        <TierTabs
          programs={programs}
          tableLabels={tableLabels}
          isRTL={isRTL}
          CardComponent={UmrahProgramCard}
          allLabel={isRTL ? "كل البرامج" : "All packages"}
        />
      </div>
    </section>
  );
}
