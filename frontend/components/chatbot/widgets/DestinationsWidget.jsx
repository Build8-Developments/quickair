"use client";

import { useState } from "react";
import styles from "./DestinationsWidget.module.css";

export default function DestinationsWidget({ language = "ar", dynamicDestinations = [], onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  // Fallback to static if dynamicDestinations is empty, but you asked for NO mock data so we will rely entirely on Strapi
  const filteredDestinations = selectedCategory === "all"
    ? dynamicDestinations
    : dynamicDestinations.filter(d => d.category === selectedCategory);

  const handleSelect = (destination) => {
    onSelect({
      destination: {
        id: destination.id,
        name: destination.name,
        flag: destination.flagCode ? `https://flagcdn.com/w40/${destination.flagCode}.png` : null,
      },
      message: destination.name,
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
        {filteredDestinations.length === 0 && (
          <p style={{ textAlign: "center", gridColumn: "1 / -1", color: "#666" }}>
            {t("لا توجد وجهات متاحة حالياً.", "No destinations currently available.")}
          </p>
        )}
        {filteredDestinations.map((destination) => (
          <button
            key={destination.id}
            className={styles.destinationCard}
            onClick={() => handleSelect(destination)}
          >
            {destination.flagCode && (
              <img
                src={`https://flagcdn.com/w40/${destination.flagCode}.png`}
                alt={destination.flagCode}
                className={styles.flagImage || "flag-icon"}
                style={{ width: "24px", height: "auto", borderRadius: "4px", objectFit: "cover" }}
              />
            )}
            <span className={styles.name}>
              {destination.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
