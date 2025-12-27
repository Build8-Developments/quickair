"use client";
import React from "react";
import { useTranslation } from "react-i18next";

/**
 * PackageCard Component for Omra Page
 * Displays hotel information and pricing for Umrah packages
 * Requirements: 3.3, 3.4, 3.5, 3.6
 */
export default function PackageCard({
  makkahHotel,
  makkahNights,
  makkahMeals,
  madinahHotel,
  madinahNights,
  madinahMeals,
  prices,
  isRTL,
  isFeatured = false,
}) {
  const { t } = useTranslation();

  // formatPrice function - COMMENTED OUT (pricing table hidden)
  // const formatPrice = (price) => {
  //   if (price === null || price === undefined) {
  //     return t("omra.pricing.notAvailable");
  //   }
  //   return `${price.toLocaleString()} ${t("omra.pricing.currency")}`;
  // };

  // SVG Icons
  const NightsIcon = ({ color }) => (
    <svg
      viewBox="0 0 24 24"
      style={{ width: "14px", height: "14px", fill: color }}
    >
      <path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z" />
    </svg>
  );

  const MealsIcon = ({ color }) => (
    <svg
      viewBox="0 0 24 24"
      style={{ width: "14px", height: "14px", fill: color }}
    >
      <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
    </svg>
  );

  const HotelIcon = ({ color }) => (
    <svg
      viewBox="0 0 24 24"
      style={{ width: "16px", height: "16px", fill: color }}
    >
      <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
    </svg>
  );

  return (
    <div
      className="package-card bg-white rounded-12 h-100 border-1 border-light-1"
      style={{
        padding: "25px",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 15px 50px rgba(1, 159, 177, 0.2)";
        e.currentTarget.style.borderColor = "var(--color-accent-1)";
        e.currentTarget.style.transform = "translateY(-5px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "var(--color-light-1)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div
          style={{
            position: "absolute",
            top: "15px",
            [isRTL ? "left" : "right"]: "15px",
            backgroundColor: "#d4af37",
            color: "#ffffff",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          {t("hotel.featured")}
        </div>
      )}

      {/* Makkah Hotel Info */}
      <div
        style={{
          paddingBottom: "15px",
          marginBottom: "20px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
            justifyContent: isRTL ? "flex-end" : "flex-start",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "rgba(1, 159, 177, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HotelIcon color="var(--color-accent-1)" />
          </div>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--color-accent-1)",
            }}
          >
            {t("omra.pricing.makkah")}
          </span>
        </div>
        <h4
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--color-dark-1)",
            marginBottom: "8px",
            fontFamily: isRTL ? "'Noto Kufi Arabic', sans-serif" : "inherit",
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {makkahHotel}
        </h4>
        <div
          style={{
            display: "flex",
            flexDirection: isRTL ? "row-reverse" : "row",
            flexWrap: "wrap",
            gap: "15px",
            justifyContent: isRTL ? "flex-end" : "flex-start",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              color: "var(--color-light-2)",
              display: "flex",
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <NightsIcon color="var(--color-light-2)" />
            {makkahNights} {t("omra.pricing.nights")}
          </span>
          <span
            style={{
              fontSize: "13px",
              color: "var(--color-light-2)",
              display: "flex",
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <MealsIcon color="var(--color-light-2)" />
            {makkahMeals}
          </span>
        </div>
      </div>

      {/* Madinah Hotel Info */}
      <div
        style={{
          paddingBottom: "15px",
          // marginBottom: "20px", // Commented out - no pricing table below
          // borderBottom: "1px solid rgba(0, 0, 0, 0.08)", // Commented out
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
            justifyContent: isRTL ? "flex-end" : "flex-start",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "rgba(40, 167, 69, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HotelIcon color="#28a745" />
          </div>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#28a745" }}>
            {t("omra.pricing.madinah")}
          </span>
        </div>
        <h4
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--color-dark-1)",
            marginBottom: "8px",
            fontFamily: isRTL ? "'Noto Kufi Arabic', sans-serif" : "inherit",
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {madinahHotel}
        </h4>
        <div
          style={{
            display: "flex",
            flexDirection: isRTL ? "row-reverse" : "row",
            flexWrap: "wrap",
            gap: "15px",
            justifyContent: isRTL ? "flex-end" : "flex-start",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              color: "var(--color-light-2)",
              display: "flex",
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <NightsIcon color="var(--color-light-2)" />
            {madinahNights} {t("omra.pricing.nights")}
          </span>
          <span
            style={{
              fontSize: "13px",
              color: "var(--color-light-2)",
              display: "flex",
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <MealsIcon color="var(--color-light-2)" />
            {madinahMeals}
          </span>
        </div>
      </div>

      {/* Pricing Table - COMMENTED OUT */}
      {/* <div>
        <h5
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--color-dark-1)",
            marginBottom: "15px",
            fontFamily: isRTL ? "'Noto Kufi Arabic', sans-serif" : "inherit",
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t("hotel.roomPricing")}
        </h5>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: isRTL ? "row-reverse" : "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 12px",
              backgroundColor: "rgba(1, 159, 177, 0.05)",
              borderRadius: "8px",
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--color-dark-1)" }}>
              {t("omra.pricing.doubleRoom")}
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--color-accent-1)",
              }}
            >
              {formatPrice(prices?.double)}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: isRTL ? "row-reverse" : "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 12px",
              backgroundColor: "rgba(0, 0, 0, 0.02)",
              borderRadius: "8px",
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--color-dark-1)" }}>
              {t("omra.pricing.tripleRoom")}
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--color-accent-1)",
              }}
            >
              {formatPrice(prices?.triple)}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: isRTL ? "row-reverse" : "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 12px",
              backgroundColor:
                prices?.quad === null
                  ? "rgba(0, 0, 0, 0.02)"
                  : "rgba(40, 167, 69, 0.05)",
              borderRadius: "8px",
              opacity: prices?.quad === null ? 0.6 : 1,
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--color-dark-1)" }}>
              {t("omra.pricing.quadRoom")}
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color:
                  prices?.quad === null ? "var(--color-light-2)" : "#28a745",
              }}
            >
              {formatPrice(prices?.quad)}
            </span>
          </div>
        </div>

        <p
          style={{
            fontSize: "12px",
            color: "var(--color-light-2)",
            marginTop: "15px",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          {t("omra.pricing.perPerson")}
        </p>
      </div> */}
    </div>
  );
}
