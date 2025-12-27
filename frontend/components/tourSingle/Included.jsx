"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, X } from "lucide-react";

export default function Included({ inclusions, exclusions }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const hasInclusions = inclusions && inclusions.length > 0;
  const hasExclusions = exclusions && exclusions.length > 0;

  if (!hasInclusions && !hasExclusions) return null;

  return (
    <div
      className="row x-gap-130 y-gap-20 pt-20"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ textAlign: isRTL ? "right" : "left" }}
    >
      {hasInclusions && (
        <div className={hasExclusions ? "col-lg-6" : "col-12"}>
          <h4 className="text-18 fw-500 mb-15">
            {t("hotel.included") || "Included"}
          </h4>
          <div className="y-gap-15">
            {inclusions.map((item, i) => (
              <div
                key={i}
                className="d-flex items-center"
                dir={isRTL ? "rtl" : "ltr"}
                style={{
                  gap: "12px",
                  flexDirection: isRTL ? "row-reverse" : "row",
                  justifyContent: isRTL ? "flex-end" : "flex-start",
                }}
              >
                <div className="flex-center size-24 rounded-full bg-green-1 flex-shrink-0">
                  <Check size={12} className="text-green-2" />
                </div>
                <span className="text-15">{item.item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasExclusions && (
        <div className={hasInclusions ? "col-lg-6" : "col-12"}>
          <h4 className="text-18 fw-500 mb-15">
            {t("hotel.notIncluded") || "Not Included"}
          </h4>
          <div className="y-gap-15">
            {exclusions.map((item, i) => (
              <div
                key={i}
                className="d-flex items-center"
                dir={isRTL ? "rtl" : "ltr"}
                style={{
                  gap: "12px",
                  flexDirection: isRTL ? "row-reverse" : "row",
                  justifyContent: isRTL ? "flex-end" : "flex-start",
                }}
              >
                <div className="flex-center size-24 rounded-full bg-red-4 flex-shrink-0">
                  <X size={12} className="text-red-3" />
                </div>
                <span className="text-15">{item.item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
