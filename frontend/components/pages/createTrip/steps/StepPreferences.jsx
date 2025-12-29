"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepPreferences.module.css";

const ACTIVITIES = [
  { id: "beach", labelAr: "شاطئ واسترخاء", labelEn: "Beach & Relaxation", icon: "sun" },
  { id: "diving", labelAr: "غوص وسنوركل", labelEn: "Diving & Snorkeling", icon: "diving" },
  { id: "waterpark", labelAr: "مدن مائية", labelEn: "Water Parks", icon: "waves" },
  { id: "spa", labelAr: "سبا وعافية", labelEn: "Spa & Wellness", icon: "spa" },
  { id: "sightseeing", labelAr: "مشاهدة معالم", labelEn: "Sightseeing", icon: "eye" },
  { id: "shopping", labelAr: "تسوق", labelEn: "Shopping", icon: "bag" },
];

const MEAL_PLANS = [
  { id: "breakfast", labelAr: "إفطار فقط", labelEn: "Breakfast Only", descAr: "ابدأ يومك بشكل صحيح", descEn: "Start your day right" },
  { id: "half-board", labelAr: "نصف إقامة", labelEn: "Half Board", descAr: "إفطار + عشاء", descEn: "Breakfast + Dinner" },
  { id: "all-inclusive", labelAr: "شامل كل شيء", labelEn: "All Inclusive", descAr: "وجبات + مشروبات", descEn: "Meals + Drinks + Snacks" },
];

const ActivityIcon = ({ type }) => {
  switch (type) {
    case "sun":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      );
    case "diving":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2a2 2 0 0 1 2-2h2" />
          <path d="M12 2v4" />
          <path d="M12 18v4" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    case "waves":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        </svg>
      );
    case "spa":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22c-4.97 0-9-2.24-9-5v-1c0-2.76 4.03-5 9-5s9 2.24 9 5v1c0 2.76-4.03 5-9 5z" />
          <path d="M12 11V2" />
          <path d="M8 6l4-4 4 4" />
        </svg>
      );
    case "eye":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "bag":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
    default:
      return null;
  }
};

export default function StepPreferences({ data, onUpdate, onNext, onPrev }) {
  const [preferences, setPreferences] = useState(data || { activities: [], mealPlan: null, specialRequests: "" });
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const t = (ar, en) => (isRTL ? ar : en);

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

  return (
    <div className="step-content" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{t("ما هي تفضيلاتك؟", "What are your preferences?")}</h2>
        <p className={styles.subtitle}>{t("اختر الأنشطة والوجبات المفضلة", "Choose your favorite activities and meals")}</p>
      </div>

      <div className={styles.container}>
        {/* Activities */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>{t("الأنشطة", "Activities")}</label>
          <div className={styles.activitiesGrid}>
            {ACTIVITIES.map((activity) => {
              const isSelected = preferences.activities.includes(activity.id);
              return (
                <div
                  key={activity.id}
                  className={`${styles.activityCard} ${isSelected ? styles.activityActive : ""}`}
                  onClick={() => toggleActivity(activity.id)}
                >
                  <div className={styles.activityIcon}>
                    <ActivityIcon type={activity.icon} />
                  </div>
                  <span className={styles.activityLabel}>{t(activity.labelAr, activity.labelEn)}</span>
                  {isSelected && (
                    <div className={styles.checkMark}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Meal Plans */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>{t("خطة الوجبات", "Meal Plan")}</label>
          <div className={styles.mealsGrid}>
            {MEAL_PLANS.map((plan) => {
              const isSelected = preferences.mealPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`${styles.mealCard} ${isSelected ? styles.mealActive : ""}`}
                  onClick={() => selectMealPlan(plan.id)}
                >
                  <div className={styles.mealContent}>
                    <span className={styles.mealLabel}>{t(plan.labelAr, plan.labelEn)}</span>
                    <span className={styles.mealDesc}>{t(plan.descAr, plan.descEn)}</span>
                  </div>
                  {isSelected && (
                    <div className={styles.mealCheck}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Special Requests */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>{t("طلبات خاصة", "Special Requests")}</label>
          <textarea
            className={styles.textarea}
            placeholder={t("مثال: وجبات نباتية، غرف للمعاقين، شهر عسل...", "e.g., Vegetarian meals, accessible rooms, honeymoon...")}
            value={preferences.specialRequests}
            onChange={(e) => handleSpecialRequests(e.target.value)}
            rows="3"
          />
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
        <button className={styles.continueButton} onClick={onNext}>
          {t("متابعة", "Continue")}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isRTL ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
          </svg>
        </button>
      </div>
    </div>
  );
}
