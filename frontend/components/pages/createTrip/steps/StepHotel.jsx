"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepHotel.module.css";

export default function StepHotel({
  data,
  destination,
  locationType,
  onUpdate,
  onNext,
  onPrev,
}) {
  const [selectedHotel, setSelectedHotel] = useState(data?.hotel || null);
  const [selectedRoomType, setSelectedRoomType] = useState(data?.roomType || "double");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStars, setFilterStars] = useState(0);
  const { language, t } = useLanguage();
  const isRTL = language === "ar";

  // Get hotels for selected destination
  const hotels = destination?.data?.hotels || [];

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.hotel_name_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hotel.hotel_name_ar && hotel.hotel_name_ar.includes(searchQuery));
    const matchesStars = filterStars === 0 || hotel.stars === filterStars;
    return matchesSearch && matchesStars;
  });

  const handleSelect = (hotel) => {
    setSelectedHotel(hotel);
  };

  const handleContinue = () => {
    if (selectedHotel) {
      onUpdate({
        hotel: selectedHotel,
        roomType: selectedRoomType,
      });
      onNext();
    }
  };

  const getPrice = (hotel) => {
    if (hotel.prices_egp) {
      return hotel.prices_egp[selectedRoomType] || hotel.price_egp;
    }
    return hotel.price_egp;
  };

  const roomTypes = [
    { id: "double", labelAr: "مزدوج", labelEn: "Double" },
    { id: "single", labelAr: "فردي", labelEn: "Single" },
    { id: "triple", labelAr: "ثلاثي", labelEn: "Triple" },
  ];

  const starOptions = [
    { value: 0, labelAr: "الكل", labelEn: "All" },
    { value: 3, labelAr: "3", labelEn: "3" },
    { value: 4, labelAr: "4", labelEn: "4" },
    { value: 5, labelAr: "5", labelEn: "5" },
  ];

  return (
    <div className="step-content" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          {t(
            `اختر فندقك في ${destination?.name}`,
            `Choose Your Hotel in ${destination?.nameEn || destination?.name}`
          )}
        </h2>
        <p className={styles.subtitle}>
          <span className={styles.hotelCount}>{hotels.length}</span>{" "}
          {t("فندق متاح", "hotels available")}
        </p>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        {/* Search */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            {t("البحث", "Search")}
          </label>
          <div className={styles.searchField}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={t("ابحث عن فندق...", "Search hotels...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Room Type */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            {t("نوع الغرفة", "Room Type")}
          </label>
          <div className={styles.filterButtons}>
            {roomTypes.map((room) => (
              <button
                key={room.id}
                className={`${styles.filterButton} ${selectedRoomType === room.id ? styles.activeButton : ""}`}
                onClick={() => setSelectedRoomType(room.id)}
              >
                {isRTL ? room.labelAr : room.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Stars */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            {t("التقييم", "Rating")}
          </label>
          <div className={styles.filterButtons}>
            {starOptions.map((option) => (
              <button
                key={option.value}
                className={`${styles.filterButton} ${filterStars === option.value ? styles.activeButton : ""}`}
                onClick={() => setFilterStars(option.value)}
              >
                {option.value === 0 ? (
                  isRTL ? option.labelAr : option.labelEn
                ) : (
                  <>
                    <span>{option.value}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={filterStars === option.value ? "#fff" : "#fbbf24"}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hotels List */}
      <div className={styles.hotelsList} style={{ marginTop: "24px" }}>
        {filteredHotels.map((hotel, index) => {
          const price = getPrice(hotel);
          const isSelected = selectedHotel?.hotel_name_en === hotel.hotel_name_en;

          return (
            <div key={index} className={styles.hotelCardWrapper}>
              <div
                className={`${styles.hotelCard} ${isSelected ? styles.selectedCard : ""}`}
                onClick={() => handleSelect(hotel)}
              >
                {/* Hotel Icon */}
                <div className={styles.hotelIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
                    <path d="M1 21h22" />
                    <path d="M9 7h1" />
                    <path d="M9 11h1" />
                    <path d="M9 15h1" />
                    <path d="M14 7h1" />
                    <path d="M14 11h1" />
                    <path d="M14 15h1" />
                  </svg>
                </div>

                {/* Hotel Info */}
                <div className={styles.hotelInfo}>
                  <div className={styles.hotelHeader}>
                    <h3 className={styles.hotelName}>
                      {isRTL ? hotel.hotel_name_ar || hotel.hotel_name_en : hotel.hotel_name_en}
                    </h3>
                    <div className={styles.hotelStars}>
                      {[...Array(hotel.stars || 0)].map((_, i) => (
                        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <div className={styles.hotelDetails}>
                    {hotel.area && (
                      <div className={styles.detailItem}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{hotel.area}</span>
                      </div>
                    )}
                    {(hotel.room_type_en || hotel.room_type_ar) && (
                      <div className={styles.detailItem}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{isRTL ? hotel.room_type_ar : hotel.room_type_en}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price */}
                {price && (
                  <div className={styles.priceWrapper}>
                    <span className={styles.priceLabel}>
                      {t("السعر للفرد", "Per Person")}
                    </span>
                    <div>
                      <span className={styles.priceAmount}>
                        {price.toLocaleString()}
                      </span>
                      <span className={styles.currency}> {t("ج.م", "EGP")}</span>
                      <div className={styles.priceUsd}>≈ ${Math.round(price / 50)}</div>
                    </div>
                  </div>
                )}

                {/* Selected Check */}
                {isSelected && (
                  <div className={styles.selectedCheck}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredHotels.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>
            {t("لا توجد فنادق", "No hotels found")}
          </h3>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            {t("جرب تغيير معايير البحث", "Try adjusting your filters")}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className={styles.navigationButtons}>
        <button className={styles.backButton} onClick={onPrev}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isRTL ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"} />
          </svg>
          {t("رجوع", "Back")}
        </button>
        <button
          className={`${styles.continueButton} ${!selectedHotel ? styles.disabledButton : ""}`}
          onClick={handleContinue}
          disabled={!selectedHotel}
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
