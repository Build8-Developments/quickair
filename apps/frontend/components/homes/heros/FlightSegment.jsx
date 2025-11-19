"use client";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAirportSearch } from "@/lib/api/hooks/useAirportSearch";
import DatePicker from "react-multi-date-picker";

export default function FlightSegment({
  from,
  to,
  departureDate,
  returnDate,
  onFromChange,
  onToChange,
  onDepartureDateChange,
  onReturnDateChange,
  showReturn = false,
}) {
  const { language } = useLanguage();
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const fromDropdownRef = useRef();
  const toDropdownRef = useRef();

  // Search for airports
  const { airports: fromResults, loading: fromLoading } = useAirportSearch({
    query: fromQuery,
    locale: language,
  });

  const { airports: toResults, loading: toLoading } = useAirportSearch({
    query: toQuery,
    locale: language,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (event) => {
      if (
        fromDropdownRef.current &&
        !fromDropdownRef.current.contains(event.target)
      ) {
        setShowFromDropdown(false);
      }
      if (
        toDropdownRef.current &&
        !toDropdownRef.current.contains(event.target)
      ) {
        setShowToDropdown(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleFromSelect = (airport) => {
    onFromChange(airport);
    setFromQuery(airport.name);
    setShowFromDropdown(false);
  };

  const handleToSelect = (airport) => {
    onToChange(airport);
    setToQuery(airport.name);
    setShowToDropdown(false);
  };

  const handleFromInputChange = (e) => {
    setFromQuery(e.target.value);
    setShowFromDropdown(true);
    if (!e.target.value) {
      onFromChange(null);
    }
  };

  const handleToInputChange = (e) => {
    setToQuery(e.target.value);
    setShowToDropdown(true);
    if (!e.target.value) {
      onToChange(null);
    }
  };

  return (
    <div className="flight-search__segment">
      {/* FROM Field */}
      <div className="flight-search__field" ref={fromDropdownRef}>
        <label className="flight-search__label">
          <i className="icon-location text-12"></i>
          {language === "ar" ? "من" : "From"}
        </label>
        <div className="flight-search__input-wrapper">
          <input
            type="text"
            className="flight-search__input"
            placeholder={
              language === "ar" ? "مطار المغادرة" : "Departure Airport"
            }
            value={from ? from.name : fromQuery}
            onChange={handleFromInputChange}
            onFocus={() => setShowFromDropdown(true)}
          />
        </div>

        {/* FROM Dropdown */}
        {showFromDropdown && fromQuery.length >= 2 && (
          <div className="flight-search__dropdown">
            {fromLoading ? (
              <div className="flight-search__dropdown-loading">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flight-search__dropdown-skeleton">
                    <div className="skeleton-icon skeleton-pulse"></div>
                    <div className="skeleton-info">
                      <div className="skeleton-name skeleton-pulse"></div>
                      <div className="skeleton-code skeleton-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : fromResults.length > 0 ? (
              <div className="flight-search__dropdown-results">
                {fromResults.map((airport) => (
                  <div
                    key={airport.iata}
                    className="flight-search__dropdown-item"
                    onClick={() => handleFromSelect(airport)}
                  >
                    <div className="flight-search__dropdown-icon">
                      <i className="icon-plane"></i>
                    </div>
                    <div className="flight-search__dropdown-info">
                      <div className="flight-search__dropdown-name">
                        {airport.name}
                      </div>
                      <div className="flight-search__dropdown-code">
                        {airport.city}, {airport.country} ({airport.iata})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flight-search__dropdown-empty">
                {language === "ar" ? "لا توجد نتائج" : "No airports found"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* TO Field */}
      <div className="flight-search__field" ref={toDropdownRef}>
        <label className="flight-search__label">
          <i className="icon-location text-12"></i>
          {language === "ar" ? "إلى" : "To"}
        </label>
        <div className="flight-search__input-wrapper">
          <input
            type="text"
            className="flight-search__input"
            placeholder={language === "ar" ? "مطار الوصول" : "Arrival Airport"}
            value={to ? to.name : toQuery}
            onChange={handleToInputChange}
            onFocus={() => setShowToDropdown(true)}
          />
        </div>

        {/* TO Dropdown */}
        {showToDropdown && toQuery.length >= 2 && (
          <div className="flight-search__dropdown">
            {toLoading ? (
              <div className="flight-search__dropdown-loading">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flight-search__dropdown-skeleton">
                    <div className="skeleton-icon skeleton-pulse"></div>
                    <div className="skeleton-info">
                      <div className="skeleton-name skeleton-pulse"></div>
                      <div className="skeleton-code skeleton-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : toResults.length > 0 ? (
              <div className="flight-search__dropdown-results">
                {toResults.map((airport) => (
                  <div
                    key={airport.iata}
                    className="flight-search__dropdown-item"
                    onClick={() => handleToSelect(airport)}
                  >
                    <div className="flight-search__dropdown-icon">
                      <i className="icon-plane"></i>
                    </div>
                    <div className="flight-search__dropdown-info">
                      <div className="flight-search__dropdown-name">
                        {airport.name}
                      </div>
                      <div className="flight-search__dropdown-code">
                        {airport.city}, {airport.country} ({airport.iata})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flight-search__dropdown-empty">
                {language === "ar" ? "لا توجد نتائج" : "No airports found"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* DEPARTURE Date */}
      <div className="flight-search__field">
        <label className="flight-search__label">
          <i className="icon-calendar text-12"></i>
          {language === "ar" ? "المغادرة" : "Departure"}
        </label>
        <div className="flight-search__input-wrapper">
          <DatePicker
            value={departureDate}
            onChange={onDepartureDateChange}
            format="DD MMM YYYY"
            placeholder={language === "ar" ? "اختر التاريخ" : "Select Date"}
            minDate={new Date()}
            inputClass="flight-search__input"
            containerClassName="flight-search__datepicker"
          />
        </div>
      </div>

      {/* RETURN Date (only for round trip) */}
      {showReturn && (
        <div className="flight-search__field">
          <label className="flight-search__label">
            <i className="icon-calendar text-12"></i>
            {language === "ar" ? "العودة" : "Return"}
          </label>
          <div className="flight-search__input-wrapper">
            <DatePicker
              value={returnDate}
              onChange={onReturnDateChange}
              format="DD MMM YYYY"
              placeholder={language === "ar" ? "اختر التاريخ" : "Select Date"}
              minDate={departureDate || new Date()}
              inputClass="flight-search__input"
              containerClassName="flight-search__datepicker"
            />
          </div>
        </div>
      )}
    </div>
  );
}
