"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepTravelers.module.css";

export default function StepTravelers({ data, onUpdate, onNext, onPrev }) {
  const [travelers, setTravelers] = useState(data);
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const t = (ar, en) => (isRTL ? ar : en);

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
    if (travelers.adults > 0) onNext();
  };

  const totalTravelers = travelers.adults + travelers.children + travelers.infants;

  const travelerTypes = [
    {
      key: "adults",
      titleAr: "بالغين",
      titleEn: "Adults",
      descAr: "+12 سنة",
      descEn: "Ages 12+",
      min: 1,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
    {
      key: "children",
      titleAr: "أطفال",
      titleEn: "Children",
      descAr: "2-11 سنة",
      descEn: "Ages 2-11",
      min: 0,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="3"/>
          <path d="M12 11v6"/>
          <path d="M9 18h6"/>
        </svg>
      )
    },
    {
      key: "infants",
      titleAr: "رضّع",
      titleEn: "Infants",
      descAr: "أقل من سنتين",
      descEn: "Under 2",
      min: 0,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="10" r="6"/>
          <path d="M9 10h.01"/>
          <path d="M15 10h.01"/>
          <path d="M10 13a2 2 0 0 0 4 0"/>
        </svg>
      )
    }
  ];

  return (
    <div className="step-content" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{t('مين مسافر معاك؟', "Who's coming along?")}</h2>
        <p className={styles.subtitle}>{t('عرّفنا على عدد المسافرين', 'Let us know how many people are traveling')}</p>
      </div>

      {/* Travelers Box */}
      <div className={styles.travelersBox}>
        {travelerTypes.map((type, index) => (
          <div key={type.key}>
            <div className={styles.travelerRow}>
              <div className={styles.travelerInfo}>
                <div className={styles.iconWrapper}>{type.icon}</div>
                <div>
                  <h4 className={styles.travelerTitle}>{t(type.titleAr, type.titleEn)}</h4>
                  <p className={styles.travelerDesc}>{t(type.descAr, type.descEn)}</p>
                </div>
              </div>
              <div className={styles.counter}>
                <button
                  className={styles.counterBtn}
                  onClick={() => updateCount(type.key, false)}
                  disabled={travelers[type.key] <= type.min}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <span className={styles.counterValue}>{travelers[type.key]}</span>
                <button
                  className={styles.counterBtn}
                  onClick={() => updateCount(type.key, true)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>
            {index < travelerTypes.length - 1 && <div className={styles.divider} />}
          </div>
        ))}

        {/* Total */}
        <div className={styles.totalRow}>
          <div className={styles.totalIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <span className={styles.totalLabel}>{t('إجمالي المسافرين', 'Total Travelers')}</span>
          <span className={styles.totalValue}>
            {totalTravelers} {t('شخص', 'People')}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button className={styles.backButton} onClick={onPrev}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isRTL ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"} />
          </svg>
          {t('رجوع', 'Back')}
        </button>
        <button className={styles.continueButton} onClick={handleContinue}>
          {t('متابعة', 'Continue')}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isRTL ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
          </svg>
        </button>
      </div>
    </div>
  );
}
