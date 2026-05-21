"use client";
import React, { useState, useMemo } from "react";

/**
 * TierTabs — Groups programs by `tier` and renders them in tabbed sections.
 *
 * If all programs share the same tier (or none have a tier), it renders
 * them flat without tabs. Otherwise it shows a pill-style tab bar at the top.
 *
 * @param {Object} props
 * @param {Array} props.programs - Array of program objects (each may have a `tier` field)
 * @param {Object} props.tableLabels - Common table labels
 * @param {boolean} props.isRTL
 * @param {React.ComponentType} props.CardComponent - The card component to render each program
 * @param {string} [props.allLabel] - Label for the "All" tab
 */

const TIER_ORDER = ["vip", "distinguished", "premium", "standard", "economy"];

const TIER_LABELS = {
  ar: {
    all: "الكل",
    vip: "VIP",
    distinguished: "مميز",
    premium: "بريميوم",
    standard: "متوسط",
    economy: "اقتصادي",
  },
  en: {
    all: "All",
    vip: "VIP",
    distinguished: "Distinguished",
    premium: "Premium",
    standard: "Standard",
    economy: "Economy",
  },
};

const TIER_COLORS = {
  vip: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
  distinguished: { bg: "#ede9fe", border: "#8b5cf6", text: "#5b21b6" },
  premium: { bg: "#fce7f3", border: "#ec4899", text: "#9d174d" },
  standard: { bg: "#e0f2fe", border: "#0ea5e9", text: "#0c4a6e" },
  economy: { bg: "#ecfdf5", border: "#10b981", text: "#065f46" },
};

export default function TierTabs({
  programs,
  tableLabels,
  isRTL,
  CardComponent,
  allLabel,
}) {
  const locale = isRTL ? "ar" : "en";
  const labels = TIER_LABELS[locale];

  // Group programs by tier
  const { tiers, grouped } = useMemo(() => {
    const map = {};
    for (const prog of programs) {
      const tier = prog.tier || "other";
      if (!map[tier]) map[tier] = [];
      map[tier].push(prog);
    }
    // Sort tiers by predefined order
    const sorted = Object.keys(map).sort((a, b) => {
      const ai = TIER_ORDER.indexOf(a);
      const bi = TIER_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    return { tiers: sorted, grouped: map };
  }, [programs]);

  // If only one tier or no meaningful grouping, render flat
  const showTabs = tiers.length > 1;
  const [activeTab, setActiveTab] = useState("all");

  const visiblePrograms = useMemo(() => {
    if (activeTab === "all") return programs;
    return grouped[activeTab] || [];
  }, [activeTab, programs, grouped]);

  return (
    <div>
      {showTabs && (
        <div
          className="tier-tabs-bar"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "32px",
            justifyContent: "center",
          }}
          role="tablist"
          aria-label={isRTL ? "تصفية حسب المستوى" : "Filter by tier"}
        >
          <TabPill
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            label={allLabel || labels.all}
            count={programs.length}
            isRTL={isRTL}
          />
          {tiers.map((tier) => (
            <TabPill
              key={tier}
              active={activeTab === tier}
              onClick={() => setActiveTab(tier)}
              label={labels[tier] || tier}
              count={grouped[tier].length}
              tierColor={TIER_COLORS[tier]}
              isRTL={isRTL}
            />
          ))}
        </div>
      )}

      <div
        className="tier-programs-list"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        {visiblePrograms.map((program, idx) => (
          <div key={idx} data-aos="fade-up" data-aos-delay={idx * 80}>
            <CardComponent
              program={program}
              tableLabels={tableLabels}
              isRTL={isRTL}
            />
          </div>
        ))}
      </div>

      {visiblePrograms.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#6b7280",
            fontSize: "16px",
            fontFamily: "'Noto Kufi Arabic', sans-serif",
          }}
        >
          {isRTL ? "لا توجد برامج في هذا التصنيف حالياً" : "No programs in this category yet"}
        </div>
      )}
    </div>
  );
}

function TabPill({ active, onClick, label, count, tierColor, isRTL }) {
  const defaultActive = {
    bg: "var(--color-accent-1)",
    border: "var(--color-accent-1)",
    text: "#ffffff",
  };
  const defaultInactive = {
    bg: "#ffffff",
    border: "rgba(1, 159, 177, 0.25)",
    text: "#374151",
  };

  let style;
  if (active) {
    style = tierColor
      ? { backgroundColor: tierColor.border, borderColor: tierColor.border, color: "#ffffff" }
      : { backgroundColor: defaultActive.bg, borderColor: defaultActive.border, color: defaultActive.text };
  } else {
    style = tierColor
      ? { backgroundColor: tierColor.bg, borderColor: tierColor.border, color: tierColor.text }
      : { backgroundColor: defaultInactive.bg, borderColor: defaultInactive.border, color: defaultInactive.text };
  }

  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        borderRadius: "30px",
        border: `2px solid ${style.borderColor}`,
        backgroundColor: style.backgroundColor,
        color: style.color,
        fontSize: "14px",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.25s ease",
        fontFamily: "'Noto Kufi Arabic', sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      {label}
      {count > 0 && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            backgroundColor: active ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)",
            fontSize: "11px",
            fontWeight: 800,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
