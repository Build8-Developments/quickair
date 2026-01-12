"use client";

import { useState } from "react";
import styles from "./DestinationsWidget.module.css";

const DESTINATIONS = [
  { id: "bali", nameAr: "بالي", nameEn: "Bali", flagCode: "id", category: "international" },
  { id: "istanbul", nameAr: "إسطنبول", nameEn: "Istanbul", flagCode: "tr", category: "international" },
  { id: "sharm", nameAr: "شرم الشيخ", nameEn: "Sharm El Sheikh", flagCode: "eg", category: "domestic" },
  { id: "hurghada", nameAr: "الغردقة", nameEn: "Hurghada", flagCode: "eg", category: "domestic" },
  { id: "dahab", nameAr: "دهب", nameEn: "Dahab", flagCode: "eg", category: "domestic" },
  { id: "beirut", nameAr: "بيروت", nameEn: "Beirut", flagCode: "lb", category: "international" },
  { id: "ainsokhna", nameAr: "العين السخنة", nameEn: "Ain Sokhna", flagCode: "eg", category: "domestic" },
  { id: "sahlhashish", nameAr: "سهل حشيش", nameEn: "Sahl Hasheesh", flagCode: "eg", category: "domestic" },
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
        flag: `https://flagcdn.com/w40/${destination.flagCode}.png`,
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
            <img
              src={`https://flagcdn.com/w40/${destination.flagCode}.png`}
              alt={destination.flagCode}
              className={styles.flagImage || "flag-icon"}
              style={{ width: "24px", height: "auto", borderRadius: "4px", objectFit: "cover" }}
            />
            <span className={styles.name}>
              {isArabic ? destination.nameAr : destination.nameEn}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
