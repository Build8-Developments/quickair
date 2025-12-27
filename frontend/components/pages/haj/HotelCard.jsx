"use client";
import React from "react";

/**
 * HotelCard Component
 * Displays hotel information for Hajj packages including location, name, features, and dates
 *
 * @param {Object} props
 * @param {Object} props.hotel - Hotel data object
 * @param {string} props.hotel.location - Hotel location (المدينة المنورة / مكة المكرمة)
 * @param {string} props.hotel.name - Hotel name
 * @param {string[]} props.hotel.features - Array of hotel features
 * @param {string} props.hotel.nightsDates - Duration and dates information
 * @param {boolean} props.isRTL - Whether to use RTL layout
 *
 * Requirements: 3.5, 3.6, 4.3, 4.4, 6.2, 6.3
 */
export default function HotelCard({ hotel, isRTL = true }) {
  if (!hotel) return null;

  const { location, name, features = [], nightsDates } = hotel;

  // Determine location badge color based on city
  const isMadinah =
    location?.includes("المدينة") ||
    location?.toLowerCase().includes("madinah");
  const badgeColor = isMadinah ? "#2e7d32" : "#1565c0"; // Green for Madinah, Blue for Makkah

  return (
    <div
      className="hotel-card bg-white rounded-12 border-1 border-light-1"
      style={{
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
        transition: "all 0.3s ease",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
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
      {/* Location Badge */}
      <div
        style={{
          backgroundColor: badgeColor,
          color: "#ffffff",
          padding: "12px 20px",
          fontSize: "14px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexDirection: "row",
          justifyContent: isRTL ? "flex-start" : "flex-start",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          style={{
            width: "18px",
            height: "18px",
            fill: "currentColor",
            flexShrink: 0,
          }}
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        <span>{location}</span>
      </div>

      {/* Card Content */}
      <div
        style={{
          padding: "25px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Hotel Name */}
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#1a1a2e",
            marginBottom: "20px",
            lineHeight: 1.4,
          }}
        >
          {name}
        </h3>

        {/* Features List */}
        {features.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 20px 0",
              flex: 1,
            }}
          >
            {features.map((feature, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  marginBottom: "12px",
                  fontSize: "14px",
                  color: "#555",
                  lineHeight: 1.6,
                  flexDirection: "row",
                }}
              >
                <span
                  style={{
                    color: "var(--color-accent-1)",
                    fontSize: "16px",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  ✓
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Nights/Dates Footer */}
        {nightsDates && (
          <div
            style={{
              borderTop: "1px solid #eee",
              paddingTop: "15px",
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--color-accent-1)",
              fontSize: "14px",
              fontWeight: 600,
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              style={{
                width: "18px",
                height: "18px",
                fill: "currentColor",
                flexShrink: 0,
              }}
            >
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
            </svg>
            <span>{nightsDates}</span>
          </div>
        )}
      </div>
    </div>
  );
}
