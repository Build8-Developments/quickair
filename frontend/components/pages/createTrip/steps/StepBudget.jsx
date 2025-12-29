"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepBudget.module.css";

const CURRENCIES = [
  { code: "EGP", symbol: "ج.م", labelAr: "جنيه مصري", labelEn: "Egyptian Pound" },
  { code: "USD", symbol: "$", labelAr: "دولار أمريكي", labelEn: "US Dollar" },
];

const BUDGET_RANGES_EGP = [
  { id: "budget", labelAr: "اقتصادي", labelEn: "Budget", min: 3750, max: 10000, descAr: "فنادق 3-4 نجوم", descEn: "3-4 star hotels", icon: "wallet" },
  { id: "moderate", labelAr: "متوسط", labelEn: "Moderate", min: 10000, max: 20000, descAr: "فنادق 4 نجوم", descEn: "4 star hotels", icon: "card" },
  { id: "comfort", labelAr: "مريح", labelEn: "Comfortable", min: 20000, max: 35000, descAr: "فنادق 4-5 نجوم", descEn: "4-5 star hotels", icon: "star" },
  { id: "luxury", labelAr: "فاخر", labelEn: "Luxury", min: 35000, max: null, descAr: "فنادق 5 نجوم فاخرة", descEn: "Luxury 5 star hotels", icon: "crown" },
];

const BUDGET_RANGES_USD = [
  { id: "budget", labelAr: "اقتصادي", labelEn: "Budget", min: 79, max: 210, descAr: "فنادق 3-4 نجوم", descEn: "3-4 star hotels", icon: "wallet" },
  { id: "moderate", labelAr: "متوسط", labelEn: "Moderate", min: 210, max: 421, descAr: "فنادق 4 نجوم", descEn: "4 star hotels", icon: "card" },
  { id: "comfort", labelAr: "مريح", labelEn: "Comfortable", min: 421, max: 736, descAr: "فنادق 4-5 نجوم", descEn: "4-5 star hotels", icon: "star" },
  { id: "luxury", labelAr: "فاخر", labelEn: "Luxury", min: 736, max: null, descAr: "فنادق 5 نجوم فاخرة", descEn: "Luxury 5 star hotels", icon: "crown" },
];

const BudgetIcon = ({ type }) => {
  switch (type) {
    case "wallet":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <circle cx="16" cy="12" r="2" />
        </svg>
      );
    case "card":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
    case "star":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "crown":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 17l3-11 5 5 2-8 2 8 5-5 3 11H2z" />
          <path d="M2 17h20v4H2z" />
        </svg>
      );
    default:
      return null;
  }
};

export default function StepBudget({ data, onUpdate, onNext, onPrev }) {
  const [budget, setBudget] = useState(data || { currency: "USD", perPerson: true });
  const [selectedRange, setSelectedRange] = useState(null);
  const [customAmount, setCustomAmount] = useState(data?.amount || "");
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const t = (ar, en) => (isRTL ? ar : en);

  const budgetRanges = budget.currency === "USD" ? BUDGET_RANGES_USD : BUDGET_RANGES_EGP;
  const currencySymbol = CURRENCIES.find((c) => c.code === budget.currency)?.symbol || "$";

  const handleCurrencyChange = (code) => {
    setSelectedRange(null);
    setCustomAmount("");
    const newBudget = { ...budget, currency: code, amount: 0 };
    setBudget(newBudget);
    onUpdate(newBudget);
  };

  const handleRangeSelect = (range) => {
    setSelectedRange(range.id);
    const avgAmount = range.max ? Math.round((range.min + range.max) / 2) : range.min;
    setCustomAmount(avgAmount);
    const newBudget = { ...budget, amount: avgAmount, range: range.id };
    setBudget(newBudget);
    onUpdate(newBudget);
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setSelectedRange(null);
    const newBudget = { ...budget, amount: parseFloat(value) || 0, range: null };
    setBudget(newBudget);
    onUpdate(newBudget);
  };

  const handlePerPersonToggle = () => {
    const newBudget = { ...budget, perPerson: !budget.perPerson };
    setBudget(newBudget);
    onUpdate(newBudget);
  };

  const isValid = budget.amount && budget.amount > 0;

  return (
    <div className="step-content" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{t("ما هي ميزانيتك؟", "What's your budget?")}</h2>
        <p className={styles.subtitle}>{t("سنجد لك خيارات تناسب ميزانيتك", "We'll find options that fit your budget")}</p>
      </div>

      <div className={styles.container}>
        {/* Currency Selection */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>{t("العملة", "Currency")}</label>
          <div className={styles.currencyGrid}>
            {CURRENCIES.map((currency) => (
              <div
                key={currency.code}
                className={`${styles.currencyCard} ${budget.currency === currency.code ? styles.currencyActive : ""}`}
                onClick={() => handleCurrencyChange(currency.code)}
              >
                <span className={styles.currencySymbol}>{currency.symbol}</span>
                <span className={styles.currencyName}>{t(currency.labelAr, currency.labelEn)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Ranges */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>{t("نطاق الميزانية", "Budget Range")}</label>
          <div className={styles.rangeGrid}>
            {budgetRanges.map((range) => (
              <div
                key={range.id}
                className={`${styles.rangeCard} ${selectedRange === range.id ? styles.rangeActive : ""}`}
                onClick={() => handleRangeSelect(range)}
              >
                <div className={styles.rangeIcon}>
                  <BudgetIcon type={range.icon} />
                </div>
                <div className={styles.rangeContent}>
                  <span className={styles.rangeLabel}>{t(range.labelAr, range.labelEn)}</span>
                  <span className={styles.rangePrice}>
                    {range.min.toLocaleString()} - {range.max ? range.max.toLocaleString() : `${range.min.toLocaleString()}+`} {currencySymbol}
                  </span>
                  <span className={styles.rangeDesc}>{t(range.descAr, range.descEn)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>{t("أو أدخل مبلغ محدد", "Or enter custom amount")}</label>
          <div className={styles.customInput}>
            <span className={styles.inputPrefix}>{currencySymbol}</span>
            <input
              type="number"
              className={styles.amountInput}
              placeholder={t("أدخل المبلغ", "Enter amount")}
              value={customAmount}
              onChange={(e) => handleCustomAmount(e.target.value)}
              min="0"
            />
          </div>
        </div>

        {/* Per Person Toggle */}
        <div className={styles.toggleCard} onClick={handlePerPersonToggle}>
          <div className={styles.toggleContent}>
            <div className={styles.toggleIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className={styles.toggleText}>
              <span className={styles.toggleLabel}>{t("ميزانية لكل فرد", "Per person budget")}</span>
              <span className={styles.toggleDesc}>
                {budget.perPerson ? t("الميزانية لكل مسافر", "Budget per traveler") : t("ميزانية الرحلة كاملة", "Total trip budget")}
              </span>
            </div>
          </div>
          <div className={`${styles.toggle} ${budget.perPerson ? styles.toggleOn : ""}`}>
            <div className={styles.toggleKnob} />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button className={styles.backButton} onClick={onPrev}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isRTL ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"} />
          </svg>
          {t("رجوع", "Back")}
        </button>
        <button
          className={`${styles.continueButton} ${!isValid ? styles.disabled : ""}`}
          onClick={onNext}
          disabled={!isValid}
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
