"use client";

import { useMemo, useState } from "react";
import { DOMESTIC_DESTINATIONS, INTERNATIONAL_DESTINATIONS } from "@/data/toursData";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepLocation.module.css";

const LocationIcon = ({ type, color, isSelected, isHovered }) => {
  const iconColor = isSelected || isHovered ? "#ffffff" : color;
  const bgOpacity = isSelected ? "0.25" : "0.15";
  
  if (type === "domestic") {
    return (
      <svg viewBox="0 0 64 64" fill="none" width="48" height="48">
        <rect x="8" y="16" width="48" height="32" rx="6" fill={iconColor} opacity={bgOpacity} />
        <path d="M16 24h32v8H16z" fill={isSelected || isHovered ? "#ffffff" : color} />
        <path d="M16 32h32v8H16z" fill={isSelected || isHovered ? "rgba(255,255,255,0.9)" : "#ffffff"} />
        <path d="M16 40h32v8H16z" fill={isSelected || isHovered ? "rgba(255,255,255,0.7)" : "#1a1a1a"} />
        <path d="M24 26l6 6-6 6-6-6z" fill={isSelected || isHovered ? "#ffd700" : "#d4af37"} />
      </svg>
    );
  }
  // International - Airplane
  return (
    <svg viewBox="0 0 64 64" fill="none" width="48" height="48">
      <ellipse cx="32" cy="40" rx="24" ry="8" fill={iconColor} opacity={bgOpacity} />
      <path
        d="M48 22l8 6-22 8-14-5-3-7 12 2-4-14 6-2 10 16 9-2z"
        fill={iconColor}
        stroke={isSelected || isHovered ? "rgba(255,255,255,0.8)" : "#ffffff"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="52" cy="18" r="4" fill={iconColor} opacity="0.8" />
      <path d="M12 46h40" stroke={iconColor} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
};

export default function StepLocation({ data, onUpdate, onNext, onPrev }) {
  const [locationType, setLocationType] = useState(data || null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (locationType) {
      onUpdate(locationType);
      onNext();
    }
  };

  const locationOptions = useMemo(() => {
    const buildStats = (destinations) => {
      const hotels = destinations.reduce((sum, dest) => sum + (dest.hotelCount || 0), 0);
      const prices = destinations.map((dest) => dest.priceRange?.min).filter(Boolean);
      const preview = destinations.slice(0, 5);
      return {
        destinationsCount: destinations.length,
        hotelCount: hotels,
        minPrice: prices.length ? Math.min(...prices) : null,
        maxPrice: prices.length ? Math.max(...prices) : null,
        previewNames: {
          ar: preview.map((dest) => dest.name),
          en: preview.map((dest) => dest.nameEn || dest.name),
        },
      };
    };

    return [
      {
        id: "domestic",
        label: "داخل مصر",
        labelEn: "Within Egypt",
        icon: "icon-flag",
        description: "استكشف وجهات سياحية داخل مصر",
        descriptionEn: "Explore destinations within Egypt",
        color: "#019fb1",
        destinationsData: DOMESTIC_DESTINATIONS,
      },
      {
        id: "international",
        label: "خارج مصر",
        labelEn: "International",
        icon: "icon-plane",
        description: "اكتشف العالم من حولك",
        descriptionEn: "Discover the world around you",
        color: "#b71c38",
        destinationsData: INTERNATIONAL_DESTINATIONS,
      },
    ].map((option) => ({
      ...option,
      stats: buildStats(option.destinationsData),
    }));
  }, []);

  const handleCardClick = (type) => {
    setLocationType(type);
  };

  return (
    <form onSubmit={handleSubmit} dir={isArabic ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="text-center mb-50">
        <h2 className="text-30 fw-700 text-dark-1 mb-10">
          {t("إلى أين تريد السفر؟", "Where would you like to travel?")}
        </h2>
        <p className="text-16 text-light-1">
          {t("اختر هل تريد السفر داخل مصر أم خارج مصر", "Choose if you want to travel within or outside Egypt")}
        </p>
      </div>

      {/* Location Options */}
      <div className="row y-gap-20 justify-center">
        {locationOptions.map((option) => (
          <div key={option.id} className="col-md-5">
            <div
              className={`${styles.locationCard} ${locationType === option.id ? styles.selected : ""}`.trim()}
              onClick={() => handleCardClick(option.id)}
              onMouseEnter={() => setHoveredCard(option.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={styles.content}>
                {/* Icon */}
                <div className={styles.iconWrapper}>
                  <LocationIcon 
                    type={option.id} 
                    color={option.color}
                    isSelected={locationType === option.id}
                    isHovered={hoveredCard === option.id}
                  />
                </div>

                {/* Title */}
                <h3 className={`${styles.locationTitle} text-24 fw-700 text-dark-1 mb-10 mt-20`}>
                  {t(option.label, option.labelEn)}
                </h3>
                <p className={`${styles.cardDescription} text-15 mb-5`}>
                  {t(option.description, option.descriptionEn)}
                </p>

                {/* Popular Destinations Preview */}
                <div className={styles.destinationsPreview}>
                  <div className={`${styles.previewLabel} text-13 fw-600 mb-10`}>
                    {t(`وجهات شائعة (${option.stats.destinationsCount} وجهة)`, `Popular destinations (${option.stats.destinationsCount})`)}
                  </div>
                  <div className={styles.destinationsTags}>
                    {option.stats.previewNames[isArabic ? "ar" : "en"].map((dest, idx) => (
                      <span key={idx} className={styles.destinationTag}>
                        {dest}
                      </span>
                    ))}
                    {option.stats.destinationsCount > option.stats.previewNames[isArabic ? "ar" : "en"].length && (
                      <span className={`${styles.destinationTag} ${styles.destinationTagMore}`}>
                        +{option.stats.destinationsCount - option.stats.previewNames[isArabic ? "ar" : "en"].length}
                      </span>
                    )}
                  </div>
                </div>

                <div className={`${styles.locationStats} mt-20`}>
                  <div className={styles.statItem}>
                    <i className={`icon-map-pin ${styles.statIcon}`}></i>
                    <div>
                      <span className={styles.statLabel}>{t("عدد الفنادق", "Hotels available")}</span>
                      <span className={styles.statValue} dir="ltr">+{option.stats.hotelCount}</span>
                    </div>
                  </div>
                  {option.stats.minPrice && (
                    <div className={styles.statItem}>
                      <i className={`icon-wallet ${styles.statIcon}`}></i>
                      <div>
                        <span className={styles.statLabel}>{t("أسعار تبدأ من", "Starting from")}</span>
                        <span className={styles.statValue}>
                          {isArabic
                            ? `${option.stats.minPrice.toLocaleString()} جنيه`
                            : `${option.stats.minPrice.toLocaleString()} EGP`}
                          <span className={styles.statValueNote}>
                            {isArabic
                              ? `≈ ${Math.round(option.stats.minPrice / 50)} دولار`
                              : `≈ $${Math.round(option.stats.minPrice / 50)}`}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Check */}
                {locationType === option.id && (
                  <div className={styles.selectedCheck}>
                    <i className="icon-check text-16"></i>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="d-flex justify-between items-center mt-40">
        <button
          type="button"
          className="button -md -outline-dark-1 text-dark-1 px-40 py-15 rounded-12"
          onClick={onPrev}
        >
          <i className="icon-arrow-left mr-10"></i>
          {t("رجوع", "Back")}
        </button>
        <button
          type="submit"
          className={`button -md -dark-1 bg-accent-1 text-white px-50 py-15 rounded-12 ${
            !locationType ? styles.disabledButton : ""
          }`}
          disabled={!locationType}
        >
          {t("متابعة", "Continue")}
          <i className="icon-arrow-right ml-10"></i>
        </button>
      </div>
    </form>
  );
}
