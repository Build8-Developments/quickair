"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import PackageCard from "./PackageCard";

/**
 * EconomyPackageSection Component for Omra Page
 * Displays the Economy Umrah package with travel info and package card
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7
 *
 * @param {Object} props
 * @param {boolean} props.isRTL - Whether to use RTL layout
 */
export default function EconomyPackageSection({ isRTL }) {
  const { t } = useTranslation();

  // Get economy package data from translations
  const economyPackage = t("omra.economy.package", { returnObjects: true });
  const travelDates = t("omra.economy.travelDates", { returnObjects: true });
  const fridayPrayers = t("omra.economy.fridayPrayers", {
    returnObjects: true,
  });

  return (
    <section
      className="economy-package-section layout-pt-lg layout-pb-lg"
      style={{
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
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
            {/* Economy Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#28a745",
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
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
              </svg>
              <span>{t("omra.economy.badge")}</span>
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
              {t("omra.economy.title")}
            </h2>

            {/* Duration */}
            <div
              className="duration-badge"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "rgba(40, 167, 69, 0.1)",
                color: "#28a745",
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
              <span>{t("omra.economy.duration")}</span>
            </div>
          </div>
        </div>

        {/* Travel Info Section */}
        <div
          className="row justify-center mb-40"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="col-lg-10">
            <div
              className="travel-info-card rounded-12"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(40, 167, 69, 0.2)",
                padding: "25px 30px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              }}
            >
              {/* Travel Route */}
              <div
                className="travel-route d-flex items-center justify-center mb-20"
                style={{
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  style={{
                    width: "24px",
                    height: "24px",
                    fill: "#28a745",
                    flexShrink: 0,
                  }}
                >
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--color-dark-1)",
                    fontFamily: isRTL
                      ? "'Noto Kufi Arabic', sans-serif"
                      : "inherit",
                  }}
                >
                  {t("omra.economy.route")}
                </span>
              </div>

              {/* Travel Dates */}
              <div
                className="travel-dates d-flex items-center justify-center mb-20"
                style={{
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  style={{
                    width: "22px",
                    height: "22px",
                    fill: "var(--color-accent-1)",
                    flexShrink: 0,
                  }}
                >
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
                </svg>
                <div
                  className="dates-list d-flex"
                  style={{
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  {Array.isArray(travelDates) &&
                    travelDates.map((date, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: "rgba(1, 159, 177, 0.1)",
                          color: "var(--color-accent-1)",
                          padding: "6px 14px",
                          borderRadius: "20px",
                          fontSize: "14px",
                          fontWeight: 500,
                          fontFamily: isRTL
                            ? "'Noto Kufi Arabic', sans-serif"
                            : "inherit",
                        }}
                      >
                        {date}
                      </span>
                    ))}
                </div>
              </div>

              {/* Friday Prayers */}
              <div
                className="friday-prayers d-flex items-center justify-center"
                style={{
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  style={{
                    width: "22px",
                    height: "22px",
                    fill: "#d4af37",
                    flexShrink: 0,
                  }}
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <div
                  className="prayers-list d-flex"
                  style={{
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  {Array.isArray(fridayPrayers) &&
                    fridayPrayers.map((prayer, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: "rgba(212, 175, 55, 0.1)",
                          color: "#b8860b",
                          padding: "6px 14px",
                          borderRadius: "20px",
                          fontSize: "14px",
                          fontWeight: 500,
                          fontFamily: isRTL
                            ? "'Noto Kufi Arabic', sans-serif"
                            : "inherit",
                        }}
                      >
                        {prayer}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Package Card */}
        <div
          className="row justify-center"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="col-lg-6 col-md-8">
            {economyPackage && (
              <PackageCard
                makkahHotel={economyPackage.makkahHotel}
                makkahNights={economyPackage.makkahNights}
                makkahMeals={economyPackage.makkahMeals}
                madinahHotel={economyPackage.madinahHotel}
                madinahNights={economyPackage.madinahNights}
                madinahMeals={economyPackage.madinahMeals}
                prices={economyPackage.prices}
                isRTL={isRTL}
                isFeatured={false}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
