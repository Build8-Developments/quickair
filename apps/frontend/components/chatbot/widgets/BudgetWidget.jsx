"use client";

import { useState } from "react";
import styles from "./BudgetWidget.module.css";

const BUDGET_RANGES = [
  { id: "budget", labelAr: "اقتصادي", labelEn: "Budget", minEGP: 3750, maxEGP: 10000, icon: "💰" },
  { id: "moderate", labelAr: "متوسط", labelEn: "Mid-range", minEGP: 10000, maxEGP: 20000, icon: "💵" },
  { id: "comfort", labelAr: "مريح", labelEn: "Comfortable", minEGP: 20000, maxEGP: 35000, icon: "💎" },
  { id: "luxury", labelAr: "فاخر", labelEn: "Luxury", minEGP: 35000, maxEGP: null, icon: "👑" },
];

export default function BudgetWidget({ language = "ar", onSelect }) {
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  const handleSelect = (range) => {
    onSelect({
      budget: range.id,
      message: isArabic ? range.labelAr : range.labelEn,
      minEGP: range.minEGP,
      maxEGP: range.maxEGP,
    });
  };

  return (
    <div className={styles.widget} dir={isArabic ? "rtl" : "ltr"}>
      <div className={styles.budgetGrid}>
        {BUDGET_RANGES.map((range) => (
          <button
            key={range.id}
            className={styles.budgetCard}
            onClick={() => handleSelect(range)}
          >
            <span className={styles.icon}>{range.icon}</span>
            <div className={styles.content}>
              <div className={styles.label}>
                {isArabic ? range.labelAr : range.labelEn}
              </div>
              <div className={styles.price}>
                {(range.minEGP / 1000).toFixed(0)}
                {range.maxEGP ? `-${(range.maxEGP / 1000).toFixed(0)}` : "+"}
                {t(" ألف", "K")}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
