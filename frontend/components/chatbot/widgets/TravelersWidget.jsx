"use client";

import { useState } from "react";
import styles from "./TravelersWidget.module.css";

export default function TravelersWidget({ language = "ar", onSelect }) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  const handleIncrement = (type) => {
    if (type === "adults") {
      setAdults(Math.min(adults + 1, 10));
    } else {
      setChildren(Math.min(children + 1, 5));
    }
  };

  const handleDecrement = (type) => {
    if (type === "adults") {
      setAdults(Math.max(adults - 1, 1));
    } else {
      setChildren(Math.max(children - 1, 0));
    }
  };

  const handleConfirm = () => {
    const total = adults + children;
    onSelect({
      travelers: {
        adults,
        children,
        total,
      },
      message: isArabic 
        ? `${adults} بالغ${children > 0 ? ` + ${children} طفل` : ''}`
        : `${adults} adult${adults > 1 ? 's' : ''}${children > 0 ? ` + ${children} child${children > 1 ? 'ren' : ''}` : ''}`,
    });
  };

  return (
    <div className={styles.widget} dir={isArabic ? "rtl" : "ltr"}>
      {/* Adults Counter */}
      <div className={styles.counterRow}>
        <div className={styles.counterInfo}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <div>
            <div className={styles.counterLabel}>{t("البالغون", "Adults")}</div>
            <div className={styles.counterSubtext}>{t("12 سنة فأكثر", "12+ years")}</div>
          </div>
        </div>
        <div className={styles.counterControls}>
          <button
            className={styles.counterButton}
            onClick={() => handleDecrement("adults")}
            disabled={adults <= 1}
          >
            −
          </button>
          <span className={styles.counterValue}>{adults}</span>
          <button
            className={styles.counterButton}
            onClick={() => handleIncrement("adults")}
            disabled={adults >= 10}
          >
            +
          </button>
        </div>
      </div>

      {/* Children Counter */}
      <div className={styles.counterRow}>
        <div className={styles.counterInfo}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
            <circle cx="12" cy="8" r="3"/>
            <path d="M9 14h6a3 3 0 0 1 3 3v3H6v-3a3 3 0 0 1 3-3z"/>
          </svg>
          <div>
            <div className={styles.counterLabel}>{t("الأطفال", "Children")}</div>
            <div className={styles.counterSubtext}>{t("0-11 سنة", "0-11 years")}</div>
          </div>
        </div>
        <div className={styles.counterControls}>
          <button
            className={styles.counterButton}
            onClick={() => handleDecrement("children")}
            disabled={children <= 0}
          >
            −
          </button>
          <span className={styles.counterValue}>{children}</span>
          <button
            className={styles.counterButton}
            onClick={() => handleIncrement("children")}
            disabled={children >= 5}
          >
            +
          </button>
        </div>
      </div>

      {/* Total Summary */}
      <div className={styles.totalSummary}>
        {t("إجمالي المسافرين:", "Total Travelers:")} <strong>{adults + children}</strong>
      </div>

      <button className={styles.confirmButton} onClick={handleConfirm}>
        {t("تأكيد", "Confirm")}
      </button>
    </div>
  );
}
