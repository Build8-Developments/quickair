"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAirportSearch } from "@/lib/api/hooks/useAirportSearch";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AirportSearch({ active, setAirport }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const { airports: filteredAirports, loading } = useAirportSearch({
    query: active ? searchQuery : "",
    locale: language,
    maxResults: 20,
    minQueryLength: 0,
    debounceMs: 150,
  });

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
        {loading ? (
          <div className="airport-no-results">
            {t("flightSearch.airport.searching", "Searching...")}
          </div>
        ) : filteredAirports.length > 0 ? (
          filteredAirports.map((airport) => (
            <div
              onClick={() => handleSelect(airport)}
              key={airport.iata}
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
