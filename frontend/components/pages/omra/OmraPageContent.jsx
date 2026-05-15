"use client";
import React from "react";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import UmrahStepsSection from "./UmrahStepsSection";
import PremiumPackageSection from "./PremiumPackageSection";
import EconomyPackageSection from "./EconomyPackageSection";
import PoliciesSection from "./PoliciesSection";

/**
 * OmraPageContent - Main content component for the Omra (Umrah) page
 * Renders all sections in order using modular components
 * Requirements: 6.1, 6.2, 6.3, 6.6, 6.7
 *
 * @param {Object} props
 * @param {string} props.locale - Current locale ("ar" or "en")
 */
export default function OmraPageContent({ locale }) {
  // Determine RTL/LTR direction based on locale
  const isRTL = locale === "ar";

  return (
    <div
      className="omra-page-content"
      style={{
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* Hero Section - Full-width background with title and subtitle */}
      <HeroSection isRTL={isRTL} />

      {/* Umrah Steps Section - 4 step cards for Ihram, Tawaf, Sa'i, Halq */}
      <UmrahStepsSection isRTL={isRTL} />

      {/* Premium Package Section - 6 premium package cards */}
      <PremiumPackageSection isRTL={isRTL} />

      {/* Economy Package Section - Economy package with travel info */}
      <EconomyPackageSection isRTL={isRTL} />

      {/* Policies Section - Inclusions, exclusions, cancellation, documents */}
      <PoliciesSection isRTL={isRTL} />
    </div>
  );
}
