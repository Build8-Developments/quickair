"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./page.module.css";

export default function TripConfirmation() {
  const router = useRouter();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const t = (ar, en) => (isRTL ? ar : en);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.push(`/${language}`);
    }
  }, [countdown, router, language]);

  const steps = [
    { ar: "سيراجع فريقنا طلبك", en: "Our team will review your request" },
    { ar: "سنتواصل معك خلال 24 ساعة", en: "We'll contact you within 24 hours" },
    { ar: "ستحصل على عروض مخصصة", en: "You'll receive personalized offers" },
  ];

  return (
    <div className={styles.page} dir={isRTL ? "rtl" : "ltr"}>
      <div className={styles.card}>
        {/* Success Icon */}
        <div className={styles.iconWrapper}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Title */}
        <h1 className={styles.title}>
          {t("تم إرسال طلبك بنجاح!", "Request Sent Successfully!")}
        </h1>
        <p className={styles.subtitle}>
          {t("شكراً لثقتك في كويك إير", "Thank you for choosing QuickAir")}
        </p>

        {/* Email Notice */}
        <div className={styles.emailBox}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <div>
            <strong>{t("تحقق من بريدك", "Check Your Email")}</strong>
            <span>{t("أرسلنا تأكيد بتفاصيل طلبك", "We sent a confirmation with your details")}</span>
          </div>
        </div>

        {/* Steps */}
        <div className={styles.stepsBox}>
          <h3 className={styles.stepsTitle}>{t("الخطوات التالية", "What's Next")}</h3>
          <ul className={styles.stepsList}>
            {steps.map((step, i) => (
              <li key={i} className={styles.stepItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{t(step.ar, step.en)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Countdown */}
        <div className={styles.countdown}>
          {t(`العودة للرئيسية خلال ${countdown} ثواني`, `Redirecting in ${countdown}s`)}
        </div>

        {/* Button */}
        <button className={styles.button} onClick={() => router.push(`/${language}`)}>
          {t("العودة للرئيسية", "Go to Homepage")}
        </button>
      </div>
    </div>
  );
}
