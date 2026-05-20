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
    badgeAr: "الأكثر طلباً",
    badgeEn: "Most Popular",
    accent: "primary",
  },
  {
    id: "flight-hotel",
    titleAr: "طيران + فندق",
    titleEn: "Flight + Hotel",
    descAr: "تأشيرة سفر وحجوزات",
    descEn: "Flights, hotels & visa support",
    icon: "flight",
    accent: "secondary",
  },
  {
    id: "hotel-only",
    titleAr: "فندق فقط",
    titleEn: "Hotel Only",
    descAr: "تصفح أفضل الفنادق",
    descEn: "Browse our curated hotels",
    icon: "hotel",
    accent: "tertiary",
  },
];

const TripIcon = ({ type }) => {
  switch (type) {
    case "package":
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="8" width="18" height="12" rx="2" />
          <path d="M8 8V6a4 4 0 0 1 8 0v2" />
          <line x1="3" y1="14" x2="21" y2="14" />
        </svg>
      );
    case "flight":
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      );
    case "hotel":
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
    sessionStorage.setItem("selectedTripType", JSON.stringify(type));

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
      <div className={styles.aurora} aria-hidden="true">
        <span className={styles.blob1} />
        <span className={styles.blob2} />
        <span className={styles.blob3} />
      </div>

      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            {t("خطط رحلتك", "Plan your trip")}
          </span>
          <h2 className={styles.title}>
            {t("ابدأ رحلتك الآن", "Start Your Journey")}
          </h2>
          <p className={styles.subtitle}>
            {t(
              "اختر نوع الرحلة وخلينا نساعدك تخطط لها بكل سهولة",
              "Choose your trip type and let us tailor every detail for you"
            )}
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {TRIP_TYPES.map((type, index) => (
            <button
              key={type.id}
              type="button"
              className={`${styles.card} ${styles[`accent_${type.accent}`]}`}
              onClick={() => handleSelect(type)}
              style={{ "--card-delay": `${index * 80}ms` }}
            >
              <span className={styles.cardGlow} aria-hidden="true" />
              <span className={styles.cardBorder} aria-hidden="true" />

              {(type.badgeAr || type.badgeEn) && (
                <span className={styles.badge}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {t(type.badgeAr, type.badgeEn)}
                </span>
              )}

              <div className={styles.cardIconWrap}>
                <span className={styles.cardIconHalo} aria-hidden="true" />
                <div className={styles.cardIcon}>
                  <TripIcon type={type.icon} />
                </div>
              </div>

              <h3 className={styles.cardTitle}>
                {t(type.titleAr, type.titleEn)}
              </h3>
              <p className={styles.cardDesc}>{t(type.descAr, type.descEn)}</p>

              <span className={styles.cardCta}>
                <span>{t("ابدأ الآن", "Get started")}</span>
                <span className={styles.cardArrow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={isRTL ? "M19 12H5 M12 19l-7-7 7-7" : "M5 12h14 M12 5l7 7-7 7"} />
                  </svg>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
