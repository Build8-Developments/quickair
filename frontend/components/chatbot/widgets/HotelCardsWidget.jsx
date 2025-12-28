"use client";

import { useState } from "react";
import styles from "./HotelCardsWidget.module.css";

export default function HotelCardsWidget({ hotels = [], language = "ar", onSelect }) {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  const handleSelect = (hotel) => {
    setSelectedHotel(hotel);
    // Send complete hotel data for booking summary
    onSelect({
      selectedHotel: hotel, // Send full hotel object
      hotelName: isArabic ? hotel.hotel_name_ar : hotel.hotel_name_en,
      message: isArabic ? hotel.hotel_name_ar : hotel.hotel_name_en,
    });
  };

  // Show message if no hotels found
  if (!hotels || hotels.length === 0) {
    return (
      <div className={styles.widget} dir={isArabic ? "rtl" : "ltr"}>
        <div className={styles.noHotels}>
          {t("لا توجد فنادق متاحة لهذه الوجهة حالياً", "No hotels available for this destination")}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widget} dir={isArabic ? "rtl" : "ltr"}>
      {hotels.map((hotel, index) => (
        <div
          key={index}
          className={`${styles.hotelCard} ${selectedHotel === hotel ? styles.selected : ""}`}
          onClick={() => handleSelect(hotel)}
        >
          {/* Hotel Image */}
          {hotel.image && (
            <div className={styles.hotelImage}>
              <img src={hotel.image} alt={hotel.name} />
              {selectedHotel === hotel && (
                <div className={styles.selectedBadge}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" fill="none"/>
                  </svg>
                </div>
              )}
            </div>
          )}

          {/* Hotel Info */}
          <div className={styles.hotelInfo}>
            <div className={styles.hotelHeader}>
              <h4 className={styles.hotelName}>
                {isArabic ? hotel.hotel_name_ar : hotel.hotel_name_en}
              </h4>
              <div className={styles.stars}>
                {"⭐".repeat(hotel.stars || 4)}
              </div>
            </div>

            {hotel.area && (
              <div className={styles.location}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{hotel.area}</span>
              </div>
            )}

            {hotel.room_type_ar && (
              <div className={styles.roomType}>
                {isArabic ? hotel.room_type_ar : hotel.room_type_en}
              </div>
            )}

            {/* Price */}
            <div className={styles.priceSection}>
              <div className={styles.price}>
                <span className={styles.priceEGP}>
                  {hotel.price_egp?.toLocaleString()} {t("ج.م", "EGP")}
                </span>
                <span className={styles.priceUSD}>
                  ${hotel.price_usd_reference}
                </span>
              </div>
              <button className={styles.selectButton}>
                {selectedHotel === hotel
                  ? t("تم الاختيار", "Selected")
                  : t("اختر", "Select")}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
