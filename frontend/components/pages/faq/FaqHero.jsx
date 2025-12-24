"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function FaqHero() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <section className="pageHeader -type-3">
      <div className="pageHeader__bg">
        <div className="bg-image js-lazy"></div>
      </div>

      <div className="container">
        <div className="row justify-center">
          <div className="col-12">
            <div
              className="pageHeader__content"
              style={{ textAlign: isRTL ? "right" : "left" }}
            >
              <h1 className="pageHeader__title">
                {isRTL
                  ? "الأسئلة الشائعة"
                  : "Frequently Asked Questions"}
              </h1>

              <p className="pageHeader__text">
                {isRTL
                  ? "احصل على إجابات لجميع أسئلتك حول خدماتنا، والحجوزات، والسفر، والمزيد"
                  : "Get answers to all your questions about our services, bookings, travel, and more"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
