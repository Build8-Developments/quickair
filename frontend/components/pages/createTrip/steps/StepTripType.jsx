"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepTripType.module.css";

const TRIP_TYPES = [
  {
    id: "package",
    titleAr: "باقة متكاملة",
    titleEn: "Complete Package",
    descAr: "رحلة كاملة مع كل شيء",
    descEn: "Full vacation with everything included",
    icon: "package",
  },
  {
    id: "flight-hotel",
    titleAr: "طيران + فندق",
    titleEn: "Flight + Hotel",
    descAr: "تأشيرة سفر",
    descEn: "Visa assistance",
    icon: "flight",
  },
  {
    id: "hotel-only",
    titleAr: "فندق فقط",
    titleEn: "Hotel Only",
    descAr: "تصفح الفنادق",
    descEn: "Browse our hotels",
    icon: "hotel",
  },
];

const TripIcon = ({ type }) => {
  switch (type) {
    case "package":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="8" width="18" height="12" rx="2" />
          <path d="M8 8V6a4 4 0 0 1 8 0v2" />
          <line x1="3" y1="14" x2="21" y2="14" />
        </svg>
      );
    case "flight":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      );
    case "hotel":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
          <path d="M1 21h22" />
          <path d="M9 7h1" />
          <path d="M9 11h1" />
          <path d="M9 15h1" />
          <path d="M14 7h1" />
          <path d="M14 11h1" />
          <path d="M14 15h1" />
        </svg>
      );
    default:
      return null;
  }
};

export default function StepTripType({ data, onUpdate, onNext, onPrev = null }) {
  const [selected, setSelected] = useState(data);
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const t = (ar, en) => (isRTL ? ar : en);

  useEffect(() => {
    setSelected(data);
  }, [data]);

  const handleSelect = (type) => {
    setSelected(type);
    onUpdate(type);
  };

  const handleContinue = () => {
    if (selected) {
      onNext(selected);
    }
  };

  return (
    <div className="step-content" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{t("ما نوع الرحلة؟", "What type of trip?")}</h2>
        <p className={styles.subtitle}>{t("اختر نوع الرحلة المناسب لك", "Choose your preferred trip type")}</p>
      </div>

      {/* Cards */}
      <div className={styles.cardsGrid}>
        {TRIP_TYPES.map((type) => {
          const isSelected = selected?.id === type.id;
          return (
            <div
              key={type.id}
              className={`${styles.card} ${isSelected ? styles.cardActive : ""}`}
              onClick={() => handleSelect(type)}
            >
              <div className={styles.cardIcon}>
                <TripIcon type={type.icon} />
              </div>
              <h3 className={styles.cardTitle}>{t(type.titleAr, type.titleEn)}</h3>
              <p className={styles.cardDesc}>{t(type.descAr, type.descEn)}</p>
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
        {onPrev ? (
          <button className={styles.backButton} onClick={onPrev}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={isRTL ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"} />
            </svg>
            {t("رجوع", "Back")}
          </button>
        ) : (
          <div />
        )}
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
