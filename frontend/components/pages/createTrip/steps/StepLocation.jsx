"use client";

import { useMemo, useState } from "react";
import { DOMESTIC_DESTINATIONS, INTERNATIONAL_DESTINATIONS } from "@/data/toursData";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepLocation.module.css";

export default function StepLocation({ data, onUpdate, onNext, onPrev }) {
  const [selected, setSelected] = useState(data || null);
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const t = (ar, en) => (isRTL ? ar : en);

  const options = useMemo(() => {
    const getStats = (destinations) => {
      const hotels = destinations.reduce((sum, d) => sum + (d.hotelCount || 0), 0);
      const prices = destinations.map((d) => d.priceRange?.min).filter(Boolean);
      const preview = destinations.slice(0, 3).map((d) => (isRTL ? d.name : d.nameEn || d.name));
      return {
        count: destinations.length,
        hotels,
        minPrice: prices.length ? Math.min(...prices) : null,
        preview,
      };
    };

    return [
      {
        id: "domestic",
        titleAr: "داخل مصر",
        titleEn: "Within Egypt",
        descAr: "استكشف وجهات داخل مصر",
        descEn: "Explore destinations within Egypt",
        icon: "egypt",
        stats: getStats(DOMESTIC_DESTINATIONS),
      },
      {
        id: "international",
        titleAr: "خارج مصر",
        titleEn: "International",
        descAr: "اكتشف العالم من حولك",
        descEn: "Discover the world around you",
        icon: "world",
        stats: getStats(INTERNATIONAL_DESTINATIONS),
      },
    ];
  }, [isRTL]);

  const handleSelect = (id) => {
    setSelected(id);
    onUpdate(id);
  };

  const handleContinue = () => {
    if (selected) onNext();
  };

  return (
    <div className="step-content" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{t("إلى أين تريد السفر؟", "Where would you like to travel?")}</h2>
        <p className={styles.subtitle}>{t("اختر داخل أو خارج مصر", "Choose within or outside Egypt")}</p>
      </div>

      {/* Cards */}
      <div className={styles.cardsGrid}>
        {options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <div
              key={option.id}
              className={`${styles.card} ${isSelected ? styles.cardActive : ""}`}
              onClick={() => handleSelect(option.id)}
            >
              {/* Icon */}
              <div className={styles.cardIcon}>
                {option.icon === "egypt" ? (
                  <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
                    <rect x="12" y="20" width="40" height="24" rx="2" fill="currentColor" opacity="0.2" />
                    <rect x="12" y="20" width="40" height="8" fill="#CE1126" />
                    <rect x="12" y="28" width="40" height="8" fill="#FFFFFF" />
                    <rect x="12" y="36" width="40" height="8" fill="#000000" />
                    <path d="M32 28l2 4h-4l2-4z" fill="#C09300" />
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <h3 className={styles.cardTitle}>{t(option.titleAr, option.titleEn)}</h3>
              <p className={styles.cardDesc}>{t(option.descAr, option.descEn)}</p>

              {/* Tags */}
              <div className={styles.tags}>
                {option.stats.preview.map((name, i) => (
                  <span key={i} className={styles.tag}>{name}</span>
                ))}
              </div>

              {/* Stats */}
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>{t("الفنادق", "Hotels")}</span>
                  <span className={styles.statValue}>+{option.stats.hotels}</span>
                </div>
                {option.stats.minPrice && (
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>{t("تبدأ من", "From")}</span>
                    <span className={styles.statValue}>
                      {option.stats.minPrice.toLocaleString()} {t("ج.م", "EGP")}
                    </span>
                  </div>
                )}
              </div>

              {/* Check */}
              {isSelected && (
                <div className={styles.checkMark}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button className={styles.backButton} onClick={onPrev}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isRTL ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"} />
          </svg>
          {t("رجوع", "Back")}
        </button>
        <button
          className={`${styles.continueButton} ${!selected ? styles.disabled : ""}`}
          onClick={handleContinue}
          disabled={!selected}
        >
          {t("متابعة", "Continue")}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isRTL ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
          </svg>
        </button>
      </div>
    </div>
  );
}
