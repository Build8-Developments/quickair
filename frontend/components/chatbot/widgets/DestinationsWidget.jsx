"use client";

import { useState } from "react";
import styles from "./DestinationsWidget.module.css";

const DESTINATIONS = [
  { id: "bali", nameAr: "بالي", nameEn: "Bali", flag: "🇮🇩", category: "international" },
  { id: "istanbul", nameAr: "إسطنبول", nameEn: "Istanbul", flag: "🇹🇷", category: "international" },
  { id: "sharm", nameAr: "شرم الشيخ", nameEn: "Sharm El Sheikh", flag: "🇪🇬", category: "domestic" },
  { id: "hurghada", nameAr: "الغردقة", nameEn: "Hurghada", flag: "🇪🇬", category: "domestic" },
  { id: "dahab", nameAr: "دهب", nameEn: "Dahab", flag: "🇪🇬", category: "domestic" },
  { id: "beirut", nameAr: "بيروت", nameEn: "Beirut", flag: "🇱🇧", category: "international" },
  { id: "ainsokhna", nameAr: "العين السخنة", nameEn: "Ain Sokhna", flag: "🇪🇬", category: "domestic" },
  { id: "sahlhashish", nameAr: "سهل حشيش", nameEn: "Sahl Hasheesh", flag: "🇪🇬", category: "domestic" },
];

export default function DestinationsWidget({ language = "ar", onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  const filteredDestinations = selectedCategory === "all" 
    ? DESTINATIONS 
    : DESTINATIONS.filter(d => d.category === selectedCategory);

  const handleSelect = (destination) => {
    onSelect({
      destination: {
        id: destination.id,
        name: isArabic ? destination.nameAr : destination.nameEn,
        flag: destination.flag,
      },
      message: isArabic ? destination.nameAr : destination.nameEn,
    });
  };

  return (
    <div className={styles.widget} dir={isArabic ? "rtl" : "ltr"}>
      {/* Category Tabs */}
      <div className={styles.categoryTabs}>
        <button
          className={`${styles.categoryTab} ${selectedCategory === "all" ? styles.active : ""}`}
          onClick={() => setSelectedCategory("all")}
        >
          {t("الكل", "All")}
        </button>
        <button
          className={`${styles.categoryTab} ${selectedCategory === "international" ? styles.active : ""}`}
          onClick={() => setSelectedCategory("international")}
        >
          {t("دولية", "International")}
        </button>
        <button
          className={`${styles.categoryTab} ${selectedCategory === "domestic" ? styles.active : ""}`}
          onClick={() => setSelectedCategory("domestic")}
        >
          {t("محلية", "Domestic")}
        </button>
      </div>

      {/* Destinations Grid */}
      <div className={styles.destinationsGrid}>
        {filteredDestinations.map((destination) => (
          <button
            key={destination.id}
            className={styles.destinationCard}
            onClick={() => handleSelect(destination)}
          >
            <span className={styles.flag}>{destination.flag}</span>
            <span className={styles.name}>
              {isArabic ? destination.nameAr : destination.nameEn}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
