"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/common/PageHeader";

const hajSteps = [
  { stepEn: "Ihram", stepAr: "الإحرام", descEn: "Enter the state of Ihram at the Miqat", descAr: "الدخول في حالة الإحرام عند الميقات" },
  { stepEn: "Tawaf", stepAr: "الطواف", descEn: "Circumambulate the Kaaba seven times", descAr: "الطواف حول الكعبة سبع مرات" },
  { stepEn: "Sa'i", stepAr: "السعي", descEn: "Walk between Safa and Marwa", descAr: "السعي بين الصفا والمروة" },
  { stepEn: "Arafat", stepAr: "عرفات", descEn: "Stand at Mount Arafat on the 9th of Dhul Hijjah", descAr: "الوقوف بجبل عرفات في التاسع من ذي الحجة" },
  { stepEn: "Muzdalifah", stepAr: "مزدلفة", descEn: "Spend the night at Muzdalifah", descAr: "المبيت في مزدلفة" },
  { stepEn: "Rami", stepAr: "رمي الجمرات", descEn: "Stone the pillars at Mina", descAr: "رمي الجمرات في منى" },
];

export default function HajPageContent({ locale }) {
  const isRTL = locale === "ar";

  return (
    <>
      <PageHeader
        icon="hajj"
        title={isRTL ? "الحج" : "Hajj"}
        description={isRTL 
          ? "الركن الخامس من أركان الإسلام - رحلة روحانية عميقة"
          : "The Fifth Pillar of Islam - A profound spiritual journey"}
      />

      {/* About Section */}
      <section className="layout-pb-lg bg-light-1">
        <div className="container">
          <div className="row y-gap-30 items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="ratio ratio-4:3 rounded-12 overflow-hidden shadow-1">
                <Image
                  src="/hij.png"
                  alt={isRTL ? "الكعبة المشرفة" : "The Holy Kaaba"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className={`${isRTL ? "text-right pr-lg-40" : "pl-lg-40"}`}>
                <span className="text-accent-1 text-15 fw-500 mb-10 d-block">
                  {isRTL ? "الركن الخامس من أركان الإسلام" : "The Fifth Pillar of Islam"}
                </span>
                <h2 className="text-30 md:text-24 fw-700 text-dark-1 mb-20">
                  {isRTL ? "رحلة الحج المقدسة" : "The Sacred Hajj Journey"}
                </h2>
                <p className="text-15 text-light-2 mb-20 lh-18">
                  {isRTL
                    ? "الحج هو الركن الخامس من أركان الإسلام، وهو فريضة على كل مسلم قادر مرة واحدة في العمر. إنها رحلة روحانية عميقة تجمع المسلمين من جميع أنحاء العالم في مكة المكرمة."
                    : "Hajj is the fifth pillar of Islam, obligatory once in a lifetime for every able Muslim. It is a profound spiritual journey that brings Muslims from around the world together in Makkah."}
                </p>
                <p className="text-15 text-light-2 mb-30 lh-18">
                  {isRTL
                    ? "نقدم لكم باقات حج شاملة تضمن لكم رحلة مريحة وروحانية، مع فريق متخصص لمرافقتكم في كل خطوة."
                    : "We offer comprehensive Hajj packages that ensure a comfortable and spiritual journey, with a dedicated team to accompany you every step of the way."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hajj Steps Section */}
      <section className="layout-pt-lg layout-pb-lg">
        <div className="container">
          <div className="row justify-center text-center mb-40">
            <div className="col-lg-6">
              <span className="text-accent-1 text-15 fw-500 mb-10 d-block" data-aos="fade-up">
                {isRTL ? "خطوات الحج" : "Hajj Steps"}
              </span>
              <h2 className="text-30 md:text-24 fw-700 text-dark-1" data-aos="fade-up" data-aos-delay="100">
                {isRTL ? "مناسك الحج" : "Hajj Rituals"}
              </h2>
              <p className="text-15 text-light-2 mt-15" data-aos="fade-up" data-aos-delay="200">
                {isRTL
                  ? "تعرف على الخطوات الأساسية لأداء مناسك الحج"
                  : "Learn about the essential steps of performing Hajj"}
              </p>
            </div>
          </div>

          <div className="row y-gap-30">
            {hajSteps.map((step, index) => (
              <div key={index} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={index * 50}>
                <div
                  className="bg-white rounded-12 p-30 h-100 border-1 border-light-1"
                  style={{
                    textAlign: isRTL ? "right" : "left",
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
                  <div className="d-flex items-center mb-20">
                    <div
                      className="d-flex items-center justify-center rounded-full text-white fw-600"
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "var(--color-accent-1)",
                        fontSize: "18px",
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>
                    <h3 className={`text-18 fw-600 text-dark-1 ${isRTL ? "mr-15" : "ml-15"}`}>
                      {isRTL ? step.stepAr : step.stepEn}
                    </h3>
                  </div>
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
