"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./ChatbotWidget.module.css";

export default function ChatbotWidget() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  const scrollToChatbot = () => {
    // Open chatbot by clicking the floating button
    const chatButton = document.querySelector('[aria-label*="AI"]');
    if (chatButton) {
      chatButton.click();
    }
  };

  const features = [
    {
      icon: "🎯",
      title: t("مساعد ذكي متاح 24/7", "AI Assistant Available 24/7"),
      description: t(
        "احصل على إجابات فورية على جميع استفساراتك السياحية",
        "Get instant answers to all your travel questions"
      ),
    },
    {
      icon: "🏝️",
      title: t("توصيات شخصية", "Personalized Recommendations"),
      description: t(
        "اكتشف أفضل الوجهات والعروض المناسبة لميزانيتك",
        "Discover the best destinations and offers for your budget"
      ),
    },
    {
      icon: "⚡",
      title: t("حجز سريع وسهل", "Quick & Easy Booking"),
      description: t(
        "احجز رحلتك القادمة في دقائق مع مساعدنا الذكي",
        "Book your next trip in minutes with our AI assistant"
      ),
    },
  ];

  return (
    <section className={styles.chatbotSection}>
      <div className="container">
        <div className={styles.chatbotWidget}>
          <div className="row align-items-center">
            {/* Content Side */}
            <div className="col-lg-6">
              <div className={styles.content}>
                <div className={styles.badge}>
                  <span className={styles.badgeIcon}>🤖</span>
                  <span className={styles.badgeText}>
                    {t("تقنية الذكاء الاصطناعي", "AI Technology")}
                  </span>
                </div>
                
                <h2 className={styles.title}>
                  {t(
                    "اسأل مساعدنا الذكي عن أي شيء",
                    "Ask Our AI Assistant Anything"
                  )}
                </h2>
                
                <p className={styles.description}>
                  {t(
                    "مساعد QuickAir الذكي جاهز لمساعدتك في التخطيط لرحلتك القادمة. احصل على توصيات مخصصة، معلومات عن الوجهات، أفضل العروض، والمزيد!",
                    "QuickAir AI Assistant is ready to help you plan your next trip. Get personalized recommendations, destination information, best deals, and more!"
                  )}
                </p>

                <div className={styles.features}>
                  {features.map((feature, index) => (
                    <div key={index} className={styles.featureItem}>
                      <div className={styles.featureIcon}>{feature.icon}</div>
                      <div className={styles.featureContent}>
                        <h4 className={styles.featureTitle}>{feature.title}</h4>
                        <p className={styles.featureDescription}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={scrollToChatbot}
                  className={styles.ctaButton}
                >
                  <span className={styles.buttonIcon}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </span>
                  <span className={styles.buttonText}>
                    {t("ابدأ المحادثة الآن", "Start Chatting Now")}
                  </span>
                  <svg
                    className={styles.buttonArrow}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            {/* Visual Side */}
            <div className="col-lg-6">
              <div className={styles.visual}>
                <div className={styles.visualCard}>
                  <div className={styles.chatPreview}>
                    <div className={styles.chatHeader}>
                      <div className={styles.chatLogo}>
                        <img
                          src="/img/general/logo-light.svg"
                          alt="QuickAir"
                        />
                      </div>
                      <div className={styles.chatHeaderText}>
                        <h4>{t("مساعد QuickAir", "QuickAir Assistant")}</h4>
                        <p>
                          <span className={styles.onlineDot}></span>
                          {t("متصل الآن", "Online now")}
                        </p>
                      </div>
                    </div>

                    <div className={styles.chatMessages}>
                      <div className={styles.messageBot}>
                        <div className={styles.messageAvatar}>
                          <img
                            src="/img/general/logo-light.svg"
                            alt="AI"
                          />
                        </div>
                        <div className={styles.messageBubble}>
                          {t(
                            "مرحباً! كيف يمكنني مساعدتك اليوم؟ 👋",
                            "Hello! How can I help you today? 👋"
                          )}
                        </div>
                      </div>

                      <div className={styles.messageUser}>
                        <div className={styles.messageBubble}>
                          {t(
                            "أبحث عن وجهة شاطئية مميزة",
                            "Looking for a great beach destination"
                          )}
                        </div>
                      </div>

                      <div className={styles.messageBot}>
                        <div className={styles.messageAvatar}>
                          <img
                            src="/img/general/logo-light.svg"
                            alt="AI"
                          />
                        </div>
                        <div className={styles.messageBubble}>
                          {t(
                            "رائع! لدينا عروض مميزة على جزر المالديف وبالي 🏝️",
                            "Great! We have amazing deals on Maldives and Bali 🏝️"
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>

                {/* Floating Stats */}
                <div className={styles.statCard1}>
                  <div className={styles.statIcon}>⚡</div>
                  <div className={styles.statContent}>
                    <div className={styles.statValue}>
                      {t("استجابة فورية", "Instant Response")}
                    </div>
                    <div className={styles.statLabel}>
                      {t("متوسط الرد < 1 ثانية", "Avg Reply < 1 sec")}
                    </div>
                  </div>
                </div>

                <div className={styles.statCard2}>
                  <div className={styles.statIcon}>🎯</div>
                  <div className={styles.statContent}>
                    <div className={styles.statValue}>98%</div>
                    <div className={styles.statLabel}>
                      {t("دقة الإجابات", "Accuracy Rate")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
