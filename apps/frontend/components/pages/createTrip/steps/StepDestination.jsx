"use client";

import { useState } from "react";
import { DOMESTIC_DESTINATIONS, INTERNATIONAL_DESTINATIONS } from "@/data/toursData";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepDestination.module.css";

export default function StepDestination({ data, locationType, onUpdate, onNext, onPrev }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(data);
  const { language, t } = useLanguage();
  const isRTL = language === "ar";

  // Choose destinations list based on location type
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
    if (selectedDestination) {
      onNext();
    }
  };

  return (
    <div className="step-content" dir={isRTL ? "rtl" : "ltr"}>
      <div className="text-center mb-40">
        <h2 className="text-30 fw-600 text-dark-1 mb-10">
          {locationType === 'domestic' 
            ? t('اختر وجهتك داخل مصر', 'Choose Your Destination in Egypt')
            : t('إلى أين تريد الذهاب؟', 'Where would you like to go?')}
        </h2>
        <p className="text-16 text-dark-2">
          {locationType === 'domestic' 
            ? t('استكشف أجمل الوجهات السياحية في مصر', 'Explore the most beautiful tourist destinations in Egypt')
            : t('اختر وجهتك المفضلة من اختياراتنا الشائعة', 'Select your dream destination from our popular picks')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-40">
        <div className="searchMenu-loc px-30 py-20 bg-white rounded-12 border-1">
          <div className="d-flex items-center" style={{ gap: "15px" }}>
            <i className="icon-location-2 text-20 text-dark-1"></i>
            <input
              type="text"
              className="border-0 text-16 fw-500"
              placeholder={t('ابحث عن الوجهات...', 'Search destinations...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ outline: "none", width: "100%", direction: isRTL ? "rtl" : "ltr" }}
            />
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="row x-gap-20 y-gap-20">
        {filteredDestinations.map((destination) => (
          <div key={destination.id} className="col-lg-3 col-md-4 col-sm-6">
            <div
              className={`${styles.destinationCard} ${
                selectedDestination?.id === destination.id ? styles.selected : ""
              }`.trim()}
              onClick={() => handleSelect(destination)}
            >
              <div className={styles.image}>
                <img
                  src={destination.image}
                  alt={destination.name}
                  loading="lazy"
                />
                {destination.popular && (
                  <div className={styles.popularBadge}>
                    <i className="icon-fire text-12 mr-5"></i>
                    Popular
                  </div>
                )}
                {selectedDestination?.id === destination.id && (
                  <div className={styles.selectedBadge}>
                    <i className="icon-check text-16"></i>
                  </div>
                )}
                <div className={styles.imageOverlay}></div>
              </div>
              <div className={styles.content}>
                <h4 className="text-16 fw-600 text-dark-1">
                  {isRTL ? destination.name : (destination.nameEn || destination.name)}
                </h4>
                <p className="text-13 text-dark-3 mt-5 d-flex items-center" style={{ gap: "5px" }}>
                  <i className="icon-location text-14 text-accent-1"></i>
                  {destination.country}
                  {destination.nameEn && isRTL && (
                    <span>• {destination.nameEn}</span>
                  )}
                </p>
                {/* Price Range */}
                {destination.priceRange && (
                  <div className="mt-10">
                    <span className="text-12 fw-600 text-accent-1">
                      {t(`من ${destination.priceRange.min.toLocaleString()} جنيه`, `From ${destination.priceRange.min.toLocaleString()} EGP`)}
                    </span>
                    {destination.hotelCount > 0 && (
                      <span className="text-11 text-light-1" style={{ marginInline: "5px" }}>
                        • {destination.hotelCount} {t('فندق', 'hotels')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-60">
          <i className="icon-search text-60 text-dark-3"></i>
          <h3 className="text-20 fw-500 text-dark-2 mt-20">
            {t('لا توجد وجهات', 'No destinations found')}
          </h3>
          <p className="text-15 text-dark-3 mt-10">
            {t('جرب كلمة بحث أخرى', 'Try a different search term')}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="d-flex justify-between items-center mt-40">
        <button
          type="button"
          className="button -md -outline-accent-1 text-accent-1 px-35"
          onClick={onPrev}
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <i className={`icon-arrow-${isRTL ? 'left' : 'right'} text-16`}></i>
          {t('رجوع', 'Back')}
        </button>
        <button
          className={`button -md -dark-1 bg-accent-1 text-white px-50 py-15 rounded-12 ${
            !selectedDestination ? styles.disabledButton : ""
          }`}
          onClick={handleContinue}
          disabled={!selectedDestination}
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          {t('متابعة', 'Continue')}
          <i className={`icon-arrow-${isRTL ? 'right' : 'left'}`}></i>
        </button>
      </div>
    </div>
  );
}
