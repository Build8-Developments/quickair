"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepTravelers.module.css";

export default function StepTravelers({ data, onUpdate, onNext, onPrev }) {
  const [travelers, setTravelers] = useState(data);
  const { language, t } = useLanguage();

  const updateCount = (type, increment) => {
    const newTravelers = { ...travelers };
    const currentValue = newTravelers[type];
    
    if (increment) {
      newTravelers[type] = currentValue + 1;
    } else {
      if (type === "adults" && currentValue <= 1) return;
      if (currentValue > 0) {
        newTravelers[type] = currentValue - 1;
      }
    }
    
    setTravelers(newTravelers);
    onUpdate(newTravelers);
  };

  const handleContinue = () => {
    if (travelers.adults > 0) {
      onNext();
    }
  };

  const totalTravelers = travelers.adults + travelers.children + travelers.infants;

  return (
    <div className="step-content">
      <div className="text-center mb-50">
        <h2 className="text-32 fw-700 text-dark-1 mb-12">
          {t('مين مسافر معاك؟', "Who's coming along?")}
        </h2>
        <p className="text-17 text-dark-2">
          {t('عرّفنا على عدد المسافرين', 'Let us know how many people are traveling')}
        </p>
      </div>

      {/* Travelers Counter */}
      <div className="row justify-center">
        <div className="col-xl-7 col-lg-9">
          <div className={styles.travelersBox}>
            {/* Adults */}
            <div className={styles.travelerItem}>
              <div className={styles.travelerInfo}>
                <div className={styles.iconWrapper}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className={styles.travelerDetails}>
                  <h4 className={styles.travelerTitle}>{t('بالغين', 'Adults')}</h4>
                  <p className={styles.travelerDesc}>{t('+12 سنة', 'Ages 12+')}</p>
                </div>
              </div>
              <div className={styles.counter}>
                <button
                  className={styles.counterBtn}
                  onClick={() => updateCount("adults", false)}
                  disabled={travelers.adults <= 1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <span className={styles.counterValue}>
                  {travelers.adults}
                </span>
                <button
                  className={styles.counterBtn}
                  onClick={() => updateCount("adults", true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.divider}></div>

            {/* Children */}
            <div className={styles.travelerItem}>
              <div className={styles.travelerInfo}>
                <div className={styles.iconWrapper}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="3"/>
                    <path d="M12 11v10"/>
                    <path d="m8 14 4 4 4-4"/>
                    <path d="M9 21h6"/>
                  </svg>
                </div>
                <div className={styles.travelerDetails}>
                  <h4 className={styles.travelerTitle}>{t('أطفال', 'Children')}</h4>
                  <p className={styles.travelerDesc}>{t('2-11 سنة', 'Ages 2-11')}</p>
                </div>
              </div>
              <div className={styles.counter}>
                <button
                  className={styles.counterBtn}
                  onClick={() => updateCount("children", false)}
                  disabled={travelers.children <= 0}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <span className={styles.counterValue}>
                  {travelers.children}
                </span>
                <button
                  className={styles.counterBtn}
                  onClick={() => updateCount("children", true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.divider}></div>

            {/* Infants */}
            <div className={styles.travelerItem}>
              <div className={styles.travelerInfo}>
                <div className={styles.iconWrapper}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12h.01"/>
                    <path d="M15 12h.01"/>
                    <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/>
                    <path d="M22 17.28c-.6-.37-1.8-.88-3-1.22-1.2-.34-2.7-.46-4-.46s-2.8.12-4 .46c-1.2.34-2.4.85-3 1.22"/>
                    <path d="M2 10.4C2 6.15 5.03 3 9 3h6c3.97 0 7 3.15 7 7.4v2.09c0 .26-.04.52-.11.77l-.66 1.99a3 3 0 0 1-2.84 2.05h-8.78a3 3 0 0 1-2.84-2.05l-.66-1.99A2.42 2.42 0 0 1 2 12.49V10.4z"/>
                  </svg>
                </div>
                <div className={styles.travelerDetails}>
                  <h4 className={styles.travelerTitle}>{t('رضّع', 'Infants')}</h4>
                  <p className={styles.travelerDesc}>{t('أقل من سنتين', 'Under 2')}</p>
                </div>
              </div>
              <div className={styles.counter}>
                <button
                  className={styles.counterBtn}
                  onClick={() => updateCount("infants", false)}
                  disabled={travelers.infants <= 0}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <span className={styles.counterValue}>
                  {travelers.infants}
                </span>
                <button
                  className={styles.counterBtn}
                  onClick={() => updateCount("infants", true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Total Summary */}
            <div className={styles.totalSummary}>
              <div className={styles.summaryContent}>
                <div className={styles.summaryIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <span className={styles.summaryLabel}>{t('إجمالي المسافرين', 'Total Travelers')}</span>
                <span className={styles.summaryValue}>
                  {totalTravelers} {t(totalTravelers === 1 ? 'شخص' : 'أشخاص', totalTravelers === 1 ? 'Person' : 'People')}
                </span>
              </div>
            </div>
          </div>
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
          className="button -md -dark-1 bg-accent-1 text-white px-50 py-15 rounded-12"
          onClick={handleContinue}
        >
          {t('التالي', 'Continue')}
          <i className="icon-arrow-left ml-10"></i>
        </button>
      </div>
    </div>
  );
}
