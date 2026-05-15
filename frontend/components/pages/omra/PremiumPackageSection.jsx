"use client";
import React from "react";
import { usePilgrimageContent } from "@/contexts/PilgrimageContentContext";
import PackageCard from "./PackageCard";

/**
 * PremiumPackageSection Component for Omra Page
 * Displays the Premium Umrah packages with 6 package cards
 * Requirements: 3.1, 3.2, 3.7
 *
 * @param {Object} props
 * @param {boolean} props.isRTL - Whether to use RTL layout
 */
export default function PremiumPackageSection({ isRTL }) {
  const { pt } = usePilgrimageContent();

  const packages = pt("premium.packages", { returnObjects: true });

  return (
    <section
      className="premium-package-section layout-pt-lg layout-pb-lg"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
        direction: isRTL ? "rtl" : "ltr",
        padding: "80px 0",
      }}
    >
      <div className="container" style={{ padding: "0 30px" }}>
        {/* Section Header */}
        <div
          className="row justify-center text-center mb-40"
          data-aos="fade-up"
        >
          <div className="col-lg-10">
            {/* Premium Badge */}
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
              <span>{pt("premium.badge")}</span>
            </div>

            {/* Section Title */}
            <h2
              className="text-30 md:text-24 fw-700 text-dark-1 mb-15"
              style={{
                lineHeight: 1.5,
                fontFamily: isRTL
                  ? "'Noto Kufi Arabic', sans-serif"
                  : "inherit",
              }}
            >
              {pt("premium.title")}
            </h2>

            {/* Duration */}
            <div
              className="duration-badge"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "rgba(1, 159, 177, 0.1)",
                color: "var(--color-accent-1)",
                padding: "10px 20px",
                borderRadius: "25px",
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "15px",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{ width: "20px", height: "20px", fill: "currentColor" }}
              >
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              <span>{pt("premium.duration")}</span>
            </div>
          </div>
        </div>

        {/* Haramain Train Feature */}
        <div
          className="row justify-center mb-40"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="col-lg-8">
            <div
              className="haramain-train-feature rounded-12"
              style={{
                backgroundColor: "rgba(1, 159, 177, 0.08)",
                border: "1px solid rgba(1, 159, 177, 0.2)",
                padding: "20px 25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "15px",
                flexDirection: "row",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: "28px",
                  height: "28px",
                  fill: "var(--color-accent-1)",
                  flexShrink: 0,
                }}
              >
                <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "var(--color-accent-1)",
                  fontFamily: isRTL
                    ? "'Noto Kufi Arabic', sans-serif"
                    : "inherit",
                }}
              >
                {pt("premium.haramainTrain")}
              </span>
            </div>
          </div>
        </div>

        {/* Package Cards Grid */}
        <div
          className="packages-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "25px",
          }}
        >
          {Array.isArray(packages) &&
            packages.map((pkg, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={100 + index * 100}
              >
                <PackageCard
                  makkahHotel={pkg.makkahHotel}
                  makkahNights={pkg.makkahNights}
                  makkahMeals={pkg.makkahMeals}
                  madinahHotel={pkg.madinahHotel}
                  madinahNights={pkg.madinahNights}
                  madinahMeals={pkg.madinahMeals}
                  prices={pkg.prices}
                  isRTL={isRTL}
                  isFeatured={index === 0}
                />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
