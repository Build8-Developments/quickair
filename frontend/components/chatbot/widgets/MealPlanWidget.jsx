"use client";

import styles from "./MealPlanWidget.module.css";

const MEAL_PLANS = [
  { 
    id: "bb", 
    labelAr: "إفطار فقط", 
    labelEn: "Breakfast Only",
    descAr: "وجبة إفطار يومية",
    descEn: "Daily breakfast",
    icon: "☕"
  },
  { 
    id: "hb", 
    labelAr: "نصف إقامة", 
    labelEn: "Half Board",
    descAr: "إفطار + عشاء",
    descEn: "Breakfast + Dinner",
    icon: "🍽️"
  },
  { 
    id: "fb", 
    labelAr: "إقامة كاملة", 
    labelEn: "Full Board",
    descAr: "3 وجبات يومياً",
    descEn: "3 meals daily",
    icon: "🍴"
  },
  { 
    id: "ai", 
    labelAr: "شامل كلياً", 
    labelEn: "All Inclusive",
    descAr: "وجبات + مشروبات + وجبات خفيفة",
    descEn: "Meals + Drinks + Snacks",
    icon: "🌟"
  },
];

export default function MealPlanWidget({ language = "ar", onSelect }) {
  const isArabic = language === "ar";

  const handleSelect = (plan) => {
    onSelect({
      mealPlan: {
        id: plan.id,
        label: isArabic ? plan.labelAr : plan.labelEn,
        desc: isArabic ? plan.descAr : plan.descEn,
      },
      message: isArabic ? plan.labelAr : plan.labelEn,
    });
  };

  return (
    <div className={styles.widget} dir={isArabic ? "rtl" : "ltr"}>
      <div className={styles.mealGrid}>
        {MEAL_PLANS.map((plan) => (
          <button
            key={plan.id}
            className={styles.mealCard}
            onClick={() => handleSelect(plan)}
          >
            <span className={styles.icon}>{plan.icon}</span>
            <div className={styles.content}>
              <div className={styles.label}>
                {isArabic ? plan.labelAr : plan.labelEn}
              </div>
              <div className={styles.desc}>
                {isArabic ? plan.descAr : plan.descEn}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
