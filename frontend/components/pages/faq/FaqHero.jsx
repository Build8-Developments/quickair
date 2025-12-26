"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PageHeader from "@/components/common/PageHeader";

export default function FaqHero() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <PageHeader
      icon="faq"
      title={isArabic ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
      description={isArabic 
        ? "احصل على إجابات لجميع أسئلتك حول خدماتنا والحجوزات والسفر"
        : "Get answers to all your questions about our services, bookings, and travel"}
    />
  );
}
