"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepTripType.module.css";

const TRIP_TYPES = [
  {
    id: "package",
    title: "Complete Package",
    titleAr: "باقة سياحية متكاملة",
    description: "Full vacation experience with everything included",
    descriptionAr: "تجربة سياحية كاملة مع كل شيء مشمول",
    accent: {
      primary: "#0d98ba",
      secondary: "#52d5e8",
      ghost: "#e0f7fb",
    },
  },
  {
    id: "flight-hotel",
    title: "Flight + Hotel",
    titleAr: "طيران + فندق",
    description: "Visa",
    descriptionAr: "تأشيرة",
    accent: {
      primary: "#028ca8",
      secondary: "#46d9c5",
      ghost: "#e2fbf6",
    },
  },
  {
    id: "hotel-only",
    title: "Hotel Only",
    titleAr: "فندق فقط",
    description: "Browse our hotel collection",
    descriptionAr: "تصفح مجموعة الفنادق لدينا",
    accent: {
      primary: "#3f7ddc",
      secondary: "#5fc5ff",
      ghost: "#e5f0ff",
    },
  },
];

const TripTypeIcon = ({ type, accent }) => {
  const primary = accent?.primary || "#019fb1";
  const secondary = accent?.secondary || "#32d1de";

  switch (type) {
    case "package":
      return (
        <svg viewBox="0 0 64 64" fill="none">
          <rect x="10" y="22" width="44" height="28" rx="6" fill={primary} opacity="0.15" />
          <rect x="14" y="26" width="36" height="20" rx="4" fill="#ffffff" stroke={primary} strokeWidth="2.5" />
          <path d="M22 24v-6a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v6" stroke={primary} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="14" y1="36" x2="50" y2="36" stroke={secondary} strokeWidth="2.5" />
          <circle cx="20" cy="42" r="2.5" fill={primary} />
          <circle cx="32" cy="42" r="2.5" fill={primary} />
          <circle cx="44" cy="42" r="2.5" fill={primary} />
        </svg>
      );
    case "flight-hotel":
      return (
        <svg viewBox="0 0 64 64" fill="none">
          <rect x="10" y="34" width="44" height="20" rx="6" fill={primary} opacity="0.15" />
          <rect x="14" y="38" width="36" height="12" rx="4" fill="#ffffff" stroke={primary} strokeWidth="2.5" />
          <path
            d="M45 14l6 5-15 5-10-3-2-5 8 1-2-9 4-1.5 6 10 5-1z"
            fill={primary}
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <line x1="18" y1="44" x2="30" y2="44" stroke={secondary} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="36" y1="44" x2="46" y2="44" stroke={secondary} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="52" cy="22" r="3.5" fill={secondary} />
        </svg>
      );
    case "hotel-only":
    default:
      return (
        <svg viewBox="0 0 64 64" fill="none">
          <rect x="10" y="30" width="44" height="22" rx="6" fill={primary} opacity="0.15" />
          <rect x="14" y="34" width="36" height="14" rx="4" fill="#ffffff" stroke={primary} strokeWidth="2.5" />
          <rect x="16" y="26" width="12" height="8" rx="3" fill={secondary} />
          <rect x="36" y="26" width="12" height="8" rx="3" fill={secondary} />
          <line x1="14" y1="42" x2="50" y2="42" stroke={secondary} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="10" y1="52" x2="10" y2="46" stroke={primary} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="54" y1="52" x2="54" y2="46" stroke={primary} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
  }
};

export default function StepTripType({ data, onUpdate, onNext, onPrev = null }) {
  const [selectedType, setSelectedType] = useState(data);
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  useEffect(() => {
    setSelectedType(data);
  }, [data]);

  const handleSelect = (type) => {
    setSelectedType(type);
    onUpdate(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      onNext(selectedType);
    }
  };

  const continueButtonClass = [
    "button -md -dark-1 bg-accent-1 text-white px-50 py-15 rounded-12",
    !selectedType ? styles.disabledButton : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="step-content" dir={isArabic ? "rtl" : "ltr"}>
      <div className="text-center mb-40">
        <h2 className="text-30 fw-600 text-dark-1 mb-10">
          {t("ما نوع الرحلة المطلوبة؟", "What type of trip do you need?")}
        </h2>
        <p className="text-16 text-dark-2">
          {t(
            "اختر نوع الرحلة وسنقوم بتخصيص كل شيء لك",
            "Choose your preferred trip type and we'll personalize everything"
          )}
        </p>
      </div>

      <div className={`${styles.cardsRow} ${isArabic ? styles.cardsRowRtl : ""}`.trim()}>
        {TRIP_TYPES.map((type) => {
          const isSelected = selectedType?.id === type.id;
          const cardClass = `${styles.card} ${isSelected ? styles.cardSelected : ""}`.trim();

          return (
            <div
              key={type.id}
              className={cardClass}
              style={{
                "--accent-primary": type.accent.primary,
                "--accent-secondary": type.accent.secondary,
                "--accent-ghost": type.accent.ghost,
              }}
              onClick={() => handleSelect(type)}
            >
              <div className={styles.iconBox}>
                <TripTypeIcon type={type.id} accent={type.accent} />
              </div>

              <h4 className="text-18 fw-600 text-dark-1 mt-20">
                {t(type.titleAr, type.title)}
              </h4>

              <p className="text-14 text-dark-2 mt-10">
                {t(type.descriptionAr, type.description)}
              </p>

              {isSelected && (
                <div className={styles.selectedCheck}>
                  <i className="icon-check text-16"></i>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={`${styles.controls} ${isArabic ? styles.controlsRtl : ""}`.trim()}>
        {onPrev ? (
          <button
            className="button -md -outline-dark-1 text-dark-1 px-40 py-15 rounded-12"
            onClick={onPrev}
          >
            <i className="icon-arrow-left mr-10"></i>
            {t("رجوع", "Back")}
          </button>
        ) : (
          <div />
        )}

        <button className={continueButtonClass} onClick={handleContinue} disabled={!selectedType}>
          {t("متابعة", "Continue")}
          <i className="icon-arrow-right ml-10"></i>
        </button>
      </div>
    </div>
  );
}
