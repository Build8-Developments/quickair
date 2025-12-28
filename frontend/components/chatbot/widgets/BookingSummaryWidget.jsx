"use client";

import styles from "./BookingSummaryWidget.module.css";

export default function BookingSummaryWidget({ 
  bookingData = {}, 
  tripData = {},
  userInfo = {},
  language = "ar", 
  onConfirm,
  onEdit 
}) {
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  // Support both bookingData and tripData props
  const data = Object.keys(bookingData).length > 0 ? bookingData : tripData;
  const { destination, dates, travelers, budget, selectedHotel, hotel, mealPlan, roomType } = data;
  const hotelData = selectedHotel || hotel;

  // Edit button component
  const EditBtn = ({ field }) => (
    <button 
      className={styles.editBtn} 
      onClick={() => onEdit && onEdit(field)}
      title={t("تعديل", "Edit")}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </button>
  );

  return (
    <div className={styles.widget} dir={isArabic ? "rtl" : "ltr"}>
      <div className={styles.summaryHeader}>
        <h3 className={styles.title}>{t("ملخص الحجز", "Booking Summary")}</h3>
      </div>

      <div className={styles.sections}>
        {/* Trip Details - Destination */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {t("الوجهة", "Destination")}
            </div>
            <EditBtn field="destination" />
          </div>
          <div className={styles.details}>
            <div className={styles.detailValue}>
              {destination?.name || destination || t("غير محدد", "Not set")}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {t("التاريخ", "Dates")}
            </div>
            <EditBtn field="dates" />
          </div>
          <div className={styles.details}>
            <div className={styles.detailValue}>
              {dates?.startDate 
                ? `${dates.startDate} → ${dates.endDate || "..."} (${dates.nights || "?"} ${t("ليالي", "nights")})`
                : t("غير محدد", "Not set")
              }
            </div>
          </div>
        </div>

        {/* Travelers */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {t("المسافرون", "Travelers")}
            </div>
            <EditBtn field="travelers" />
          </div>
          <div className={styles.details}>
            <div className={styles.detailValue}>
              {travelers 
                ? `${travelers?.adults || travelers?.total || travelers} ${t("بالغ", "adult(s)")}${travelers?.children > 0 ? ` + ${travelers.children} ${t("طفل", "child")}` : ""}`
                : t("غير محدد", "Not set")
              }
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                <path d="M12 18V6"/>
              </svg>
              {t("الميزانية", "Budget")}
            </div>
            <EditBtn field="budget" />
          </div>
          <div className={styles.details}>
            <div className={styles.detailValue}>
              {budget 
                ? (budget.label || budget.message || (
                    budget.minEGP && budget.maxEGP 
                      ? `${(budget.minEGP / 1000).toFixed(0)}-${(budget.maxEGP / 1000).toFixed(0)}${t(" ألف", "K")}` 
                      : budget.minEGP 
                        ? `${(budget.minEGP / 1000).toFixed(0)}+${t(" ألف", "K")}`
                        : budget
                  ))
                : t("غير محدد", "Not set")
              }
            </div>
          </div>
        </div>

        {/* Hotel */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
              </svg>
              {t("الفندق", "Hotel")}
            </div>
            <EditBtn field="hotel" />
          </div>
          <div className={styles.details}>
            <div className={styles.detailValue}>
              {hotelData 
                ? `${isArabic ? hotelData.hotel_name_ar : hotelData.hotel_name_en || hotelData.name || hotelData}${hotelData.stars ? ` ${"⭐".repeat(hotelData.stars)}` : ""}`
                : t("غير محدد", "Not set")
              }
            </div>
            {hotelData?.price_egp && (
              <div className={styles.priceTag}>
                {hotelData.price_egp?.toLocaleString()} {t("ج.م", "EGP")}
              </div>
            )}
          </div>
        </div>

        {/* Meal Plan */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/>
                <line x1="10" y1="1" x2="10" y2="4"/>
                <line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
              {t("الوجبات", "Meals")}
            </div>
            <EditBtn field="mealPlan" />
          </div>
          <div className={styles.details}>
            <div className={styles.detailValue}>
              {mealPlan?.label || mealPlan || t("غير محدد", "Not set")}
            </div>
          </div>
        </div>

        {/* Room Type */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/>
                <path d="M21 7H3l2-4h14l2 4z"/>
                <path d="M12 4v3"/>
              </svg>
              {t("الغرفة", "Room")}
            </div>
            <EditBtn field="roomType" />
          </div>
          <div className={styles.details}>
            <div className={styles.detailValue}>
              {roomType?.label || roomType || t("غير محدد", "Not set")}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button className={styles.confirmButton} onClick={onConfirm}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          {t("تأكيد الحجز", "Confirm Booking")}
        </button>
      </div>
    </div>
  );
}
