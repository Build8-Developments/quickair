"use client";

import { useState } from "react";
import styles from "./DateRangeWidget.module.css";

export default function DateRangeWidget({ language = "ar", onSelect }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end - start;
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    // Validate reasonable range (0-365 days)
    if (nights < 0 || nights > 365) return -1;
    return nights;
  };

  const handleConfirm = () => {
    const nights = calculateNights();
    if (startDate && endDate && nights > 0) {
      onSelect({
        startDate,
        endDate,
        nights,
        message: `${startDate} to ${endDate} (${nights} ${nights === 1 ? 'night' : 'nights'})`,
      });
    }
  };

  const nights = calculateNights();

  return (
    <div className={styles.widget} dir={isArabic ? "rtl" : "ltr"}>
      <div className={styles.dateInputs}>
        <div className={styles.dateField}>
          <label className={styles.label}>
            {t("تاريخ البداية", "Start Date")}
          </label>
          <input
            type="date"
            className={styles.dateInput}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
          />
        </div>

        <div className={styles.dateField}>
          <label className={styles.label}>
            {t("تاريخ النهاية", "End Date")}
          </label>
          <input
            type="date"
            className={styles.dateInput}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || new Date().toISOString().split('T')[0]}
            max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
          />
        </div>
      </div>

      {nights > 0 && nights <= 365 && (
        <div className={styles.nightsInfo}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <span>
            {nights} {t(nights === 1 ? "ليلة" : "ليالي", nights === 1 ? "night" : "nights")}
          </span>
        </div>
      )}
      
      {nights > 365 && (
        <div className={styles.errorInfo}>
          {t("الرجاء اختيار فترة أقل من سنة", "Please select a period less than 1 year")}
        </div>
      )}

      <button
        className={styles.confirmButton}
        onClick={handleConfirm}
        disabled={!startDate || !endDate || nights <= 0}
      >
        {t("تأكيد التواريخ", "Confirm Dates")}
      </button>
    </div>
  );
}
