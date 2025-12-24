"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepBudget.module.css";

const BUDGET_RANGES = [
  { id: "budget", label: "اقتصادي", labelEn: "Budget", min: 3750, max: 10000, desc: "فنادق 3-4 نجوم", descEn: "3-4 star hotels" },
  { id: "moderate", label: "متوسط", labelEn: "Moderate", min: 10000, max: 20000, desc: "فنادق 4 نجوم", descEn: "4 star hotels" },
  { id: "comfort", label: "مريح", labelEn: "Comfortable", min: 20000, max: 35000, desc: "فنادق 4-5 نجوم", descEn: "4-5 star hotels" },
  { id: "luxury", label: "فاخر", labelEn: "Luxury", min: 35000, max: null, desc: "فنادق 5 نجوم فاخرة", descEn: "Luxury 5 star hotels" },
];

const CURRENCIES = [
  { code: "EGP", symbol: "ج.م", label: "جنيه مصري", labelEn: "Egyptian Pound" },
  { code: "USD", symbol: "$", label: "دولار أمريكي", labelEn: "US Dollar" },
];

const USD_BUDGET_RANGES = [
  { id: "budget", label: "اقتصادي", labelEn: "Budget", min: 79, max: 210, desc: "فنادق 3-4 نجوم", descEn: "3-4 star hotels" },
  { id: "moderate", label: "متوسط", labelEn: "Moderate", min: 210, max: 421, desc: "فنادق 4 نجوم", descEn: "4 star hotels" },
  { id: "comfort", label: "مريح", labelEn: "Comfortable", min: 421, max: 736, desc: "فنادق 4-5 نجوم", descEn: "4-5 star hotels" },
  { id: "luxury", label: "فاخر", labelEn: "Luxury", min: 736, max: null, desc: "فنادق 5 نجوم فاخرة", descEn: "Luxury 5 star hotels" },
];

export default function StepBudget({ data, onUpdate, onNext, onPrev }) {
  const [budget, setBudget] = useState(data);
  const [customAmount, setCustomAmount] = useState(data.amount || "");
  const [selectedRange, setSelectedRange] = useState(null);
  const { language, t } = useLanguage();

  // Get the correct budget ranges based on selected currency
  const activeBudgetRanges = budget.currency === "USD" ? USD_BUDGET_RANGES : BUDGET_RANGES;
  const selectedCurrency = CURRENCIES.find(c => c.code === budget.currency);

  const handleRangeSelect = (range) => {
    setSelectedRange(range.id);
    const defaultIncrement = budget.currency === "USD" ? 100 : 5000;
    const avgAmount = range.max 
      ? (range.min + range.max) / 2 
      : range.min + defaultIncrement;
    
    const newBudget = {
      ...budget,
      amount: avgAmount,
      range: range.id,
    };
    setBudget(newBudget);
    setCustomAmount(avgAmount);
    onUpdate(newBudget);
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setSelectedRange(null);
    const newBudget = {
      ...budget,
      amount: parseFloat(value) || 0,
      range: null,
    };
    setBudget(newBudget);
    onUpdate(newBudget);
  };

  const handleCurrencyChange = (currency) => {
    // Reset range selection when currency changes
    setSelectedRange(null);
    setCustomAmount("");
    const newBudget = { ...budget, currency, amount: 0, range: null };
    setBudget(newBudget);
    onUpdate(newBudget);
  };

  const handlePerPersonToggle = () => {
    const newBudget = { ...budget, perPerson: !budget.perPerson };
    setBudget(newBudget);
    onUpdate(newBudget);
  };

  const handleContinue = () => {
    if (budget.amount && budget.amount > 0) {
      onNext();
    }
  };

  return (
    <div className="step-content">
      <div className="text-center mb-50">
        <h2 className="text-32 fw-700 text-dark-1 mb-12">
          {t('ما هي ميزانيتك؟', 'What\'s your budget?')}
        </h2>
        <p className="text-17 text-dark-2">
          {t('سنجد لك خيارات رائعة تناسب ميزانيتك', 'We\'ll find great options that fit your budget')}
        </p>
      </div>

      <div className="row justify-center">
        <div className="col-xl-9 col-lg-10">
          {/* Currency Selector */}
          <div className="currency-selector mb-40">
            <label className={styles.sectionLabel}>
              {t('اختر العملة', 'Choose Currency')}
            </label>
            <div className="row x-gap-20 y-gap-20">
              {CURRENCIES.map((currency) => (
                <div key={currency.code} className="col-md-6">
                  <div
                    className={`${styles.currencyCard} ${budget.currency === currency.code ? styles.currencyCardSelected : ""}`}
                    onClick={() => handleCurrencyChange(currency.code)}
                  >
                    <span className={styles.currencySymbol}>{currency.symbol}</span>
                    <div className={styles.currencyInfo}>
                      <span className={styles.currencyLabel}>
                        {t(currency.label, currency.labelEn)}
                      </span>
                      <span className={styles.currencyCode}>
                        {currency.labelEn}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Ranges */}
          <div className="budget-ranges mb-40">
            <label className={styles.sectionLabel}>
              {t('نطاقات الميزانية', 'Budget Ranges')}
            </label>
            <div className="row x-gap-20 y-gap-20">
              {activeBudgetRanges.map((range) => (
                <div key={range.id} className="col-lg-6 col-md-6">
                  <div
                    className={`${styles.budgetRangeCard} ${selectedRange === range.id ? styles.budgetRangeCardSelected : ""}`}
                    onClick={() => handleRangeSelect(range)}
                  >
                    <div className={styles.budgetIconWrapper}>
                      {range.id === 'budget' && (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
                          <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/>
                          <path d="M9 5v-2"/>
                          <path d="M15 5v-2"/>
                        </svg>
                      )}
                      {range.id === 'moderate' && (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                          <line x1="1" y1="10" x2="23" y2="10"/>
                        </svg>
                      )}
                      {range.id === 'comfort' && (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      )}
                      {range.id === 'luxury' && (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="8" r="6"/>
                          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                        </svg>
                      )}
                    </div>
                    <div className={styles.budgetContent}>
                      <h4 className={styles.budgetTitle}>
                        {t(range.label, range.labelEn)}
                      </h4>
                      <p className={styles.budgetPrice}>
                        {range.min.toLocaleString()} - {range.max ? `${range.max.toLocaleString()} ${selectedCurrency?.symbol}` : `${range.min.toLocaleString()}+ ${selectedCurrency?.symbol}`}
                      </p>
                      <p className={styles.budgetDesc}>
                        {t(range.desc, range.descEn)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="custom-amount mb-40">
            <label className={styles.sectionLabel}>
              {t('أو أدخل مبلغ مخصص', 'Or enter a custom amount')}
            </label>
            <div className={styles.amountInputWrapper}>
              <span className={styles.currencyPrefix}>
                {selectedCurrency?.symbol}
              </span>
              <input
                type="number"
                className={styles.amountInput}
                placeholder={t('أدخل المبلغ', 'Enter amount')}
                value={customAmount}
                onChange={(e) => handleCustomAmount(e.target.value)}
                min="0"
              />
            </div>
          </div>

          {/* Per Person Toggle */}
          <div className="per-person-toggle mb-40">
            <div className={styles.toggleCard} onClick={handlePerPersonToggle}>
              <div className={styles.toggleContent}>
                <div className={styles.toggleInfo}>
                  <div className={styles.iconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className={styles.toggleText}>
                    <h4 className={styles.toggleTitle}>
                      {t('ميزانية لكل فرد', 'Per person budget')}
                    </h4>
                    <p className={styles.toggleDesc}>
                      {budget.perPerson 
                        ? t('الميزانية محسوبة لكل مسافر', 'Budget calculated per traveler')
                        : t('الميزانية للرحلة بالكامل', 'Total trip budget')}
                    </p>
                  </div>
                </div>
                <div className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    className={styles.toggleInput}
                    checked={budget.perPerson}
                    onChange={handlePerPersonToggle}
                  />
                  <span className={styles.slider}></span>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Summary */}
          {budget.amount > 0 && (
            <div className={styles.budgetSummary}>
              <div className={styles.summaryContent}>
                <div className={styles.summaryIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
                    <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/>
                  </svg>
                </div>
                <div className={styles.summaryInfo}>
                  <h4 className={styles.summaryLabel}>
                    {t('ميزانيتك', 'Your Budget')}
                  </h4>
                  <p className={styles.summaryAmount}>
                    {selectedCurrency?.symbol}
                    {parseFloat(budget.amount).toLocaleString()}
                  </p>
                  <p className={styles.summaryType}>
                    {budget.perPerson ? t('لكل فرد', 'Per person') : t('ميزانية الرحلة الكاملة', 'Total trip budget')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-between mt-50">
        <button
          className="button -md -outline-accent-1 text-accent-1 px-40 py-15 rounded-12"
          onClick={onPrev}
        >
          <i className="icon-arrow-right mr-10"></i>
          {t('رجوع', 'Back')}
        </button>
        <button
          className={`button -md -dark-1 bg-accent-1 text-white px-50 py-15 rounded-12 ${
            !budget.amount || budget.amount <= 0 ? "opacity-50" : ""
          } ${styles.continueButton}`}
          onClick={handleContinue}
          disabled={!budget.amount || budget.amount <= 0}
        >
          {t('متابعة', 'Continue')}
          <i className="icon-arrow-left ml-10"></i>
        </button>
      </div>
    </div>
  );
}
