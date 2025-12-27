"use client";
import React from "react";
import Image from "next/image";

/**
 * RitualCard Component
 * Displays ritual information for Hajj packages (Arafat and Mina rituals)
 * Features optional image, title with decorative border, description, and features list
 *
 * @param {Object} props
 * @param {Object} props.ritual - Ritual data object
 * @param {string} props.ritual.title - Ritual title
 * @param {string} [props.ritual.description] - Ritual description text
 * @param {string[]} [props.ritual.features] - Array of feature strings for Mina rituals
 * @param {string} [props.ritual.imageUrl] - Optional image URL (e.g., Mina towers)
 * @param {boolean} props.isRTL - Whether to use RTL layout
 *
 * Requirements: 3.8, 3.9, 4.7, 4.8, 6.2, 6.3
 */
export default function RitualCard({ ritual, isRTL = true }) {
  if (!ritual) return null;

  const { title, description, features, imageUrl } = ritual;

  return (
    <div
      className="ritual-card bg-white rounded-12 border-1 border-light-1 overflow-hidden"
      style={{
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 15px 50px rgba(1, 159, 177, 0.2)";
        e.currentTarget.style.borderColor = "var(--color-accent-1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "var(--color-light-1)";
      }}
    >
      {/* Optional Image */}
      {imageUrl && (
        <div
          className="ritual-image"
          style={{
            position: "relative",
            width: "100%",
            height: "200px",
            overflow: "hidden",
          }}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            style={{
              objectFit: "cover",
            }}
            unoptimized // For external URLs
          />
          {/* Gradient overlay for better text readability */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60px",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
            }}
          />
        </div>
      )}

      {/* Content Container */}
      <div
        className="ritual-content"
        style={{
          padding: "25px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Title with Decorative Border */}
        <div
          className="ritual-title-container"
          style={{
            marginBottom: "20px",
            paddingBottom: "15px",
            borderBottom: "2px solid rgba(1, 159, 177, 0.2)",
            position: "relative",
          }}
        >
          {/* Decorative accent line */}
          <div
            style={{
              position: "absolute",
              bottom: "-2px",
              [isRTL ? "right" : "left"]: 0,
              width: "60px",
              height: "2px",
              backgroundColor: "var(--color-accent-1)",
            }}
          />

          {/* Title Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexDirection: "row",
            }}
          >
            <div
              className="d-flex items-center justify-center rounded-full"
              style={{
                width: "45px",
                height: "45px",
                backgroundColor: "rgba(1, 159, 177, 0.1)",
                color: "var(--color-accent-1)",
                flexShrink: 0,
              }}
            >
              {/* Mosque/Ritual Icon */}
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: "24px",
                  height: "24px",
                  fill: "currentColor",
                }}
              >
                <path d="M12 2C8 2 4 6 4 10c0 2.5 1.5 4.5 3 6v4h10v-4c1.5-1.5 3-3.5 3-6 0-4-4-8-8-8zm0 2c3 0 6 3 6 6 0 1.5-.5 3-2 4.5V18H8v-3.5C6.5 13 6 11.5 6 10c0-3 3-6 6-6zm-1 4v2H9v2h2v2h2v-2h2v-2h-2V8h-2z" />
              </svg>
            </div>

            <h3
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#1a1a2e",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {title}
            </h3>
          </div>
        </div>

        {/* Description Text */}
        {description && (
          <p
            className="ritual-description"
            style={{
              fontSize: "14px",
              color: "#555",
              lineHeight: 1.8,
              marginBottom: features && features.length > 0 ? "20px" : 0,
            }}
          >
            {description}
          </p>
        )}

        {/* Features List for Mina Rituals */}
        {features && features.length > 0 && (
          <div
            className="ritual-features"
            style={{
              flex: 1,
            }}
          >
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {features.map((feature, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    fontSize: "14px",
                    color: "#555",
                    lineHeight: 1.6,
                    flexDirection: "row",
                  }}
                >
                  {/* Checkmark Icon */}
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "20px",
                      height: "20px",
                      backgroundColor: "rgba(1, 159, 177, 0.1)",
                      borderRadius: "50%",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      style={{
                        width: "12px",
                        height: "12px",
                        fill: "var(--color-accent-1)",
                      }}
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
