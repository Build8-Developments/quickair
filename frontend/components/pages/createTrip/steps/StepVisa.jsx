"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepVisa.module.css";

export default function StepVisa({ data, destination, onUpdate, onNext, onPrev }) {
  const [hasVisa, setHasVisa] = useState(data?.hasVisa ?? null);
  const { language, t } = useLanguage();

  const handleVisaChoice = (choice) => {
    setHasVisa(choice);
    const visaData = { 
      hasVisa: choice,
      needsHelp: !choice 
    };
    onUpdate(visaData);
  };

  const handleContinue = () => {
    if (hasVisa !== null) {
      onNext();
    }
  };

  return (
    <div className="step-content">
      <div className="text-center mb-50">
        <h2 className="text-32 fw-700 text-dark-1 mb-12">
          {t('متطلبات التأشيرة', 'Visa Requirements')}
        </h2>
        <p className="text-17 text-dark-2">
          {t(`${destination?.name} - معلومات التأشيرة`, `${destination?.name} - Visa Information`)}
        </p>
      </div>

      <div className="row justify-center">
        <div className="col-xl-8 col-lg-10">
          {/* Visa Required Notice */}
          {destination?.requiresVisa && (
            <div className={`${styles.visaNotice} mb-40`}>
              <div className={styles.noticeContent}>
                <div className={styles.noticeIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                    <rect x="9" y="3" width="6" height="4" rx="1"/>
                    <path d="M9 12h6"/>
                    <path d="M9 16h6"/>
                  </svg>
                </div>
                <div className={styles.noticeInfo}>
                  <h3 className={styles.noticeTitle}>
                    {t('تأشيرة مطلوبة', 'Visa Required')}
                  </h3>
                  <p className={styles.noticeDesc}>
                    {t('يجب الحصول على التأشيرة قبل السفر', 'You must obtain a visa before traveling')}
                  </p>
                  {destination?.visaCost && (
                    <p className={styles.visaCost}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
                        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/>
                      </svg>
                      ${destination.visaCost} {t('(رسوم التأشيرة)', '(Visa Fee)')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Question */}
          <div className={`${styles.visaQuestion} mb-40`}>
            <h4 className={styles.questionLabel}>
              {t('هل معك تأشيرة؟', 'Do you already have a visa?')}
            </h4>
            <div className="row x-gap-20 y-gap-20">
              <div className="col-md-6">
                <div
                  className={`${styles.visaOption} ${hasVisa === true ? styles.visaOptionSelected : ''}`}
                  onClick={() => handleVisaChoice(true)}
                >
                  <div className={styles.optionIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <h5 className={styles.optionTitle}>
                    {t('نعم، معي', 'Yes, I have it')}
                  </h5>
                  <p className={styles.optionDesc}>
                    {t('لدي تأشيرة صالحة', 'I have a valid visa')}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  className={`${styles.visaOption} ${styles.visaOptionNeedHelp} ${
                    hasVisa === false ? `${styles.visaOptionSelected} ${styles.visaOptionNeedHelpSelected}` : ''
                  }`}
                  onClick={() => handleVisaChoice(false)}
                >
                  <div className={styles.optionIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <h5 className={styles.optionTitle}>
                    {t('لا، أحتاج مساعدة', 'No, I need help')}
                  </h5>
                  <p className={styles.optionDesc}>
                    {t('تواصل معنا للمساعدة', 'Contact us for assistance')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info for Help */}
          {hasVisa === false && (
            <div className={styles.contactInfo}>
              <div className={styles.contactContent}>
                <div className={styles.contactIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div className={styles.contactText}>
                  <h4 className={styles.contactTitle}>
                    {t('سنساعدك!', 'We\'ll help you!')}
                  </h4>
                  <p className={styles.contactDesc}>
                    {t('فريقنا سيتواصل معك لمساعدتك في استخراج التأشيرة', 'Our team will contact you to help with your visa application')}
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
            hasVisa === null ? 'opacity-50' : ''
          } ${styles.continueButton}`}
          onClick={handleContinue}
          disabled={hasVisa === null}
        >
          {t('متابعة', 'Continue')}
          <i className="icon-arrow-left ml-10"></i>
        </button>
      </div>
    </div>
  );
}
