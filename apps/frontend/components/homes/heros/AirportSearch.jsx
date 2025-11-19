"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { searchAirports } from "@/lib/amadeus";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AirportSearch({ active, setAirport }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAirports, setFilteredAirports] = useState([]);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  useEffect(() => {
    // Load airports when dropdown opens or search changes
    if (active) {
      const airports = searchAirports(searchQuery, language);
      setFilteredAirports(airports);
    }
  }, [active, searchQuery, language]);

  const handleSelect = (airport) => {
    setAirport(airport);
    setSearchQuery("");
  };

  return (
    <div
      className={`flight-dropdown ${active ? "is-active" : ""}`}
      onClick={(e) => e.stopPropagation()}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flight-dropdown-content">
        <input
          type="text"
          className="airport-search-input"
          placeholder={t("flightSearch.airport.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {filteredAirports.length > 0 ? (
          filteredAirports.map((airport, i) => (
            <div
              onClick={() => handleSelect(airport)}
              key={i}
              className="airport-item"
            >
              <div className="airport-city">
                {airport.city}, {airport.country}
              </div>
              <div className="airport-name">
                {airport.iata} - {airport.name}
              </div>
            </div>
          ))
        ) : (
          <div className="airport-no-results">
            {t("flightSearch.airport.noResults")}
          </div>
        )}
      </div>
    </div>
  );
}
