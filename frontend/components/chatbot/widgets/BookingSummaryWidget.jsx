"use client";

import styles from "./BookingSummaryWidget.module.css";

export default function BookingSummaryWidget({ 
  bookingData, 
  userInfo,
  language = "ar", 
  onConfirm,
  onEdit 
}) {
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  const { destination, dates, travelers, budget, hotel, mealPlan, roomType } = bookingData;

  return (
    <div className={styles.widget} dir={isArabic ? "rtl" : "ltr"}>
      <div className={styles.summaryHeader}>
        <h3 className={styles.title}>{t("ملخص الحجز", "Booking Summary")}</h3>
      </div>

      <div className={styles.sections}>
        {/* Personal Info */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {t("المعلومات الشخصية", "Personal Information")}
          </div>
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.label}>{t("الاسم:", "Name:")}</span>
              <span className={styles.value}>{userInfo?.name}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>{t("البريد:", "Email:")}</span>
              <span className={styles.value}>{userInfo?.email}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>{t("الهاتف:", "Phone:")}</span>
              <span className={styles.value}>{userInfo?.phone}</span>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
            {t("تفاصيل الرحلة", "Trip Details")}
          </div>
          <div className={styles.details}>
            {destination && (
              <div className={styles.detailRow}>
                <span className={styles.label}>{t("الوجهة:", "Destination:")}</span>
                <span className={styles.value}>{destination.name}</span>
              </div>
            )}
            {dates && (
              <>
                <div className={styles.detailRow}>
                  <span className={styles.label}>{t("من:", "From:")}</span>
                  <span className={styles.value}>{dates.startDate}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>{t("إلى:", "To:")}</span>
                  <span className={styles.value}>{dates.endDate}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>{t("المدة:", "Duration:")}</span>
                  <span className={styles.value}>
                    {dates.nights} {t(dates.nights === 1 ? "ليلة" : "ليالي", dates.nights === 1 ? "night" : "nights")}
                  </span>
                </div>
              </>
            )}
            {travelers && (
              <div className={styles.detailRow}>
                <span className={styles.label}>{t("المسافرون:", "Travelers:")}</span>
                <span className={styles.value}>
                  {travelers.adults} {t("بالغ", "adult(s)")}
                  {travelers.children > 0 && ` + ${travelers.children} ${t("طفل", "child(ren)")}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hotel Info */}
        {hotel && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <path d="M3 12h18M3 6h18M9 18h6"/>
                <rect x="3" y="4" width="18" height="16" rx="2"/>
              </svg>
              {t("الفندق", "Hotel")}
            </div>
            <div className={styles.details}>
              <div className={styles.detailRow}>
                <span className={styles.label}>{t("الفندق:", "Hotel:")}</span>
                <span className={styles.value}>
                  {isArabic ? hotel.hotel_name_ar : hotel.hotel_name_en} {"⭐".repeat(hotel.stars || 4)}
                </span>
              </div>
              {mealPlan && (
                <div className={styles.detailRow}>
                  <span className={styles.label}>{t("الوجبات:", "Meals:")}</span>
                  <span className={styles.value}>{mealPlan.label}</span>
                </div>
              )}
              {roomType && (
                <div className={styles.detailRow}>
                  <span className={styles.label}>{t("الغرفة:", "Room:")}</span>
                  <span className={styles.value}>{roomType.label}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.label}>{t("السعر:", "Price:")}</span>
                <span className={styles.valuePrice}>
                  {hotel.price_egp?.toLocaleString()} {t("ج.م", "EGP")} (${hotel.price_usd_reference})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Budget */}
        {budget && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                <path d="M12 18V6"/>
              </svg>
              {t("الميزانية", "Budget")}
            </div>
            <div className={styles.details}>
              <div className={styles.detailRow}>
                <span className={styles.label}>{t("النطاق:", "Range:")}</span>
                <span className={styles.value}>
                  {budget.label || budget.message || (
                    budget.minEGP && budget.maxEGP 
                      ? `${(budget.minEGP / 1000).toFixed(0)}-${(budget.maxEGP / 1000).toFixed(0)}${t(" ألف", "K")}` 
                      : budget.minEGP 
                        ? `${(budget.minEGP / 1000).toFixed(0)}+${t(" ألف", "K")}`
                        : budget.budget || t("غير محدد", "Not specified")
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button className={styles.editButton} onClick={() => onEdit && onEdit("trip")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          {t("تعديل", "Edit")}
        </button>
        <button className={styles.confirmButton} onClick={onConfirm}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          {t("تأكيد الحجز", "Confirm Booking")}
        </button>
      </div>
    </div>
  );
}
