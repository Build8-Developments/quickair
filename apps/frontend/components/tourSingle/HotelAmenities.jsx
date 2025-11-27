"use client";

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HotelAmenities({ amenities }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  useEffect(() => {
    // Initialize Lucide icons after component mounts
    if (typeof window !== "undefined" && window.lucide) {
      window.lucide.createIcons();
    }
  }, [amenities]);

  if (!amenities || amenities.length === 0) return null;

  // Group amenities by category
  const groupedAmenities = amenities.reduce((acc, amenity) => {
    const category = amenity.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(amenity);
    return acc;
  }, {});

  // Define category order and translations
  const categoryOrder = [
    "General",
    "Room Features",
    "Food & Drink",
    "Activities",
    "Services",
    "Internet",
    "Wellness",
    "Transportation",
    "Other",
  ];

  const categoryTranslations = {
    General: t("hotel.categories.general"),
    "Room Features": t("hotel.categories.roomFeatures"),
    "Food & Drink": t("hotel.categories.foodDrink"),
    Activities: t("hotel.categories.activities"),
    Services: t("hotel.categories.services"),
    Internet: t("hotel.categories.internet"),
    Wellness: t("hotel.categories.wellness"),
    Transportation: t("hotel.categories.transportation"),
    Other: t("hotel.categories.other"),
  };

  // Sort categories according to the defined order
  const sortedCategories = Object.keys(groupedAmenities).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <div className="pt-20">
      {sortedCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-40">
          <h4 className="text-20 fw-500 mb-20">
            {categoryTranslations[category] || category}
          </h4>
          <div className="row x-gap-40 y-gap-20">
            {groupedAmenities[category].map((amenity, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="d-flex items-center">
                  <i
                    data-lucide={amenity.icon || "star"}
                    className={`text-20 text-accent-1 ${
                      isRTL ? "ml-15" : "mr-15"
                    }`}
                  ></i>
                  <span className="text-15">{amenity.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
