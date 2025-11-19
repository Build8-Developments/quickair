"use client";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PassengerSelector({
  passengers,
  onPassengersChange,
  flightClass,
  onClassChange,
}) {
  const { language } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const classOptions = [
    { value: "Y", label: "Economy" },
    { value: "W", label: "Premium Economy" },
    { value: "C", label: "Business Class" },
    { value: "F", label: "First Class" },
  ];

  const getClassLabel = () => {
    return (
      classOptions.find((opt) => opt.value === flightClass)?.label || "Economy"
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const updatePassenger = (type, increment) => {
    const newPassengers = { ...passengers };

    if (increment) {
      newPassengers[type] += 1;
    } else {
      if (type === "adults" && passengers.adults > 1) {
        newPassengers[type] -= 1;
      } else if (type !== "adults" && passengers[type] > 0) {
        newPassengers[type] -= 1;
      }
    }

    // Validate: infants cannot exceed adults
    if (type === "infants" && newPassengers.infants > newPassengers.adults) {
      return;
    }
    if (type === "adults" && newPassengers.adults < newPassengers.infants) {
      return;
    }

    onPassengersChange(newPassengers);
  };

  const totalPassengers =
    passengers.adults + passengers.children + passengers.infants;

  return (
    <div
      className="flight-search__field flight-search__passengers"
      ref={dropdownRef}
    >
      <label className="flight-search__label">
        <i className="icon-user text-12"></i>
        {language === "ar" ? "الركاب والدرجة" : "Passengers and Class"}
      </label>
      <div
        className="flight-search__input-wrapper flight-search__selector"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="flight-search__input">
          {totalPassengers} Traveller{totalPassengers !== 1 ? "s" : ""},{" "}
          {getClassLabel()}
        </div>
        <i
          className={`icon-chevron-down text-12 ${
            showDropdown ? "rotate-180" : ""
          }`}
        ></i>
      </div>

      {/* Passengers Dropdown */}
      {showDropdown && (
        <div className="flight-search__passengers-dropdown">
          {/* Class Selection */}
          <div className="flight-search__passenger-row">
            <div className="flight-search__passenger-info">
              <div className="flight-search__passenger-title">Class</div>
            </div>
            <select
              className="flight-search__class-select"
              value={flightClass}
              onChange={(e) => onClassChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            >
              {classOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Adults */}
          <div className="flight-search__passenger-row">
            <div className="flight-search__passenger-info">
              <div className="flight-search__passenger-title">
                {language === "ar" ? "بالغ" : "Adults"}
              </div>
              <div className="flight-search__passenger-desc">
                {language === "ar" ? "12+ سنة" : "12+ years"}
              </div>
            </div>
            <div className="flight-search__counter">
              <button
                className="button size-30 border rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  updatePassenger("adults", false);
                }}
                disabled={passengers.adults <= 1}
                type="button"
              >
                <i className="icon-minus text-10"></i>
              </button>
              <div className="flight-search__counter-value">
                {passengers.adults}
              </div>
              <button
                className="button size-30 border rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  updatePassenger("adults", true);
                }}
                type="button"
              >
                <i className="icon-plus text-10"></i>
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flight-search__passenger-row">
            <div className="flight-search__passenger-info">
              <div className="flight-search__passenger-title">
                {language === "ar" ? "أطفال" : "Children"}
              </div>
              <div className="flight-search__passenger-desc">
                {language === "ar" ? "2-11 سنة" : "2-11 years"}
              </div>
            </div>
            <div className="flight-search__counter">
              <button
                className="button size-30 border rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  updatePassenger("children", false);
                }}
                disabled={passengers.children <= 0}
                type="button"
              >
                <i className="icon-minus text-10"></i>
              </button>
              <div className="flight-search__counter-value">
                {passengers.children}
              </div>
              <button
                className="button size-30 border rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  updatePassenger("children", true);
                }}
                type="button"
              >
                <i className="icon-plus text-10"></i>
              </button>
            </div>
          </div>

          {/* Infants */}
          <div className="flight-search__passenger-row">
            <div className="flight-search__passenger-info">
              <div className="flight-search__passenger-title">
                {language === "ar" ? "رضع" : "Infants"}
              </div>
              <div className="flight-search__passenger-desc">
                {language === "ar" ? "أقل من سنتين" : "Under 2 years"}
              </div>
            </div>
            <div className="flight-search__counter">
              <button
                className="button size-30 border rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  updatePassenger("infants", false);
                }}
                disabled={passengers.infants <= 0}
                type="button"
              >
                <i className="icon-minus text-10"></i>
              </button>
              <div className="flight-search__counter-value">
                {passengers.infants}
              </div>
              <button
                className="button size-30 border rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  updatePassenger("infants", true);
                }}
                disabled={passengers.infants >= passengers.adults}
                type="button"
              >
                <i className="icon-plus text-10"></i>
              </button>
            </div>
          </div>

          {passengers.infants >= passengers.adults &&
            passengers.infants > 0 && (
              <div className="flight-search__passenger-note">
                <i className="icon-info text-12"></i>
                {language === "ar"
                  ? "عدد الرضع لا يمكن أن يتجاوز عدد البالغين"
                  : "Number of infants cannot exceed adults"}
              </div>
            )}
        </div>
      )}
    </div>
  );
}
