"use client";
import React from "react";
import { usePilgrimageContent } from "@/contexts/PilgrimageContentContext";

/**
 * Room type icon component - renders appropriate icon based on room type
 */
function RoomIcon({ type, size = 28 }) {
  const iconStyle = {
    width: size,
    height: size,
    fill: "currentColor",
  };

  const icons = {
    double: (
      <svg viewBox="0 0 24 24" style={iconStyle}>
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    triple: (
      <svg viewBox="0 0 24 24" style={iconStyle}>
        <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85-.85-.37-1.79-.58-2.78-.58-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
      </svg>
    ),
    quad: (
      <svg viewBox="0 0 24 24" style={iconStyle}>
        <path d="M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
      </svg>
    ),
  };

  return icons[type] || icons.double;
}

/**
 * PricingTable Component
 * Displays pricing information for Hajj packages in a card grid layout
 * Requirements: 3.3, 3.7, 4.2, 4.5, 6.2, 6.3
 */
export default function PricingTable({
  pricing,
  reservationAmount,
  isRTL = true,
}) {
  const { pt } = usePilgrimageContent();

  if (!pricing) return null;

  const { doubleRoom, tripleRoom, quadRoom, note } = pricing;

  const roomTypes = [
    {
      id: "double",
      label: pt("pricing.doubleRoom"),
      desc: pt("pricing.doubleRoomDesc"),
      price: doubleRoom,
      icon: "double",
    },
    {
      id: "triple",
      label: pt("pricing.tripleRoom"),
      desc: pt("pricing.tripleRoomDesc"),
      price: tripleRoom,
      icon: "triple",
    },
    {
      id: "quad",
      label: pt("pricing.quadRoom"),
      desc: pt("pricing.quadRoomDesc"),
      price: quadRoom,
      icon: "quad",
    },
  ];

  return (
    <div
      className="pricing-table"
      style={{
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      {reservationAmount && (
        <div
          className="reservation-amount bg-accent-1 rounded-12"
          style={{
            padding: "20px 25px",
            marginBottom: "25px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "15px",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexDirection: "row",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              style={{
                width: "24px",
                height: "24px",
                fill: "#ffffff",
                flexShrink: 0,
              }}
            >
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
            <span
              style={{ color: "#ffffff", fontSize: "15px", fontWeight: 500 }}
            >
              {pt("vipPackage.reservationAmount")}
            </span>
          </div>
          <span style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700 }}>
            {reservationAmount}
          </span>
        </div>
      )}

      <div
        className="pricing-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: note ? "20px" : 0,
        }}
      >
        {roomTypes.map((room) => (
          <div
            key={room.id}
            className="pricing-card bg-white rounded-12 border-1 border-light-1"
            style={{
              padding: "25px",
              textAlign: "center",
              transition: "all 0.3s ease",
              cursor: "pointer",
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
              className="d-flex items-center justify-center rounded-full mx-auto"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "rgba(1, 159, 177, 0.1)",
                color: "var(--color-accent-1)",
                marginBottom: "15px",
              }}
            >
              <RoomIcon type={room.icon} size={28} />
            </div>
            <h4
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#1a1a2e",
                marginBottom: "5px",
              }}
            >
              {room.label}
            </h4>
            <p
              style={{ fontSize: "13px", color: "#888", marginBottom: "15px" }}
            >
              {room.desc}
            </p>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--color-accent-1)",
                lineHeight: 1.2,
              }}
            >
              {room.price}
            </div>
          </div>
        ))}
      </div>

      {note && (
        <div
          className="pricing-note rounded-8"
          style={{
            backgroundColor: "rgba(1, 159, 177, 0.08)",
            padding: "15px 20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            style={{
              width: "20px",
              height: "20px",
              fill: "var(--color-accent-1)",
              flexShrink: 0,
            }}
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          <span style={{ fontSize: "14px", color: "#555", fontWeight: 500 }}>
            {note}
          </span>
        </div>
      )}
    </div>
  );
}
