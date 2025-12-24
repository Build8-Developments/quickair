"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PassengersClass({
  active,
  passengers,
  setPassengers,
  flightClass,
  setFlightClass,
  onClose,
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  // Temporary state for selections
  const [tempPassengers, setTempPassengers] = useState(passengers);
  const [tempFlightClass, setTempFlightClass] = useState(flightClass);

  // Sync temporary state when dropdown opens or props change
  useEffect(() => {
    setTempPassengers(passengers);
    setTempFlightClass(flightClass);
  }, [active, passengers, flightClass]);
  const updatePassenger = (type, increment) => {
    setTempPassengers((prev) => {
      const newValue = Math.max(0, prev[type] + increment);

      // Ensure at least 1 adult
      if (type === "adults" && newValue < 1) return prev;

      // Ensure infants don't exceed adults
      if (type === "infants" && newValue > prev.adults) {
        return prev;
      }
      if (type === "adults" && newValue < prev.infants) {
        return { ...prev, adults: newValue, infants: newValue };
      }

      return { ...prev, [type]: newValue };
    });
  };

  const handleReset = () => {
    setTempPassengers({ adults: 1, children: 0, infants: 0 });
    setTempFlightClass("Y");
  };

  const handleApply = () => {
    setPassengers(tempPassengers);
    setFlightClass(tempFlightClass);
    onClose();
  };

  return (
    <div
      className={`flight-dropdown ${active ? "is-active" : ""}`}
      onClick={(e) => e.stopPropagation()}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flight-dropdown-content">
        {/* Class Selection */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#6b7280",
              marginBottom: "12px",
            }}
          >
            {t("flightSearch.classes.travelClass")}
          </div>
          <div className="class-options">
            <button
              className={`class-btn ${
                tempFlightClass === "Y" ? "is-active" : ""
              }`}
              onClick={() => setTempFlightClass("Y")}
            >
              {t("flightSearch.classes.economy")}
            </button>
            <button
              className={`class-btn ${
                tempFlightClass === "W" ? "is-active" : ""
              }`}
              onClick={() => setTempFlightClass("W")}
            >
              {t("flightSearch.classes.premiumEconomy")}
            </button>
            <button
              className={`class-btn ${
                tempFlightClass === "C" ? "is-active" : ""
              }`}
              onClick={() => setTempFlightClass("C")}
            >
              {t("flightSearch.classes.business")}
            </button>
            <button
              className={`class-btn ${
                tempFlightClass === "F" ? "is-active" : ""
              }`}
              onClick={() => setTempFlightClass("F")}
            >
              {t("flightSearch.classes.first")}
            </button>
          </div>
        </div>

        {/* Adults */}
        <div className="passenger-row">
          <div className="passenger-info">
            <h6>{t("flightSearch.passengers.adults")}</h6>
            <p>{t("flightSearch.passengers.ages.adults")}</p>
          </div>
          <div className="passenger-controls">
            <button
              className="passenger-btn"
              onClick={() => updatePassenger("adults", -1)}
              disabled={tempPassengers.adults <= 1}
            >
              <i className="icon-minus text-12"></i>
            </button>
            <span className="passenger-count">{tempPassengers.adults}</span>
            <button
              className="passenger-btn"
              onClick={() => updatePassenger("adults", 1)}
            >
              <i className="icon-plus text-12"></i>
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="passenger-row">
          <div className="passenger-info">
            <h6>{t("flightSearch.passengers.children")}</h6>
            <p>{t("flightSearch.passengers.ages.children")}</p>
          </div>
          <div className="passenger-controls">
            <button
              className="passenger-btn"
              onClick={() => updatePassenger("children", -1)}
              disabled={tempPassengers.children <= 0}
            >
              <i className="icon-minus text-12"></i>
            </button>
            <span className="passenger-count">{tempPassengers.children}</span>
            <button
              className="passenger-btn"
              onClick={() => updatePassenger("children", 1)}
            >
              <i className="icon-plus text-12"></i>
            </button>
          </div>
        </div>

        {/* Infants */}
        <div className="passenger-row">
          <div className="passenger-info">
            <h6>{t("flightSearch.passengers.infants")}</h6>
            <p>{t("flightSearch.passengers.ages.infants")}</p>
          </div>
          <div className="passenger-controls">
            <button
              className="passenger-btn"
              onClick={() => updatePassenger("infants", -1)}
              disabled={tempPassengers.infants <= 0}
            >
              <i className="icon-minus text-12"></i>
            </button>
            <span className="passenger-count">{tempPassengers.infants}</span>
            <button
              className="passenger-btn"
              onClick={() => updatePassenger("infants", 1)}
              disabled={tempPassengers.infants >= tempPassengers.adults}
            >
              <i className="icon-plus text-12"></i>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="passenger-actions">
          <button className="passenger-action-btn reset" onClick={handleReset}>
            {t("common.reset")}
          </button>
          <button className="passenger-action-btn apply" onClick={handleApply}>
            {t("common.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}
