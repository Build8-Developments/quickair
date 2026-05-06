"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./ChatbotWidget.module.css";

export default function ChatbotWidget() {
  const [activeStep, setActiveStep] = useState(1);
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  const scrollToChatbot = () => {
    window.dispatchEvent(new CustomEvent("quickair-open-agent"));
    const chatButton = document.querySelector('[data-chatbot-trigger="quickair-agent"]') ||
                       document.querySelector('[aria-label*="AI"]') ||
                       document.querySelector('[aria-label*="وكيل"]') ||
                       document.querySelector('[aria-label*="مساعد"]') ||
                       document.querySelector('[aria-label*="ذكي"]');
    if (chatButton) {
      chatButton.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const steps = [
    {
      id: 1,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      title: t("اكتب طلب الرحلة", "Share your trip brief"),
      description: t("قلّي الوجهة والمدة والميزانية", "Tell me destination, duration and budget"),
    },
    {
      id: 2,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      ),
      title: t("تحليل المتاح", "Analyze options"),
      description: t("أراجع العروض والفنادق الحقيقية", "I review real offers and hotels"),
    },
    {
      id: 3,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      title: t("مقارنة ذكية", "Smart comparison"),
      description: t("أقارن السعر والموقع والمستوى", "Compare price, location and rating"),
    },
    {
      id: 4,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      title: t("خطة جاهزة", "Ready plan"),
      description: t("استلم أفضل اختيار وخطوة الحجز", "Get the best option and next step"),
    },
  ];

  return (
    <section className={styles.chatbotSection} dir={isArabic ? "rtl" : "ltr"}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-60">
          <div className={styles.headerIconWrapper}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <circle cx="9" cy="10" r="1"></circle>
              <circle cx="12" cy="10" r="1"></circle>
              <circle cx="15" cy="10" r="1"></circle>
            </svg>
          </div>
          <h2 className={styles.pageTitle}>
            {t("وكيل سفرك الذكي", "Your AI Travel Agent")}
          </h2>
          <p className={styles.pageSubtitle}>
            {t(
              "اكتب طلبك مرة واحدة، وQuick يراجع العروض والفنادق ويجهز لك اختيارات مناسبة من بيانات QuickAir الحقيقية",
              "Share your trip brief once, and Quick reviews real QuickAir offers and hotels to prepare suitable options"
            )}
          </p>
        </div>

        {/* Steps Flow */}
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={step.id} className={styles.stepWrapper}>
              <div
                className={`${styles.stepCard} ${
                  activeStep >= step.id ? styles.active : ""
                }`}
                onMouseEnter={() => setActiveStep(step.id)}
              >
                <div className={styles.stepNumber}>{step.id}</div>
                <div className={styles.stepIconWrapper}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={styles.stepConnector}>
                  <svg width="50" height="24" viewBox="0 0 50 24" fill="none">
                    <path
                      d="M2 12 L40 12"
                      stroke="#019fb1"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className={activeStep > step.id ? styles.activeConnector : ""}
                    />
                    <path
                      d="M35 6 L44 12 L35 18"
                      stroke="#019fb1"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      className={activeStep > step.id ? styles.activeConnector : ""}
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Preview & CTA */}
        <div className="row align-items-center mt-80">
          <div className="col-lg-6">
            <div className={styles.previewCard}>
              <div className={styles.chatHeader}>
                <div className={styles.chatLogo}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <div className={styles.chatHeaderText}>
                  <h4>{t("وكيل QuickAir", "QuickAir Agent")}</h4>
                  <p>
                    <span className={styles.onlineDot}></span>
                    {t("يبحث ويقارن", "Searching & comparing")}
                  </p>
                </div>
              </div>

              <div className={styles.chatMessages}>
                <div className={styles.messageBot}>
                  <div className={styles.messageAvatar}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <div className={styles.messageBubble}>
                    {t("أنا Quick، وكيل سفرك. قلّي عايز تسافر فين وميزانيتك كام؟", "I'm Quick, your travel agent. Where do you want to go and what's your budget?")}
                  </div>
                </div>

                <div className={styles.messageUser}>
                  <div className={styles.messageBubble}>
                    {t("عايز شرم 5 أيام بميزانية متوسطة", "I want Sharm for 5 days with a mid-range budget")}
                  </div>
                </div>

                <div className={styles.messageBot}>
                  <div className={styles.messageAvatar}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <div className={styles.messageBubble}>
                    {t(
                      "تمام، بفهم طلبك وبراجع المتاح:\n✓ شرم الشيخ\n✓ 5 أيام\n✓ ميزانية متوسطة\n\nهعرضلك أفضل فنادق وعروض مناسبة.",
                      "Great, I'm reviewing your brief:\n✓ Sharm El Sheikh\n✓ 5 days\n✓ Mid-range budget\n\nI'll show the best suitable hotels and offers."
                    )}
                  </div>
                </div>

                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className={styles.ctaContent}>
              <div className={styles.badge}>
                <span className={styles.badgeIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="8.5" cy="16" r="1.5" fill="currentColor" />
                    <circle cx="15.5" cy="16" r="1.5" fill="currentColor" />
                    <path d="M12 2v4M8 4l4 2 4-2" />
                  </svg>
                </span>
                <span className={styles.badgeText}>
                  {t("وكيل سفر مدعوم بالذكاء الاصطناعي", "AI-Powered Travel Agent")}
                </span>
              </div>

              <h3 className={styles.ctaTitle}>
                {t("جاهز تخلي Quick يجهز رحلتك؟", "Ready for Quick to plan your trip?")}
              </h3>

              <p className={styles.ctaDescription}>
                {t(
                  "بدل ما تدور في صفحات كتير، اكتب طلبك وQuick يختصر لك الاختيارات حسب الوجهة والمدة والميزانية.",
                  "Instead of browsing multiple pages, share your brief and Quick narrows options by destination, duration and budget."
                )}
              </p>

              <div className={styles.features}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <div>
                    <strong>{t("تحليل سريع", "Fast Analysis")}</strong>
                    <p>{t("يفهم طلب الرحلة ويحدد المطلوب", "Understands your trip brief and intent")}</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" fill="#019fb1" />
                      <line x1="12" y1="2" x2="12" y2="6" />
                      <line x1="12" y1="18" x2="12" y2="22" />
                      <line x1="2" y1="12" x2="6" y2="12" />
                      <line x1="18" y1="12" x2="22" y2="12" />
                    </svg>
                  </div>
                  <div>
                    <strong>{t("مقارنة حقيقية", "Real Comparison")}</strong>
                    <p>{t("يعتمد على عروض وفنادق QuickAir", "Uses QuickAir offers and hotels")}</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div>
                    <strong>{t("خطوة حجز واضحة", "Clear Booking Step")}</strong>
                    <p>{t("يوجهك لأفضل اختيار أو طلب الحجز", "Guides you to the best option or request")}</p>
                  </div>
                </div>
              </div>

              <button onClick={scrollToChatbot} className={styles.ctaButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{t("ابدأ مع الوكيل", "Start with Agent")}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
