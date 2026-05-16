"use client";
import React from "react";
import LocalizedLink from "@/components/common/LocalizedLink";

/**
 * UmrahProgramCard
 *
 * A premium, web-native layout for a single Umrah program. Uses the site's
 * primary brand color (`--color-accent-1`) and adds value-rich blocks beyond
 * what the printed brochure shows:
 *
 *   1. Hero strip            — title, badge, release date, season, CTA buttons
 *   2. Highlights ribbon     — quick perks (WiFi, transfers, religious guide,
 *                               medical support, 24/7 support, train transfer)
 *   3. Trip overview         — duration / route / travel dates
 *   4. Hotels & pricing      — one card per hotel pairing with 3 price tiers
 *                              + best-value badge on the cheapest tier
 *   5. Includes / Excludes   — icon grids
 *   6. Notes                 — bulleted callouts
 *   7. Required documents    — numbered cards
 *   8. CTA footer            — call us / WhatsApp / book now
 *
 * @param {Object} props
 * @param {Object} props.program - Program data
 * @param {Object} [props.tableLabels] - Common labels for table headers
 * @param {boolean} [props.isRTL]
 */
export default function UmrahProgramCard({
  program,
  tableLabels = {},
  isRTL = true,
}) {
  if (!program) return null;

  return (
    <article
      className="umrah-program-card"
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 16px 50px rgba(1, 159, 177, 0.1)",
        border: "1px solid rgba(1, 159, 177, 0.18)",
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      <HeroStrip program={program} isRTL={isRTL} labels={tableLabels} />

      <HighlightsRibbon isRTL={isRTL} />

      <div style={{ padding: "clamp(24px, 4vw, 40px)" }}>
        <TripOverview program={program} isRTL={isRTL} labels={tableLabels} />

        {program.headerNote && (
          <CalloutNote text={program.headerNote} isRTL={isRTL} />
        )}

        {program.hotels?.length > 0 && (
          <HotelsAndPricing
            hotels={program.hotels}
            isRTL={isRTL}
            labels={tableLabels}
            disclaimer={program.priceDisclaimer}
          />
        )}

        <FeatureGrid
          title={program.programIncludesTitle}
          items={program.programIncludes}
          variant="include"
          isRTL={isRTL}
        />

        <FeatureGrid
          title={program.programExcludesTitle}
          items={program.programExcludes}
          variant="exclude"
          isRTL={isRTL}
        />

        <FeatureGrid
          title={program.notesTitle}
          items={program.notes}
          variant="note"
          isRTL={isRTL}
        />

        <RequiredDocuments
          title={program.documentsTitle}
          items={program.requiredDocuments}
          isRTL={isRTL}
        />
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero strip                                                                 */
/* -------------------------------------------------------------------------- */

function HeroStrip({ program, isRTL, labels }) {
  return (
    <header
      style={{
        position: "relative",
        background:
          "linear-gradient(135deg, var(--color-accent-1) 0%, #017a89 100%)",
        color: "#ffffff",
        padding: "clamp(28px, 4vw, 40px) clamp(24px, 4vw, 40px)",
        overflow: "hidden",
      }}
    >
      {/* Decorative pattern */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.12) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(255,255,255,0.08) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          {program.badge && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--color-accent-1)",
                backgroundColor: "#ffffff",
                padding: "6px 14px",
                borderRadius: "20px",
                marginBottom: "14px",
                fontFamily: "'Noto Kufi Arabic', sans-serif",
              }}
            >
              <StarIcon />
              {program.badge}
            </span>
          )}
          <h2
            style={{
              fontSize: "clamp(20px, 3vw, 26px)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.5,
              margin: 0,
              fontFamily: "'Noto Kufi Arabic', sans-serif",
              textShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {program.title}
          </h2>
          {program.season && (
            <div
              style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.95)",
                marginTop: "10px",
                fontWeight: 600,
                fontFamily: "'Noto Kufi Arabic', sans-serif",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ClockIcon size={16} color="rgba(255,255,255,0.9)" />
              {program.season}
            </div>
          )}
        </div>

        {program.releaseDate && (
          <span
            style={{
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "rgba(255,255,255,0.15)",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(6px)",
              whiteSpace: "nowrap",
              fontFamily: "'Noto Kufi Arabic', sans-serif",
            }}
          >
            {labels.issueDateLabel || (isRTL ? "إصدار" : "Issued")} ·{" "}
            {program.releaseDate}
          </span>
        )}
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "22px",
        }}
      >
        <CtaButton
          variant="primary"
          icon="phone"
          label={isRTL ? "احجز الآن" : "Book now"}
          href="tel:19102"
        />
        <CtaButton
          variant="secondary"
          icon="whatsapp"
          label={isRTL ? "تواصل عبر واتساب" : "WhatsApp us"}
          href={isRTL ? "https://wa.me/" : "https://wa.me/"}
        />
      </div>
    </header>
  );
}

function CtaButton({ variant, icon, label, href }) {
  const styles = {
    primary: {
      backgroundColor: "#ffffff",
      color: "var(--color-accent-1)",
      border: "1px solid #ffffff",
    },
    secondary: {
      backgroundColor: "rgba(255,255,255,0.12)",
      color: "#ffffff",
      border: "1px solid rgba(255,255,255,0.4)",
    },
  };
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 18px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: 700,
        textDecoration: "none",
        fontFamily: "'Noto Kufi Arabic', sans-serif",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        ...styles[variant],
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <CtaIcon name={icon} />
      {label}
    </a>
  );
}

function CtaIcon({ name }) {
  const sz = { width: 16, height: 16, fill: "currentColor" };
  if (name === "phone") {
    return (
      <svg viewBox="0 0 24 24" style={sz} aria-hidden>
        <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1A17 17 0 0 1 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" style={sz} aria-hidden>
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zM12.04 20.15h-.01a8.21 8.21 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c-.01 4.54-3.7 8.23-8.24 8.23zm4.52-6.16-.6-.3c-.21-.08-1.27-.62-1.46-.69-.2-.07-.34-.11-.49.11-.14.21-.56.69-.69.83-.13.14-.25.16-.46.05-.21-.1-.89-.33-1.69-1.05-.62-.56-1.04-1.24-1.17-1.45-.12-.21-.01-.32.09-.43.1-.1.21-.25.32-.38.1-.13.14-.21.21-.36.07-.14.04-.27-.02-.38-.05-.11-.46-1.12-.64-1.53-.17-.4-.34-.34-.46-.35l-.39-.01a.75.75 0 0 0-.55.25c-.19.21-.72.71-.72 1.72 0 1.02.74 2 .85 2.14.1.14 1.46 2.23 3.54 3.13.49.21.88.34 1.18.43.5.16.95.13 1.31.08.4-.06 1.23-.5 1.41-.99.17-.49.17-.91.12-.99-.05-.09-.18-.14-.39-.24z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      style={{ width: 14, height: 14, fill: "currentColor" }}
      aria-hidden
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
    </svg>
  );
}

function ClockIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={{ width: size, height: size, fill: color }}
      aria-hidden
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 11H11V7h1.5v4.25l3.5 2.08-.75 1.23z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Highlights ribbon                                                          */
/* -------------------------------------------------------------------------- */

function HighlightsRibbon({ isRTL }) {
  const highlights = [
    {
      icon: "wifi",
      ar: "إنترنت في الفنادق",
      en: "Wi-Fi in hotels",
    },
    {
      icon: "bus",
      ar: "نقل من المطار",
      en: "Airport transfers",
    },
    {
      icon: "train",
      ar: "قطار الحرمين",
      en: "Haramain train",
    },
    {
      icon: "guide",
      ar: "مرشد ديني مرافق",
      en: "Religious guide",
    },
    {
      icon: "medical",
      ar: "طبيب مرافق",
      en: "Medical support",
    },
    {
      icon: "support",
      ar: "دعم 24/7",
      en: "24/7 support",
    },
  ];

  return (
    <div
      style={{
        background: "rgba(1, 159, 177, 0.06)",
        borderTop: "1px solid rgba(1, 159, 177, 0.12)",
        borderBottom: "1px solid rgba(1, 159, 177, 0.12)",
        padding: "16px clamp(16px, 4vw, 30px)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px",
        }}
      >
        {highlights.map((h, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              border: "1px solid rgba(1, 159, 177, 0.12)",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                backgroundColor: "rgba(1, 159, 177, 0.1)",
                color: "var(--color-accent-1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <HighlightIcon name={h.icon} />
            </div>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1a1a2e",
                fontFamily: "'Noto Kufi Arabic', sans-serif",
                lineHeight: 1.3,
              }}
            >
              {isRTL ? h.ar : h.en}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HighlightIcon({ name }) {
  const sz = { width: 18, height: 18, fill: "currentColor" };
  switch (name) {
    case "wifi":
      return (
        <svg viewBox="0 0 24 24" style={sz} aria-hidden>
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8 3 3 3-3a4.24 4.24 0 0 0-6 0zm-4-4 2 2a7.07 7.07 0 0 1 10 0l2-2C16.14 9.14 7.87 9.14 5 13z" />
        </svg>
      );
    case "bus":
      return (
        <svg viewBox="0 0 24 24" style={sz} aria-hidden>
          <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 11H6V6h12v5z" />
        </svg>
      );
    case "train":
      return (
        <svg viewBox="0 0 24 24" style={sz} aria-hidden>
          <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      );
    case "guide":
      return (
        <svg viewBox="0 0 24 24" style={sz} aria-hidden>
          <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2zm0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      );
    case "medical":
      return (
        <svg viewBox="0 0 24 24" style={sz} aria-hidden>
          <path d="M19 8h-2V3H7v5H5c-1.1 0-2 .9-2 2v11h18V10c0-1.1-.9-2-2-2zM9 5h6v3H9V5zm6 9h-2v2h-2v-2H9v-2h2v-2h2v2h2v2z" />
        </svg>
      );
    case "support":
      return (
        <svg viewBox="0 0 24 24" style={sz} aria-hidden>
          <path d="M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28-.6.34-1 .98-1 1.72v2c0 1.1.9 2 2 2h1v-6.1c0-3.87 3.13-7 7-7s7 3.13 7 7V19h-8v2h8c1.1 0 2-.9 2-2v-1.22c.59-.31 1-.92 1-1.64v-2.3c0-.7-.41-1.31-1-1.62z" />
        </svg>
      );
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Trip overview                                                              */
/* -------------------------------------------------------------------------- */

function TripOverview({ program, isRTL, labels }) {
  const stats = [
    {
      icon: "clock",
      label: labels.duration || (isRTL ? "مدة البرنامج" : "Duration"),
      value: program.season,
    },
    {
      icon: "calendar",
      label: labels.tripDatesLabel || (isRTL ? "تواريخ الرحلات" : "Travel dates"),
      value: program.travelDates,
    },
    {
      icon: "route",
      label: labels.routeLabel || (isRTL ? "خط سير الرحلة" : "Trip route"),
      value: program.route,
      wide: true,
    },
  ].filter((s) => s.value);

  if (stats.length === 0) return null;

  return (
    <div
      className="trip-overview-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "14px",
        marginBottom: "26px",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, rgba(1,159,177,0.04) 100%)",
            border: "1px solid rgba(1, 159, 177, 0.18)",
            borderRadius: "14px",
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            gridColumn: s.wide ? "1 / -1" : "auto",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "rgba(1, 159, 177, 0.1)",
              color: "var(--color-accent-1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <OverviewIcon name={s.icon} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "12px",
                color: "var(--color-accent-1)",
                fontWeight: 700,
                marginBottom: "2px",
                fontFamily: "'Noto Kufi Arabic', sans-serif",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: "15px",
                color: "#1a1a2e",
                fontWeight: 600,
                fontFamily: "'Noto Kufi Arabic', sans-serif",
              }}
            >
              {s.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OverviewIcon({ name }) {
  const sz = { width: 22, height: 22, fill: "currentColor" };
  if (name === "clock") return <ClockIcon size={22} />;
  if (name === "calendar") {
    return (
      <svg viewBox="0 0 24 24" style={sz} aria-hidden>
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
      </svg>
    );
  }
  if (name === "route") {
    return (
      <svg viewBox="0 0 24 24" style={sz} aria-hidden>
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
      </svg>
    );
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/* Header note                                                                */
/* -------------------------------------------------------------------------- */

function CalloutNote({ text, isRTL }) {
  return (
    <div
      style={{
        backgroundColor: "rgba(1, 159, 177, 0.06)",
        borderRadius: "12px",
        padding: "16px 20px",
        borderRight: isRTL ? "4px solid var(--color-accent-1)" : "none",
        borderLeft: isRTL ? "none" : "4px solid var(--color-accent-1)",
        marginBottom: "26px",
        fontSize: "14.5px",
        lineHeight: 1.9,
        color: "#333",
        fontFamily: "'Noto Kufi Arabic', sans-serif",
      }}
    >
      {text}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hotels & Pricing                                                           */
/* -------------------------------------------------------------------------- */

function HotelsAndPricing({ hotels, isRTL, labels, disclaimer }) {
  // determine the cheapest tier per hotel for "best value" highlight
  return (
    <section style={{ marginBottom: "30px" }}>
      <SectionTitle
        text={isRTL ? "الفنادق والأسعار" : "Hotels & pricing"}
      />

      {disclaimer && (
        <div
          style={{
            background: "linear-gradient(135deg, var(--color-accent-1) 0%, #017a89 100%)",
            color: "#ffffff",
            padding: "12px 18px",
            borderRadius: "10px",
            fontSize: "13.5px",
            fontWeight: 600,
            marginBottom: "16px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "'Noto Kufi Arabic', sans-serif",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            style={{ width: 18, height: 18, fill: "currentColor" }}
            aria-hidden
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          {disclaimer}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
        {hotels.map((row, idx) => (
          <HotelRow
            key={idx}
            row={row}
            index={idx}
            total={hotels.length}
            isRTL={isRTL}
            labels={labels}
          />
        ))}
      </div>
    </section>
  );
}

function HotelRow({ row, index, total, isRTL, labels }) {
  // Top tier (first row) is featured.
  const isFeatured = index === 0;
  // Star count for each city: prefer the value coming from Strapi
  // (linked hotel relation). Otherwise derive a sensible default
  // that decreases with the row index so the brochure still has visual hierarchy.
  const fallbackStars = Math.max(3, 5 - index);
  const madinahStars = row.madinahHotelStars ?? fallbackStars;
  const makkahStars = row.makkahHotelStars ?? fallbackStars;

  return (
    <div
      style={{
        position: "relative",
        border: isFeatured
          ? "2px solid var(--color-accent-1)"
          : "1px solid rgba(1, 159, 177, 0.18)",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        boxShadow: isFeatured ? "0 8px 30px rgba(1, 159, 177, 0.15)" : "none",
      }}
    >
      {isFeatured && (
        <div
          style={{
            position: "absolute",
            top: "-1px",
            insetInlineStart: "20px",
            background: "var(--color-accent-1)",
            color: "#ffffff",
            padding: "6px 14px",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
            fontSize: "11px",
            fontWeight: 800,
            fontFamily: "'Noto Kufi Arabic', sans-serif",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            letterSpacing: "0.5px",
            zIndex: 2,
            boxShadow: "0 2px 8px rgba(1, 159, 177, 0.3)",
          }}
        >
          <StarIcon />
          {isRTL ? "الأعلى تقييماً" : "TOP CHOICE"}
        </div>
      )}

      <div
        className="hotel-row-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 0,
        }}
      >
        <HotelInfoBox
          city={labels.madinahHeader || (isRTL ? "المدينة المنورة" : "Madinah")}
          name={row.madinahHotel}
          hotelLink={row.madinahHotelLink}
          nights={row.madinahNights}
          meals={row.madinahMeals}
          stars={madinahStars}
          tone="madinah"
          isRTL={isRTL}
          hasTopBadge={isFeatured}
        />
        <HotelInfoBox
          city={labels.makkahHeader || (isRTL ? "مكة المكرمة" : "Makkah")}
          name={row.makkahHotel}
          hotelLink={row.makkahHotelLink}
          nights={row.makkahNights}
          meals={row.makkahMeals}
          stars={makkahStars}
          tone="makkah"
          isRTL={isRTL}
        />
      </div>

      <PricingStrip row={row} labels={labels} isRTL={isRTL} />
    </div>
  );
}

function HotelInfoBox({ city, name, hotelLink, nights, meals, stars, tone, isRTL, hasTopBadge }) {
  const cityColor = tone === "madinah" ? "#2e7d32" : "#1565c0";
  const cityBg =
    tone === "madinah"
      ? "rgba(46, 125, 50, 0.06)"
      : "rgba(21, 101, 192, 0.06)";

  return (
    <div
      style={{
        padding: hasTopBadge && tone === "madinah" ? "32px 20px 20px" : "20px",
        background: cityBg,
        borderInlineEnd: tone === "madinah" ? "1px solid rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            style={{ width: 18, height: 18, fill: cityColor }}
            aria-hidden
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
          </svg>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: cityColor,
              fontFamily: "'Noto Kufi Arabic', sans-serif",
            }}
          >
            {city}
          </span>
        </div>
        <StarRating count={stars} />
      </div>

      <HotelName name={name} hotelLink={hotelLink} isRTL={isRTL} />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          fontFamily: "'Noto Kufi Arabic', sans-serif",
        }}
      >
        {meals && (
          <Pill icon="meal" text={meals} color={cityColor} />
        )}
        {nights && (
          <Pill icon="moon" text={nights} color={cityColor} />
        )}
      </div>
    </div>
  );
}

function HotelName({ name, hotelLink, isRTL }) {
  const baseStyle = {
    fontSize: "16px",
    fontWeight: 700,
    color: "#1a1a2e",
    marginBottom: "10px",
    lineHeight: 1.4,
    fontFamily: "'Noto Kufi Arabic', sans-serif",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  };

  if (!name) {
    return <div style={baseStyle}>—</div>;
  }

  if (!hotelLink) {
    return <div style={baseStyle}>{name}</div>;
  }

  return (
    <div style={{ marginBottom: "10px" }}>
      <LocalizedLink
        href={`/hotels/${hotelLink}`}
        style={{
          ...baseStyle,
          marginBottom: 0,
          color: "var(--color-accent-1)",
          textDecoration: "none",
          transition: "color 0.2s ease, transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.textDecoration = "underline";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textDecoration = "none";
        }}
        aria-label={
          isRTL ? `عرض تفاصيل فندق ${name}` : `View ${name} hotel details`
        }
      >
        <span>{name}</span>
        <svg
          viewBox="0 0 24 24"
          style={{
            width: 14,
            height: 14,
            fill: "currentColor",
            transform: isRTL ? "scaleX(-1)" : "none",
            flexShrink: 0,
          }}
          aria-hidden
        >
          <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      </LocalizedLink>
    </div>
  );
}

function StarRating({ count }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "2px",
        color: "#f5b301",
      }}
      aria-label={`${count} stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          style={{
            width: 12,
            height: 12,
            fill: i < count ? "#f5b301" : "rgba(0,0,0,0.15)",
          }}
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
        </svg>
      ))}
    </span>
  );
}

function Pill({ icon, text, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        backgroundColor: "#ffffff",
        color,
        border: `1px solid ${color}33`,
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12.5px",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      <PillIcon name={icon} color={color} />
      {text}
    </span>
  );
}

function PillIcon({ name, color }) {
  const sz = { width: 12, height: 12, fill: color };
  if (name === "meal") {
    return (
      <svg viewBox="0 0 24 24" style={sz} aria-hidden>
        <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" style={sz} aria-hidden>
      <path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z" />
    </svg>
  );
}

function PricingStrip({ row, labels, isRTL }) {
  const tiers = [
    {
      key: "quad",
      label: labels.quadColumn || (isRTL ? "رباعي" : "Quad"),
      sublabel: isRTL ? "4 أفراد" : "4 guests",
      value: row.priceQuad,
      best: true, // cheapest tier
    },
    {
      key: "triple",
      label: labels.tripleColumn || (isRTL ? "ثلاثي" : "Triple"),
      sublabel: isRTL ? "3 أفراد" : "3 guests",
      value: row.priceTriple,
    },
    {
      key: "double",
      label: labels.doubleColumn || (isRTL ? "ثنائي" : "Double"),
      sublabel: isRTL ? "فردين" : "2 guests",
      value: row.priceDouble,
    },
  ].filter((t) => t.value);

  if (tiers.length === 0) return null;

  const currency = labels.currency || (isRTL ? "جنيه" : "EGP");

  return (
    <div
      style={{
        background: "rgba(1, 159, 177, 0.05)",
        padding: "18px",
        borderTop: "1px solid rgba(1, 159, 177, 0.12)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--color-accent-1)",
            fontFamily: "'Noto Kufi Arabic', sans-serif",
          }}
        >
          {labels.perPersonHeader ||
            (isRTL
              ? "تكلفة الفرد بالجنيه المصري في غرفة"
              : "Price per person, by room type")}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${tiers.length}, 1fr)`,
          gap: "10px",
        }}
      >
        {tiers.map((t) => (
          <PriceTier
            key={t.key}
            label={t.label}
            sublabel={t.sublabel}
            value={t.value}
            currency={currency}
            highlight={t.best}
            isRTL={isRTL}
          />
        ))}
      </div>
    </div>
  );
}

function PriceTier({ label, sublabel, value, currency, highlight, isRTL }) {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: highlight
          ? "2px solid var(--color-accent-1)"
          : "1px solid rgba(1, 159, 177, 0.18)",
        padding: "12px 12px 14px",
        textAlign: "center",
        fontFamily: "'Noto Kufi Arabic', sans-serif",
      }}
    >
      {highlight && (
        <span
          style={{
            position: "absolute",
            top: -10,
            insetInlineStart: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "var(--color-accent-1)",
            color: "#ffffff",
            fontSize: "10px",
            fontWeight: 800,
            padding: "2px 8px",
            borderRadius: "10px",
            letterSpacing: "0.5px",
            whiteSpace: "nowrap",
          }}
        >
          {isRTL ? "الأوفر" : "BEST VALUE"}
        </span>
      )}
      <div
        style={{
          fontSize: "13px",
          color: "#1a1a2e",
          fontWeight: 700,
          marginBottom: "2px",
        }}
      >
        {label}
      </div>
      {sublabel && (
        <div
          style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}
        >
          {sublabel}
        </div>
      )}
      <div
        style={{
          fontSize: "clamp(18px, 2.6vw, 22px)",
          color: "var(--color-accent-1)",
          fontWeight: 800,
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "11.5px", color: "#888", marginTop: "2px" }}>
        {currency}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Feature grids (includes / excludes / notes)                                */
/* -------------------------------------------------------------------------- */

function SectionTitle({ text, color = "var(--color-accent-1)" }) {
  if (!text) return null;
  return (
    <h3
      style={{
        fontSize: "17px",
        fontWeight: 700,
        color: "#1a1a2e",
        marginBottom: "16px",
        paddingInlineStart: "12px",
        borderInlineStart: `4px solid ${color}`,
        fontFamily: "'Noto Kufi Arabic', sans-serif",
      }}
    >
      {text}
    </h3>
  );
}

function FeatureGrid({ title, items, variant, isRTL }) {
  if (!items?.length) return null;
  const tone = resolveListTone(variant);

  return (
    <section style={{ marginTop: "26px" }}>
      <SectionTitle text={title} color={tone.color} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "12px",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              backgroundColor: tone.bg,
              border: `1px solid ${tone.border}`,
              borderRadius: "12px",
              padding: "14px 16px",
              fontFamily: "'Noto Kufi Arabic', sans-serif",
              fontSize: "14.5px",
              color: "#333",
              lineHeight: 1.85,
              flexDirection: isRTL ? "row-reverse" : "row",
              textAlign: isRTL ? "right" : "left",
            }}
          >
            <ListIcon variant={variant} color={tone.color} />
            <span style={{ flex: 1 }}>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function resolveListTone(variant) {
  if (variant === "exclude") {
    return {
      color: "#c8102e",
      bg: "rgba(200, 16, 46, 0.05)",
      border: "rgba(200, 16, 46, 0.18)",
    };
  }
  if (variant === "note") {
    return {
      color: "#b8860b",
      bg: "rgba(184, 134, 11, 0.06)",
      border: "rgba(184, 134, 11, 0.2)",
    };
  }
  return {
    color: "var(--color-accent-1)",
    bg: "rgba(1, 159, 177, 0.05)",
    border: "rgba(1, 159, 177, 0.18)",
  };
}

function ListIcon({ variant, color }) {
  const sz = { width: 22, height: 22, fill: color, flexShrink: 0, marginTop: 2 };
  if (variant === "exclude") {
    return (
      <svg viewBox="0 0 24 24" style={sz} aria-hidden>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5 13.6L15.6 17 12 13.4 8.4 17 7 15.6 10.6 12 7 8.4 8.4 7 12 10.6 15.6 7 17 8.4 13.4 12z" />
      </svg>
    );
  }
  if (variant === "note") {
    return (
      <svg viewBox="0 0 24 24" style={sz} aria-hidden>
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" style={sz} aria-hidden>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 15-5-5 1.4-1.4 3.6 3.6 7.6-7.6L20 8z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Required documents                                                         */
/* -------------------------------------------------------------------------- */

function RequiredDocuments({ title, items, isRTL }) {
  if (!items?.length) return null;
  return (
    <section style={{ marginTop: "26px" }}>
      <SectionTitle text={title} color="#b8860b" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "12px",
        }}
      >
        {items.map((doc, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              backgroundColor: "rgba(212, 175, 55, 0.06)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              borderRadius: "12px",
              padding: "14px 16px",
              fontFamily: "'Noto Kufi Arabic', sans-serif",
              flexDirection: isRTL ? "row-reverse" : "row",
              textAlign: isRTL ? "right" : "left",
            }}
          >
            <span
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#d4af37",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "14px",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>
            <span
              style={{
                flex: 1,
                fontSize: "14.5px",
                color: "#333",
                lineHeight: 1.85,
              }}
            >
              {doc}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Required documents                                                         */
/* -------------------------------------------------------------------------- */
