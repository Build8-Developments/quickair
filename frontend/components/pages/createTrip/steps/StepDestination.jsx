"use client";

import { useState } from "react";
import { DOMESTIC_DESTINATIONS, INTERNATIONAL_DESTINATIONS } from "@/data/toursData";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepDestination.module.css";

export default function StepDestination({ data, locationType, onUpdate, onNext, onPrev }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(data);
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const t = (ar, en) => (isRTL ? ar : en);

  const destinationsList = locationType === 'domestic' ? DOMESTIC_DESTINATIONS : INTERNATIONAL_DESTINATIONS;

  const filteredDestinations = destinationsList.filter((dest) =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (dest.nameEn && dest.nameEn.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelect = (destination) => {
    setSelectedDestination(destination);
    onUpdate(destination);
  };

  const handleContinue = () => {
    if (selectedDestination) onNext();
  };

  return (
    <div className="step-content" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          {locationType === 'domestic' 
            ? t('اختر وجهتك داخل مصر', 'Choose Your Destination in Egypt')
            : t('إلى أين تريد الذهاب؟', 'Where would you like to go?')}
        </h2>
        <p className={styles.subtitle}>
          {locationType === 'domestic' 
            ? t('استكشف أجمل الوجهات السياحية', 'Explore the most beautiful destinations')
            : t('اختر وجهتك المفضلة', 'Select your dream destination')}
        </p>
      </div>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={t('ابحث عن الوجهات...', 'Search destinations...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Destinations Grid */}
      <div className={styles.grid}>
        {filteredDestinations.map((destination) => {
          const isSelected = selectedDestination?.id === destination.id;
          return (
            <div
              key={destination.id}
              className={`${styles.card} ${isSelected ? styles.cardActive : ""}`}
              onClick={() => handleSelect(destination)}
            >
              <div className={styles.cardImage}>
                <img src={destination.image} alt={destination.name} loading="lazy" />
                {destination.popular && (
                  <span className={styles.badge}>
                    {t('شائع', 'Popular')}
                  </span>
                )}
                {isSelected && (
                  <div className={styles.checkMark}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
              <div className={styles.cardContent}>
                <h4 className={styles.cardTitle}>
                  {isRTL ? destination.name : (destination.nameEn || destination.name)}
                </h4>
                <p className={styles.cardCountry}>{destination.country}</p>
                {destination.priceRange && (
                  <div className={styles.cardPrice}>
                    <span className={styles.priceValue}>
                      {t(`من ${destination.priceRange.min.toLocaleString()} ج.م`, `From ${destination.priceRange.min.toLocaleString()} EGP`)}
                    </span>
                    {destination.hotelCount > 0 && (
                      <span className={styles.hotelCount}>
                        {destination.hotelCount} {t('فندق', 'hotels')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredDestinations.length === 0 && (
        <div className={styles.emptyState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <h3>{t('لا توجد وجهات', 'No destinations found')}</h3>
          <p>{t('جرب كلمة بحث أخرى', 'Try a different search term')}</p>
        </div>
      )}

      {/* Navigation */}
      <div className={styles.navigation}>
        <button className={styles.backButton} onClick={onPrev}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isRTL ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"} />
          </svg>
          {t('رجوع', 'Back')}
        </button>
        <button
          className={`${styles.continueButton} ${!selectedDestination ? styles.disabled : ""}`}
          onClick={handleContinue}
          disabled={!selectedDestination}
        >
          {t('متابعة', 'Continue')}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isRTL ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
          </svg>
        </button>
      </div>
    </div>
  );
}
