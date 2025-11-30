"use client";

import { useState } from "react";
import { getHotelsForDestination } from "@/data/toursData";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepHotel.module.css";

export default function StepHotel({ data, destination, locationType, onUpdate, onNext, onPrev }) {
  const [selectedHotel, setSelectedHotel] = useState(data);
  const [selectedRoomType, setSelectedRoomType] = useState('double');
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStars, setFilterStars] = useState(0);
  const { language, t } = useLanguage();
  const isRTL = language === "ar";

  // Get hotels for selected destination
  const hotels = destination?.data?.hotels || [];

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch = 
      hotel.hotel_name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  return (
    <div className="step-content" dir={isRTL ? "rtl" : "ltr"}>
      <div className="text-center mb-40">
        <h2 className="text-30 fw-600 text-dark-1 mb-10">
          {t(
            `اختر فندقك في ${destination?.name}`,
            `Choose Your Hotel in ${destination?.nameEn || destination?.name}`
          )}
        </h2>
        <p className="text-16 text-dark-2">
          {t(`${hotels.length} فندق متاح`, `${hotels.length} hotels available`)}
        </p>
      </div>

      {/* Filters Section */}
      <div className={`${styles.filtersSection} mb-40`}>
        {/* Search */}
        <div className={styles.filterGroup}>
          <h4 className={styles.filterLabel}>{t('ابحث عن الفندق', 'Search for Hotel')}</h4>
          <div className={styles.searchField}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={t('ابحث عن الفندق...', 'Search for hotel...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            />
          </div>
        </div>

        {/* Room Type Filter */}
        <div className={styles.filterGroup}>
          <h4 className={styles.filterLabel}>{t('نوع الغرفة', 'Room Type')}</h4>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${selectedRoomType === 'double' ? styles.activeButton : ''}`.trim()}
              onClick={() => setSelectedRoomType('double')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H9z"/>
                <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13H4V7z"/>
                <path d="M12 7v6"/>
              </svg>
              <span>{t('مزدوج', 'Double')}</span>
            </button>
            <button
              className={`${styles.filterButton} ${selectedRoomType === 'single' ? styles.activeButton : ''}`.trim()}
              onClick={() => setSelectedRoomType('single')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H9z"/>
                <path d="M6 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13H6V7z"/>
              </svg>
              <span>{t('فردي', 'Single')}</span>
            </button>
            <button
              className={`${styles.filterButton} ${selectedRoomType === 'triple' ? styles.activeButton : ''}`.trim()}
              onClick={() => setSelectedRoomType('triple')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13H3V7z"/>
                <path d="M8 7v6"/>
                <path d="M16 7v6"/>
              </svg>
              <span>{t('ثلاثي', 'Triple')}</span>
            </button>
          </div>
        </div>

        {/* Stars Filter */}
        <div className={styles.filterGroup}>
          <h4 className={styles.filterLabel}>{t('تقييم الفندق', 'Hotel Rating')}</h4>
          <div className={styles.filterButtons}>
            {[0, 3, 4, 5].map((stars) => (
              <button
                key={stars}
                className={`${styles.filterButton} ${filterStars === stars ? styles.activeButton : ''}`.trim()}
                onClick={() => setFilterStars(stars)}
              >
                {stars === 0 ? (
                  <span>{t('الكل', 'All')}</span>
                ) : (
                  <>
                    <span className={styles.starsCount}>{stars}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={filterStars === stars ? "#ffffff" : "#fbbf24"} stroke={filterStars === stars ? "#ffffff" : "#fbbf24"} strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className={styles.hotelsList}>
        {filteredHotels.map((hotel, index) => {
          const price = getPrice(hotel);
          const isSelected = selectedHotel?.hotel_name_en === hotel.hotel_name_en;

          return (
            <div key={index} className={styles.hotelCardWrapper}>
              <div
                className={`${styles.hotelCard} ${isSelected ? styles.selectedCard : ""}`.trim()}
                onClick={() => handleSelect(hotel)}
              >
                {/* Hotel Icon */}
                <div className={styles.hotelIcon}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4v16"/>
                    <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
                    <path d="M2 17h20"/>
                    <path d="M6 8V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/>
                  </svg>
                </div>

                {/* Hotel Info */}
                <div className={styles.hotelInfo}>
                  <div className={styles.hotelHeader}>
                    <h3 className={styles.hotelName}>
                      {isRTL ? hotel.hotel_name_ar : hotel.hotel_name_en}
                    </h3>
                    {/* Stars */}
                    <div className={styles.hotelStars}>
                      {[...Array(hotel.stars)].map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>
                  </div>

                  <div className={styles.hotelDetails}>
                    <div className={styles.detailItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>{hotel.area}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>{isRTL ? hotel.room_type_ar : hotel.room_type_en}</span>
                    </div>
                  </div>

                  {hotel.valid_from && hotel.valid_to && (
                    <div className={styles.hotelValidity}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>{t(`صالح من ${hotel.valid_from} إلى ${hotel.valid_to}`, `Valid from ${hotel.valid_from} to ${hotel.valid_to}`)}</span>
                    </div>
                  )}
                </div>

                {/* Hotel Price */}
                {price && (
                  <div className={styles.priceWrapper}>
                    <div className={styles.priceLabel}>{t('السعر للفرد', 'Price per Person')}</div>
                    <div className={styles.priceAmount}>
                      {price.toLocaleString()} <span className={styles.currency}>{t('جنيه', 'EGP')}</span>
                    </div>
                    <div className={styles.priceUsd}>≈ ${Math.round(price / 50)} USD</div>
                  </div>
                )}

                {/* Selected Check */}
                {isSelected && (
                  <div className={styles.selectedCheck}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredHotels.length === 0 && (
        <div className="text-center py-60">
          <i className="icon-search text-60 text-dark-3"></i>
          <h3 className="text-20 fw-500 text-dark-2 mt-20">
            {t('لا توجد فنادق متطابقة', 'No matching hotels')}
          </h3>
          <p className="text-15 text-dark-3 mt-10">
            {t('جرب تغيير معايير البحث', 'Try changing the search criteria')}
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
            !selectedHotel ? styles.disabledButton : ""
          }`}
          onClick={handleContinue}
          disabled={!selectedHotel}
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          {t('متابعة', 'Continue')}
          <i className={`icon-arrow-${isRTL ? 'right' : 'left'}`}></i>
        </button>
      </div>

      <style jsx>{`
        .filters-section {
          background: white;
          border: 2.5px solid #e5e7eb;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }

        .filter-group {
          margin-bottom: 28px;
        }

        .filter-group:last-child {
          margin-bottom: 0;
        }

        .filter-label {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .searchMenu-loc {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .searchMenu-loc:focus-within {
          border-color: #019fb1;
          background: white;
          box-shadow: 0 0 0 3px rgba(1, 159, 177, 0.1);
        }

        .search-input {
          border: none;
          background: transparent;
          font-size: 16px;
          font-weight: 500;
          color: #1f2937;
          width: 100%;
          outline: none;
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .filter-buttons-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 12px 24px;
          border: 2.5px solid #019fb1;
          border-radius: 12px;
          background: white;
          color: #019fb1;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 100px;
          box-shadow: 0 2px 8px rgba(1, 159, 177, 0.08);
        }

        .filter-btn:hover {
          background: #e6f7f9;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(1, 159, 177, 0.15);
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #019fb1 0%, #00b4c8 100%);
          color: white;
          border-color: #00b4c8;
          box-shadow: 0 4px 14px rgba(1, 159, 177, 0.3);
          transform: translateY(-1px);
        }

        .stars-count {
          font-weight: 800;
          font-size: 17px;
        }
          border-color: #019fb1;
          background: linear-gradient(135deg, #e6f7f9 0%, #f0fbfc 50%, #ffffff 100%);
          box-shadow: 0 12px 32px rgba(1, 159, 177, 0.25);
          transform: translateY(-4px);
        }

        .hotel-icon-wrapper {
          width: 72px;
          height: 72px;
          min-width: 72px;
          border-radius: 16px;
          background: linear-gradient(135deg, #e6f7f9 0%, #d0f0f4 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #019fb1;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(1, 159, 177, 0.1);
        }

        .hotel-card:hover .hotel-icon-wrapper {
          background: linear-gradient(135deg, #d0f0f4 0%, #b3e6ed 100%);
          transform: scale(1.08) rotate(-3deg);
          box-shadow: 0 6px 16px rgba(1, 159, 177, 0.2);
        }

        .hotel-card.selected .hotel-icon-wrapper {
          background: linear-gradient(135deg, #019fb1 0%, #00b4c8 100%);
          color: white;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(1, 159, 177, 0.3);
        }

        .hotel-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .hotel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          flex-wrap: wrap;
        }

        .hotel-name {
          font-size: 22px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .hotel-stars {
          display: flex;
          gap: 3px;
        }

        .hotel-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: #4b5563;
        }

        .hotel-validity {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #6b7280;
          margin-top: 4px;
        }

        .hotel-price-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          padding: 18px 24px;
          background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
          border-radius: 14px;
          border: 2px solid #f3f4f6;
          min-width: 200px;
        }

        .hotel-card.selected .hotel-price-wrapper {
          background: linear-gradient(135deg, #ffffff 0%, #e6f7f9 100%);
          border-color: #019fb1;
        }

        .price-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 6px;
          letter-spacing: 0.3px;
        }

        .price-amount {
          font-size: 32px;
          font-weight: 800;
          color: #019fb1;
          line-height: 1;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }

        .currency {
          font-size: 18px;
          font-weight: 700;
          margin-right: 4px;
        }

        .price-usd {
          font-size: 14px;
          color: #9ca3af;
          font-weight: 600;
        }

        .selected-check-hotel {
          position: absolute;
          top: 24px;
          left: 24px;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
          animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          border: 3px solid white;
        }

        @keyframes popIn {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.3) rotate(10deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .filters-section {
            padding: 24px;
          }

          .filter-buttons-group {
            gap: 10px;
          }

          .filter-btn {
            min-width: 85px;
            padding: 10px 18px;
            font-size: 15px;
          }

          .hotel-card {
            flex-direction: column;
            align-items: flex-start;
            padding: 24px;
            gap: 20px;
          }

          .hotel-price-wrapper {
            width: 100%;
            align-items: flex-start;
            text-align: left;
          }

          .selected-check-hotel {
            top: 16px;
            left: 16px;
          }
        }
      `}</style>
    </div>
  );
}
