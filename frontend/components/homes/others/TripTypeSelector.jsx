"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./TripTypeSelector.module.css";

const TRIP_TYPES = [
  {
    id: "package",
    titleAr: "باقة متكاملة",
    titleEn: "Complete Package",
    descAr: "رحلة كاملة مع كل شيء",
    descEn: "Full vacation with everything included",
    icon: "package",
  },
  {
    id: "flight-hotel",
    titleAr: "طيران + فندق",
    titleEn: "Flight + Hotel",
    descAr: "تأشيرة سفر",
    descEn: "Visa assistance",
    icon: "flight",
  },
  {
    id: "hotel-only",
    titleAr: "فندق فقط",
    titleEn: "Hotel Only",
    descAr: "تصفح الفنادق",
    descEn: "Browse our hotels",
    icon: "hotel",
  },
];

const TripIcon = ({ type }) => {
  switch (type) {
    case "package":
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="8" width="18" height="12" rx="2" />
          <path d="M8 8V6a4 4 0 0 1 8 0v2" />
          <line x1="3" y1="14" x2="21" y2="14" />
        </svg>
      );
    case "flight":
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      );
    case "hotel":
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
          <path d="M1 21h22" />
          <path d="M9 7h1" />
          <path d="M9 11h1" />
          <path d="M9 15h1" />
          <path d="M14 7h1" />
          <path d="M14 11h1" />
          <path d="M14 15h1" />
        </svg>
      );
    default:
      return null;
  }
};

export default function TripTypeSelector({ locale }) {
  const router = useRouter();
  const { language } = useLanguage();
  const isRTL = language === "ar" || locale === "ar";
  const t = (ar, en) => (isRTL ? ar : en);

  const handleSelect = (type) => {
    // حفظ الاختيار في sessionStorage
    sessionStorage.setItem("selectedTripType", JSON.stringify(type));
    
    // التوجيه حسب نوع الرحلة
    if (type.id === "hotel-only") {
      router.push(`/${locale || language}/hotels`);
    } else if (type.id === "flight-hotel") {
      router.push(`/${locale || language}/contact`);
    } else {
      router.push(`/${locale || language}/create-trip?type=${type.id}`);
    }
  };

  return (
    <section className={styles.section} dir={isRTL ? "rtl" : "ltr"}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>
            {t("ابدأ رحلتك الآن", "Start Your Journey")}
          </h2>
          <p className={styles.subtitle}>
            {t("اختر نوع الرحلة وخلينا نساعدك تخطط لها", "Choose your trip type and let us help you plan")}
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {TRIP_TYPES.map((type) => (
            <div
              key={type.id}
              className={styles.card}
              onClick={() => handleSelect(type)}
            >
              <div className={styles.cardIcon}>
                <TripIcon type={type.icon} />
              </div>
              <h3 className={styles.cardTitle}>{t(type.titleAr, type.titleEn)}</h3>
              <p className={styles.cardDesc}>{t(type.descAr, type.descEn)}</p>
              <div className={styles.cardArrow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={isRTL ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
