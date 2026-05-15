"use client";
import React from "react";
import { usePilgrimageContent } from "@/contexts/PilgrimageContentContext";

/**
 * UmrahStepsSection Component for Omra Page
 * Displays the 4 main steps of performing Umrah in numbered cards
 * Requirements: 8.1, 8.2, 8.3
 */
export default function UmrahStepsSection({ isRTL }) {
  const { pt } = usePilgrimageContent();

  // Define the 4 Umrah steps with their translation keys
  const umrahSteps = [
    {
      id: "ihram",
      number: 1,
      titleKey: "omra.steps.ihram.title",
      descKey: "omra.steps.ihram.description",
    },
    {
      id: "tawaf",
      number: 2,
      titleKey: "omra.steps.tawaf.title",
      descKey: "omra.steps.tawaf.description",
    },
    {
      id: "sai",
      number: 3,
      titleKey: "omra.steps.sai.title",
      descKey: "omra.steps.sai.description",
    },
    {
      id: "halq",
      number: 4,
      titleKey: "omra.steps.halq.title",
      descKey: "omra.steps.halq.description",
    },
  ];

  return (
    <section
      className="umrah-steps-section layout-pt-lg layout-pb-lg"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="row justify-center text-center mb-50">
          <div className="col-lg-8">
            <span
              className="text-accent-1 text-15 fw-500 mb-10 d-block"
              data-aos="fade-up"
            >
              {pt("steps.title")}
            </span>
            <h2
              className="text-30 md:text-24 fw-700 text-dark-1 mb-15"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {pt("steps.subtitle")}
            </h2>
            <p
              className="text-15 text-light-2 lh-18"
              data-aos="fade-up"
              data-aos-delay="200"
              style={{ textAlign: "center" }}
            >
              {pt("steps.description")}
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="row y-gap-30 justify-center">
          {umrahSteps.map((step, index) => (
            <div
              key={step.id}
              className="col-lg-3 col-md-6"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div
                className="step-card bg-white rounded-12 h-100 border-1 border-light-1"
                style={{
                  padding: "30px 25px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 15px 50px rgba(1, 159, 177, 0.2)";
                  e.currentTarget.style.borderColor = "var(--color-accent-1)";
                  e.currentTarget.style.transform = "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "var(--color-light-1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Step Number Circle */}
                <div
                  className="d-flex items-center justify-center rounded-full text-white fw-700 mx-auto mb-20"
                  style={{
                    width: "65px",
                    height: "65px",
                    backgroundColor: "var(--color-accent-1)",
                    fontSize: "24px",
                    boxShadow: "0 8px 25px rgba(1, 159, 177, 0.3)",
                  }}
                >
                  {step.number}
                </div>

                {/* Step Title */}
                <h3
                  className="text-18 fw-600 text-dark-1 mb-15"
                  style={{
                    lineHeight: 1.4,
                    fontFamily: isRTL
                      ? "'Noto Kufi Arabic', sans-serif"
                      : "inherit",
                  }}
                >
                  {pt(step.titleKey)}
                </h3>

                {/* Step Description */}
                <p
                  className="text-14 text-light-2 lh-17"
                  style={{
                    marginBottom: 0,
                    lineHeight: 1.7,
                  }}
                >
                  {pt(step.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
