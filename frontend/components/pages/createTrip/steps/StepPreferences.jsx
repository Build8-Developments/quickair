"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepPreferences.module.css";

const ACTIVITY_OPTIONS = [
  { id: "beach", label: "شاطئ واسترخاء", labelEn: "Beach & Relaxation" },
  { id: "diving", label: "غوص وسنوركل", labelEn: "Diving & Snorkeling" },
  { id: "waterpark", label: "مدن مائية", labelEn: "Water Parks" },
  { id: "spa", label: "سبا وعافية", labelEn: "Spa & Wellness" },
  { id: "sightseeing", label: "مشاهدة معالم", labelEn: "Sightseeing" },
  { id: "shopping", label: "تسوق", labelEn: "Shopping" },
];

const MEAL_PLANS = [
  { id: "breakfast", label: "إفطار فقط", labelEn: "Breakfast Only", description: "ابدأ يومك بشكل صحيح", descriptionEn: "Start your day right" },
  { id: "half-board", label: "نصف إقامة", labelEn: "Half Board", description: "إفطار + عشاء", descriptionEn: "Breakfast + Dinner" },
  { id: "all-inclusive", label: "شامل كل شيء", labelEn: "All Inclusive", description: "وجبات + مشروبات + وجبات خفيفة", descriptionEn: "Meals + Drinks + Snacks" },
];

export default function StepPreferences({ data, onUpdate, onNext, onPrev }) {
  const [preferences, setPreferences] = useState(data);
  const { language, t } = useLanguage();

  const toggleActivity = (id) => {
    const activities = preferences.activities.includes(id)
      ? preferences.activities.filter((item) => item !== id)
      : [...preferences.activities, id];
    
    const newPreferences = { ...preferences, activities };
    setPreferences(newPreferences);
    onUpdate(newPreferences);
  };

  const selectMealPlan = (id) => {
    const newPreferences = { ...preferences, mealPlan: id };
    setPreferences(newPreferences);
    onUpdate(newPreferences);
  };

  const handleSpecialRequests = (value) => {
    const newPreferences = { ...preferences, specialRequests: value };
    setPreferences(newPreferences);
    onUpdate(newPreferences);
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="step-content">
      <div className="text-center mb-50">
        <h2 className="text-32 fw-700 text-dark-1 mb-12">
          {t('ما هي تفضيلاتك؟', 'What are your preferences?')}
        </h2>
        <p className="text-17 text-dark-2">
          {t('اختر تفضيلاتك لنتمكن من تخصيص كل شيء', 'Choose your preferences to personalize everything')}
        </p>
      </div>

      <div className="row justify-center">
        <div className="col-xl-9 col-lg-10">
          {/* Activity Preferences */}
          <div className={`${styles.preferenceSection} mb-40`}>
            <h3 className={styles.sectionTitle}>
              {t('ماذا تريد أن تفعل؟', 'What do you want to do?')}
            </h3>
            <p className={styles.sectionDesc}>
              {t('اختر الأنشطة التي تهمك', 'Choose activities that interest you')}
            </p>
            <div className="row x-gap-20 y-gap-20">
              {ACTIVITY_OPTIONS.map((option) => (
                <div key={option.id} className="col-lg-4 col-md-6">
                  <div
                    className={`${styles.activityCard} ${
                      preferences.activities.includes(option.id)
                        ? styles.activityCardSelected
                        : ""
                    }`}
                    onClick={() => toggleActivity(option.id)}
                  >
                    <div className={styles.activityIcon}>
                      {option.id === 'beach' && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="5"/>
                          <line x1="12" y1="1" x2="12" y2="3"/>
                          <line x1="12" y1="21" x2="12" y2="23"/>
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                          <line x1="1" y1="12" x2="3" y2="12"/>
                          <line x1="21" y1="12" x2="23" y2="12"/>
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                      )}
                      {option.id === 'diving' && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6z"/>
                          <path d="M18 12v.5"/>
                          <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/>
                          <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/>
                        </svg>
                      )}
                      {option.id === 'waterpark' && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M3 16.5c0 0 2-3 4.5-3S10 16 12.5 16 16 13 18.5 13s4.5 3.5 4.5 3.5"/>
                          <path d="M3 12c0 0 2-3 4.5-3S10 11.5 12.5 11.5 16 8.5 18.5 8.5 23 12 23 12"/>
                          <path d="M3 7.5c0 0 2-3 4.5-3S10 7 12.5 7 16 4 18.5 4s4.5 3.5 4.5 3.5"/>
                        </svg>
                      )}
                      {option.id === 'spa' && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M9 2v17.5A2.5 2.5 0 0 0 11.5 22v0A2.5 2.5 0 0 0 14 19.5V2"/>
                          <path d="M14 2v7.527a2 2 0 0 0 1.447 1.923l.053.015a2 2 0 0 1 1.5 1.933V19.5a2.5 2.5 0 0 1-2.5 2.5h-3"/>
                          <circle cx="12" cy="13" r="2"/>
                        </svg>
                      )}
                      {option.id === 'sightseeing' && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                      {option.id === 'shopping' && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                          <line x1="3" y1="6" x2="21" y2="6"/>
                          <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                      )}
                    </div>
                    <h5 className={styles.activityTitle}>
                      {t(option.label, option.labelEn)}
                    </h5>
                    <p className={styles.activitySubtitle}>
                      {language === 'ar' ? option.labelEn : option.label}
                    </p>
                    {preferences.activities.includes(option.id) && (
                      <div className={styles.checkBadge}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Plan */}
          <div className={`${styles.preferenceSection} mb-40`}>
            <h3 className={styles.sectionTitle}>
              {t('تفضيلات الوجبات', 'Meal Preferences')}
            </h3>
            <div className="row x-gap-20 y-gap-20">
              {MEAL_PLANS.map((plan) => (
                <div key={plan.id} className="col-lg-4 col-md-6">
                  <div
                    className={`${styles.mealCard} ${
                      preferences.mealPlan === plan.id ? styles.mealCardSelected : ""
                    }`}
                    onClick={() => selectMealPlan(plan.id)}
                  >
                    <div className={styles.mealContent}>
                      <h5 className={styles.mealTitle}>
                        {t(plan.label, plan.labelEn)}
                      </h5>
                      <p className={styles.mealDesc}>
                        {t(plan.description, plan.descriptionEn)}
                      </p>
                    </div>
                    {preferences.mealPlan === plan.id && (
                      <div className={styles.checkIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div className={styles.preferenceSection}>
            <h3 className={styles.sectionTitle}>
              {t('طلبات خاصة أو متطلبات', 'Special Requests or Requirements')}
            </h3>
            <p className={styles.sectionDesc}>
              {t('أخبرنا عن أي احتياجات غذائية أو متطلبات خاصة أو مناسبات', 'Tell us about any dietary needs, special requirements, or occasions')}
            </p>
            <textarea
              className={styles.specialRequestsInput}
              placeholder={t('مثال: وجبات نباتية، غرف للمعاقين، باقة شهر عسل، إلخ.', 'e.g., Vegetarian meals, accessible rooms, honeymoon package, etc.')}
              value={preferences.specialRequests}
              onChange={(e) => handleSpecialRequests(e.target.value)}
              rows="5"
            />
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
          {t('متابعة', 'Continue')}
          <i className="icon-arrow-left ml-10"></i>
        </button>
      </div>

    </div>
  );
}
