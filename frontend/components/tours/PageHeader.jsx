"use client";

import React from "react";
import PageHeaderComponent from "@/components/common/PageHeader";

export default function PageHeader({ locale }) {
  const isRTL = locale === "ar";

  return (
    <PageHeaderComponent
      icon="tours"
      title={isRTL ? "الرحلات السياحية" : "Tours"}
      description={isRTL 
        ? "اكتشف أفضل الرحلات السياحية والوجهات المميزة"
        : "Explore the best tours and featured destinations"}
    />
  );
}
