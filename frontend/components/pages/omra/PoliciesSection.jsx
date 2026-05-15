"use client";
import React from "react";
import { usePilgrimageContent } from "@/contexts/PilgrimageContentContext";

/**
 * PoliciesSection Component for Omra Page
 * Displays all program policies including inclusions, exclusions, exchange rate,
 * room policy, payment policy, cancellation policy, and required documents
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
 *
 * @param {Object} props
 * @param {boolean} props.isRTL - Whether to use RTL layout
 */
export default function PoliciesSection({ isRTL }) {
  const { pt } = usePilgrimageContent();

  const inclusions = pt("policies.inclusions.items", {
    returnObjects: true,
  });
  const exclusions = pt("policies.exclusions.items", {
    returnObjects: true,
  });
  const cancellationRules = pt("policies.cancellation.rules", {
    returnObjects: true,
  });
  const documents = pt("policies.documents.items", { returnObjects: true });

  // Icon components for visual distinction
  const CheckIcon = () => (
    <svg
      viewBox="0 0 24 24"
      style={{ width: "20px", height: "20px", fill: "#28a745", flexShrink: 0 }}
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );

  const CloseIcon = () => (
    <svg
      viewBox="0 0 24 24"
      style={{ width: "20px", height: "20px", fill: "#dc3545", flexShrink: 0 }}
    >
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );

  const ExchangeIcon = () => (
    <svg
      viewBox="0 0 24 24"
      style={{
        width: "22px",
        height: "22px",
        fill: "var(--color-accent-1)",
        flexShrink: 0,
      }}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
    </svg>
  );

  const RoomIcon = () => (
    <svg
      viewBox="0 0 24 24"
      style={{
        width: "22px",
        height: "22px",
        fill: "var(--color-accent-1)",
        flexShrink: 0,
      }}
    >
      <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
    </svg>
  );

  const PaymentIcon = () => (
    <svg
      viewBox="0 0 24 24"
      style={{
        width: "22px",
        height: "22px",
        fill: "var(--color-accent-1)",
        flexShrink: 0,
      }}
    >
      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
    </svg>
  );

  const CancelIcon = () => (
    <svg
      viewBox="0 0 24 24"
      style={{ width: "22px", height: "22px", fill: "#dc3545", flexShrink: 0 }}
    >
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
    </svg>
  );

  const DocumentIcon = () => (
    <svg
      viewBox="0 0 24 24"
      style={{ width: "22px", height: "22px", fill: "#d4af37", flexShrink: 0 }}
    >
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
  );

  // Card style for policy sections
  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    height: "100%",
  };

  const cardHeaderStyle = {
    display: "flex",
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
  };

  const cardTitleStyle = {
    fontSize: "18px",
    fontWeight: 600,
    color: "var(--color-dark-1)",
    margin: 0,
    fontFamily: isRTL ? "'Noto Kufi Arabic', sans-serif" : "inherit",
  };

  const listItemStyle = {
    display: "flex",
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "12px",
    fontSize: "14px",
    lineHeight: 1.7,
    color: "var(--color-light-2)",
    textAlign: isRTL ? "right" : "left",
  };

  return (
    <section
      className="policies-section layout-pt-lg layout-pb-lg"
      style={{
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
        direction: isRTL ? "rtl" : "ltr",
        padding: "80px 0",
      }}
    >
      <div className="container" style={{ padding: "0 30px" }}>
        {/* Section Header */}
        <div
          className="row justify-center text-center mb-50"
          data-aos="fade-up"
        >
          <div className="col-lg-8">
            <h2
              className="text-30 md:text-24 fw-700 text-dark-1 mb-15"
              style={{
                lineHeight: 1.5,
                fontFamily: isRTL
                  ? "'Noto Kufi Arabic', sans-serif"
                  : "inherit",
              }}
            >
              {pt("policies.title")}
            </h2>
          </div>
        </div>

        {/* Policies Grid */}
        <div className="row y-gap-30">
          {/* Inclusions Card */}
          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(40, 167, 69, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckIcon />
                </div>
                <h3 style={{ ...cardTitleStyle, color: "#28a745" }}>
                  {pt("policies.inclusions.title")}
                </h3>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {Array.isArray(inclusions) &&
                  inclusions.map((item, index) => (
                    <li key={index} style={listItemStyle}>
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Exclusions Card */}
          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(220, 53, 69, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CloseIcon />
                </div>
                <h3 style={{ ...cardTitleStyle, color: "#dc3545" }}>
                  {pt("policies.exclusions.title")}
                </h3>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {Array.isArray(exclusions) &&
                  exclusions.map((item, index) => (
                    <li key={index} style={listItemStyle}>
                      <CloseIcon />
                      <span>{item}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Exchange Rate Card */}
          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="300">
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(1, 159, 177, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ExchangeIcon />
                </div>
                <h3 style={cardTitleStyle}>
                  {pt("policies.exchangeRate.title")}
                </h3>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(1, 159, 177, 0.05)",
                  borderRadius: "8px",
                  padding: "15px 20px",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "var(--color-accent-1)",
                    marginBottom: "5px",
                  }}
                >
                  1 SAR = {pt("policies.exchangeRate.rate")} EGP
                </div>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--color-light-2)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {pt("policies.exchangeRate.note")}
              </p>
            </div>
          </div>

          {/* Room Policy Card */}
          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="400">
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(1, 159, 177, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RoomIcon />
                </div>
                <h3 style={cardTitleStyle}>
                  {pt("policies.roomPolicy.title")}
                </h3>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--color-light-2)",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                {pt("policies.roomPolicy.description")}
              </p>
            </div>
          </div>

          {/* Payment Policy Card */}
          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="500">
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(1, 159, 177, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PaymentIcon />
                </div>
                <h3 style={cardTitleStyle}>
                  {pt("policies.paymentPolicy.title")}
                </h3>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-accent-1)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "16px",
                    }}
                  >
                    75%
                  </div>
                  <span
                    style={{ fontSize: "14px", color: "var(--color-light-2)" }}
                  >
                    {pt("policies.paymentPolicy.initialPayment")}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(1, 159, 177, 0.2)",
                      color: "var(--color-accent-1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "16px",
                    }}
                  >
                    25%
                  </div>
                  <span
                    style={{ fontSize: "14px", color: "var(--color-light-2)" }}
                  >
                    {pt("policies.paymentPolicy.finalPayment")}
                  </span>
                </div>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-light-2)",
                  lineHeight: 1.7,
                  margin: 0,
                  fontStyle: "italic",
                  backgroundColor: "rgba(0, 0, 0, 0.03)",
                  padding: "10px 15px",
                  borderRadius: "6px",
                }}
              >
                {pt("policies.paymentPolicy.note")}
              </p>
            </div>
          </div>

          {/* Cancellation Policy Card */}
          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="600">
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(220, 53, 69, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CancelIcon />
                </div>
                <h3 style={{ ...cardTitleStyle, color: "#dc3545" }}>
                  {pt("policies.cancellation.title")}
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {Array.isArray(cancellationRules) &&
                  cancellationRules.map((rule, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: isRTL ? "row-reverse" : "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 15px",
                        backgroundColor:
                          rule.penalty === 100
                            ? "rgba(220, 53, 69, 0.1)"
                            : rule.penalty === 75
                            ? "rgba(255, 193, 7, 0.1)"
                            : "rgba(40, 167, 69, 0.1)",
                        borderRadius: "8px",
                        borderLeft: isRTL
                          ? "none"
                          : `4px solid ${
                              rule.penalty === 100
                                ? "#dc3545"
                                : rule.penalty === 75
                                ? "#ffc107"
                                : "#28a745"
                            }`,
                        borderRight: isRTL
                          ? `4px solid ${
                              rule.penalty === 100
                                ? "#dc3545"
                                : rule.penalty === 75
                                ? "#ffc107"
                                : "#28a745"
                            }`
                          : "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          color: "var(--color-dark-1)",
                          fontWeight: 500,
                        }}
                      >
                        {rule.period}
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color:
                            rule.penalty === 100
                              ? "#dc3545"
                              : rule.penalty === 75
                              ? "#b8860b"
                              : "#28a745",
                        }}
                      >
                        {rule.penalty}%{" "}
                        {pt("policies.cancellation.penaltyText")}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Required Documents Card - Full Width */}
          <div className="col-12" data-aos="fade-up" data-aos-delay="700">
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(212, 175, 55, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DocumentIcon />
                </div>
                <h3 style={{ ...cardTitleStyle, color: "#b8860b" }}>
                  {pt("policies.documents.title")}
                </h3>
              </div>
              <div
                className="row y-gap-15"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "15px",
                }}
              >
                {Array.isArray(documents) &&
                  documents.map((doc, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: isRTL ? "row-reverse" : "row",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "15px",
                        backgroundColor: "rgba(212, 175, 55, 0.05)",
                        borderRadius: "8px",
                        border: "1px solid rgba(212, 175, 55, 0.15)",
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: "#d4af37",
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 600,
                          fontSize: "13px",
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </div>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "var(--color-dark-1)",
                          lineHeight: 1.6,
                        }}
                      >
                        {doc}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
