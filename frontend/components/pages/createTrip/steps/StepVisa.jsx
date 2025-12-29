"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepVisa.module.css";

export default function StepVisa({ data, destination, onUpdate, onNext, onPrev }) {
  const [hasVisa, setHasVisa] = useState(data?.hasVisa ?? null);
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const t = (ar, en) => (isRTL ? ar : en);

  const handleVisaChoice = (choice) => {
    setHasVisa(choice);
    onUpdate({ hasVisa: choice, needsHelp: !choice });
  };

  const handleContinue = () => {
    if (hasVisa !== null) onNext();
  };

  return (
    <div className="step-content" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{t('متطلبات التأشيرة', 'Visa Requirements')}</h2>
        <p className={styles.subtitle}>
          {destination?.name} - {t('معلومات التأشيرة', 'Visa Information')}
        </p>
      </div>

      {/* Visa Notice */}
      {destination?.requiresVisa && (
        <div className={styles.noticeBox}>
          <div className={styles.noticeIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="M9 12h6"/>
              <path d="M9 16h6"/>
            </svg>
          </div>
          <div className={styles.noticeContent}>
            <h3 className={styles.noticeTitle}>{t('تأشيرة مطلوبة', 'Visa Required')}</h3>
            <p className={styles.noticeDesc}>{t('يجب الحصول على التأشيرة قبل السفر', 'You must obtain a visa before traveling')}</p>
          </div>
        </div>
      )}

      {/* Question */}
      <div className={styles.questionSection}>
        <h4 className={styles.questionLabel}>{t('هل معك تأشيرة؟', 'Do you already have a visa?')}</h4>
        
        <div className={styles.optionsGrid}>
          {/* Yes Option */}
          <div
            className={`${styles.optionCard} ${hasVisa === true ? styles.optionActive : ""}`}
            onClick={() => handleVisaChoice(true)}
          >
            <div className={styles.optionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h5 className={styles.optionTitle}>{t('نعم، معي', 'Yes, I have it')}</h5>
            <p className={styles.optionDesc}>{t('لدي تأشيرة صالحة', 'I have a valid visa')}</p>
            {hasVisa === true && (
              <div className={styles.checkMark}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>

          {/* No Option */}
          <div
            className={`${styles.optionCard} ${styles.optionHelp} ${hasVisa === false ? styles.optionHelpActive : ""}`}
            onClick={() => handleVisaChoice(false)}
          >
            <div className={styles.optionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h5 className={styles.optionTitle}>{t('لا، أحتاج مساعدة', 'No, I need help')}</h5>
            <p className={styles.optionDesc}>{t('تواصل معنا للمساعدة', 'Contact us for assistance')}</p>
            {hasVisa === false && (
              <div className={styles.checkMark}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Message */}
      {hasVisa === false && (
        <div className={styles.helpBox}>
          <div className={styles.helpIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <h4 className={styles.helpTitle}>{t('سنساعدك!', "We'll help you!")}</h4>
            <p className={styles.helpDesc}>{t('فريقنا سيتواصل معك لمساعدتك في استخراج التأشيرة', 'Our team will contact you to help with your visa application')}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className={styles.navigation}>
        <button className={styles.backButton} onClick={onPrev}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isRTL ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"} />
          </svg>
          {t('رجوع', 'Back')}
        </button>
        <button
          className={`${styles.continueButton} ${hasVisa === null ? styles.disabled : ""}`}
          onClick={handleContinue}
          disabled={hasVisa === null}
        >
          {t('متابعة', 'Continue')}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isRTL ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
          </svg>
        </button>
      </div>
    </div>
  );
}
