"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const omraSteps = [
  { stepEn: "Ihram", stepAr: "الإحرام", descEn: "Enter the state of Ihram at the Miqat", descAr: "الدخول في حالة الإحرام عند الميقات" },
  { stepEn: "Tawaf", stepAr: "الطواف", descEn: "Circumambulate the Kaaba seven times", descAr: "الطواف حول الكعبة سبع مرات" },
  { stepEn: "Sa'i", stepAr: "السعي", descEn: "Walk between Safa and Marwa seven times", descAr: "السعي بين الصفا والمروة سبع مرات" },
  { stepEn: "Halq/Taqsir", stepAr: "الحلق أو التقصير", descEn: "Shave or trim the hair to complete Omra", descAr: "حلق أو تقصير الشعر لإتمام العمرة" },
];

export default function OmraPageContent({ locale }) {
  const isRTL = locale === "ar";

  return (
    <>
      {/* About Section */}
      <section className="layout-pt-lg layout-pb-lg bg-light-1">
        <div className="container">
          <div className="row y-gap-30 items-center">
            <div className="col-lg-6 order-lg-2" data-aos="fade-left">
              <div className="ratio ratio-4:3 rounded-12 overflow-hidden shadow-1">
                <Image
                  src="https://placehold.co/800x600.png"
                  alt={isRTL ? "المسجد الحرام" : "Masjid Al Haram"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="col-lg-6 order-lg-1" data-aos="fade-right">
              <div className={`${isRTL ? "text-right pl-lg-40" : "pr-lg-40"}`}>
                <span className="text-accent-1 text-15 fw-500 mb-10 d-block">
                  {isRTL ? "سنة مؤكدة" : "A Confirmed Sunnah"}
                </span>
                <h2 className="text-30 md:text-24 fw-700 text-dark-1 mb-20">
                  {isRTL ? "رحلة العمرة الروحانية" : "The Spiritual Omra Journey"}
                </h2>
                <p className="text-15 text-light-2 mb-20 lh-18">
                  {isRTL
                    ? "العمرة هي زيارة بيت الله الحرام في أي وقت من السنة، وهي سنة مؤكدة عن النبي صلى الله عليه وسلم. إنها فرصة للتقرب إلى الله وتجديد الإيمان."
                    : "Omra is a visit to the Holy House of Allah at any time of the year. It is a confirmed Sunnah of the Prophet (PBUH) and an opportunity to draw closer to Allah and renew faith."}
                </p>
                <p className="text-15 text-light-2 mb-30 lh-18">
                  {isRTL
                    ? "نقدم لكم باقات عمرة متنوعة تناسب جميع الميزانيات، مع خدمات متكاملة لضمان رحلة مريحة وروحانية."
                    : "We offer diverse Omra packages to suit all budgets, with comprehensive services to ensure a comfortable and spiritual journey."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Omra Steps Section */}
      <section className="layout-pt-lg layout-pb-lg">
        <div className="container">
          <div className="row justify-center text-center mb-40">
            <div className="col-lg-6">
              <span className="text-accent-1 text-15 fw-500 mb-10 d-block" data-aos="fade-up">
                {isRTL ? "خطوات العمرة" : "Omra Steps"}
              </span>
              <h2 className="text-30 md:text-24 fw-700 text-dark-1" data-aos="fade-up" data-aos-delay="100">
                {isRTL ? "مناسك العمرة" : "Omra Rituals"}
              </h2>
              <p className="text-15 text-light-2 mt-15" data-aos="fade-up" data-aos-delay="200">
                {isRTL
                  ? "تعرف على الخطوات الأساسية لأداء مناسك العمرة"
                  : "Learn about the essential steps of performing Omra"}
              </p>
            </div>
          </div>

          <div className="row y-gap-30 justify-center">
            {omraSteps.map((step, index) => (
              <div key={index} className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay={index * 100}>
                <div
                  className="bg-white rounded-12 p-30 h-100 border-1 border-light-1 text-center"
                  style={{
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 10px 40px rgba(1, 159, 177, 0.15)";
                    e.currentTarget.style.borderColor = "var(--color-accent-1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--color-light-1)";
                  }}
                >
                  <div
                    className="d-flex items-center justify-center rounded-full text-white fw-600 mx-auto mb-20"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "var(--color-accent-1)",
                      fontSize: "20px",
                    }}
                  >
                    {index + 1}
                  </div>
                  <h3 className="text-18 fw-600 text-dark-1 mb-10">
                    {isRTL ? step.stepAr : step.stepEn}
                  </h3>
                  <p className="text-14 text-light-2 lh-17">
                    {isRTL ? step.descAr : step.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
