"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepDates.module.css";

export default function StepDates({ data, onUpdate, onNext, onPrev }) {
  const [dates, setDates] = useState(data);
  const { language, t } = useLanguage();

  const handleDateChange = (field, value) => {
    const newDates = { ...dates, [field]: value };
    setDates(newDates);
    onUpdate(newDates);
  };

  const handleFlexibleToggle = () => {
    const newDates = { ...dates, flexible: !dates.flexible };
    setDates(newDates);
    onUpdate(newDates);
  };

  const handleContinue = () => {
    if (dates.flexible || (dates.startDate && dates.endDate)) {
      onNext();
    }
  };

  const isValidDates = () => {
    if (dates.flexible) return true;
    if (!dates.startDate || !dates.endDate) return false;
    return new Date(dates.startDate) < new Date(dates.endDate);
  };

  return (
    <div className="step-content">
      <div className="text-center mb-50">
        <h2 className="text-32 fw-700 text-dark-1 mb-12">
          {t('إمتى عايز تسافر؟', 'When are you thinking?')}
        </h2>
        <p className="text-17 text-dark-2">
          {t('اختر تاريخ السفر أو خليه مرن لعروض أفضل', 'Pick your dates or stay flexible for better deals')}
        </p>
      </div>

      <div className="row justify-center">
        <div className="col-xl-7 col-lg-9">
          {/* Flexible Dates Toggle */}
          <div className="flexible-toggle mb-40">
            <div
              className={`${styles.toggleCard} ${dates.flexible ? styles.toggleCardActive : ""}`}
              onClick={handleFlexibleToggle}
            >
              <div className={styles.toggleContent}>
                <div className={styles.toggleInfo}>
                  <div className={styles.iconWrapper}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div className={styles.toggleText}>
                    <h4 className={styles.toggleTitle}>
                      {t('التواريخ مرنة', 'My dates are flexible')}
                    </h4>
                    <p className={styles.toggleDesc}>
                      {t('احصل على عروض أفضل مع تواريخ سفر مرنة', 'Get better deals with flexible travel dates')}
                    </p>
                  </div>
                </div>
                <div className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    className={styles.toggleInput}
                    checked={dates.flexible}
                    onChange={handleFlexibleToggle}
                  />
                  <span className={styles.slider}></span>
                </div>
              </div>
            </div>
          </div>

          {/* Date Pickers */}
          {!dates.flexible && (
            <div className={styles.datesBox}>
              {/* Start Date */}
              <div className={styles.dateField}>
                <label className={styles.dateLabel}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
                  </svg>
                  {t('تاريخ المغادرة', 'Departure Date')}
                </label>
                <input
                  type="date"
                  className={styles.dateInput}
                  value={dates.startDate || ""}
                  onChange={(e) => handleDateChange("startDate", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className={styles.divider}></div>

              {/* End Date */}
              <div className={styles.dateField}>
                <label className={styles.dateLabel}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
                  </svg>
                  {t('تاريخ العودة', 'Return Date')}
                </label>
                <input
                  type="date"
                  className={styles.dateInput}
                  value={dates.endDate || ""}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  min={dates.startDate || new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Duration Info */}
              {dates.startDate && dates.endDate && isValidDates() && (
                <div className={styles.durationSummary}>
                  <div className={styles.durationContent}>
                    <div className={styles.durationIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </div>
                    <span className={styles.durationLabel}>{t('مدة الرحلة', 'Trip Duration')}</span>
                    <span className={styles.durationValue}>
                      {Math.ceil(
                        (new Date(dates.endDate) - new Date(dates.startDate)) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      {t('يوم', 'Days')}
                    </span>
                  </div>
                </div>
              )}
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
            !isValidDates() ? "opacity-50" : ""
          } ${styles.continueButton}`}
          onClick={handleContinue}
          disabled={!isValidDates()}
        >
          {t('التالي', 'Continue')}
          <i className="icon-arrow-left ml-10"></i>
        </button>
      </div>
    </div>
  );
}
