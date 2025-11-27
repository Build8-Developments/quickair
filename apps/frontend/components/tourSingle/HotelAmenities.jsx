"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { icons } from "lucide-react";

const DynamicIcon = ({ name, className }) => {
  if (!name) return <icons.Star className={className} />;

  // Convert kebab-case to PascalCase (e.g., "waves-ladder" -> "WavesLadder")
  const pascalCaseName = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  // Also handle direct PascalCase or camelCase if provided
  const IconComponent = icons[pascalCaseName] || icons[name];

  if (!IconComponent) {
    // Fallback icon
    return <icons.Star className={className} />;
  }

  return <IconComponent className={className} />;
};

export default function HotelAmenities({ amenities }) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="pt-20">
      <div className="row x-gap-40 y-gap-20">
        {amenities.map((amenity, index) => (
          <div key={index} className="col-lg-4 col-md-6">
            <div className="d-flex items-center">
              <DynamicIcon
                name={amenity.icon}
                className={`text-20 text-accent-1 ${isRTL ? "ml-15" : "mr-15"}`}
              />
              <span className="text-15">{amenity.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
