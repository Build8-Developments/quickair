"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PageHeader from "@/components/common/PageHeader";

export default function Hero() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <PageHeader
      icon="about"
      title={isArabic ? "من نحن" : "About Us"}
      description={isArabic 
        ? "شريكك الموثوق في السفر منذ عام 1986"
        : "Your Trusted Travel Partner Since 1986"}
    />
  );
}
