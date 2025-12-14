"use client";

import styles from "./BudgetWidget.module.css";

// SVG Icons for budget ranges
const BudgetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
    <path d="M12 18V6"/>
  </svg>
);

const MidRangeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M12 12h.01"/>
    <path d="M17 12h.01"/>
    <path d="M7 12h.01"/>
  </svg>
);

const ComfortIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 13L2 9z"/>
    <path d="M11 3 8 9l4 13 4-13-3-6"/>
    <path d="M2 9h20"/>
  </svg>
);

const LuxuryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
  </svg>
);

const BUDGET_RANGES = [
  { id: "budget", labelAr: "اقتصادي", labelEn: "Budget", minEGP: 3750, maxEGP: 10000, Icon: BudgetIcon },
  { id: "moderate", labelAr: "متوسط", labelEn: "Mid-range", minEGP: 10000, maxEGP: 20000, Icon: MidRangeIcon },
  { id: "comfort", labelAr: "مريح", labelEn: "Comfortable", minEGP: 20000, maxEGP: 35000, Icon: ComfortIcon },
  { id: "luxury", labelAr: "فاخر", labelEn: "Luxury", minEGP: 35000, maxEGP: null, Icon: LuxuryIcon },
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
            <span className={styles.icon}>
              <range.Icon />
            </span>
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
