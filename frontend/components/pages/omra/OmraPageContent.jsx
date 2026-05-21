"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import UmrahStepsSection from "./UmrahStepsSection";
import UmrahProgramCard from "./UmrahProgramCard";
import { usePilgrimageContent } from "@/contexts/PilgrimageContentContext";

/**
 * OmraPageContent - Main content component for the Omra (Umrah) page.
 *
 * Renders, in order:
 * - Hero
 * - Umrah steps
 * - Programs section: a data-driven list of Umrah programs (mirrors the
 *   printed brochure layout). Programs come from Strapi when available,
 *   otherwise fall back to translation files via `pt()`.
 */
export default function OmraPageContent({ locale }) {
  const isRTL = locale === "ar";
  const { content } = usePilgrimageContent();
  const { t, i18n } = useTranslation();

  // Read programs from Strapi content first; fall back to translations directly
  // (we bypass `pt()` because i18next's t() with returnObjects can be flaky
  // when the key resolves to a deep array.)
  const arPrograms = i18n.getResource("ar", "translation", "omra.programs");
  const enPrograms = i18n.getResource("en", "translation", "omra.programs");
  const fallbackPrograms = locale === "ar" ? arPrograms : enPrograms;

  const programs =
    Array.isArray(content?.programs) && content.programs.length > 0
      ? content.programs
      : Array.isArray(fallbackPrograms)
        ? fallbackPrograms
        : [];

  const arTableLabels = i18n.getResource("ar", "translation", "omra.tableLabels");
  const enTableLabels = i18n.getResource("en", "translation", "omra.tableLabels");
  const fallbackTableLabels = locale === "ar" ? arTableLabels : enTableLabels;
  const tableLabels =
    content?.tableLabels && typeof content.tableLabels === "object"
      ? content.tableLabels
      : fallbackTableLabels && typeof fallbackTableLabels === "object"
        ? fallbackTableLabels
        : {};

  const sectionTitle =
    content?.programsSection?.title ||
    t(`omra.programsSection.title`);
  const sectionSubtitle =
    content?.programsSection?.subtitle ||
    t(`omra.programsSection.subtitle`);

  return (
    <div
      className="omra-page-content"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <UmrahStepsSection isRTL={isRTL} />

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

function ProgramsSection({ programs, tableLabels, title, subtitle, isRTL }) {
  return (
    <section
      className="pilgrimage-programs-section umrah-programs-section layout-pt-lg layout-pb-lg"
      style={{
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
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
                  style={{
                    fontFamily: "'Noto Kufi Arabic', sans-serif",
                  }}
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        <div
          className="programs-list"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
          }}
        >
          {programs.map((program, idx) => (
            <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100}>
              <UmrahProgramCard
                program={program}
                tableLabels={tableLabels}
                isRTL={isRTL}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
