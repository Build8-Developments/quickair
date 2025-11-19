"use client";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import FlightSegment from "./FlightSegment";
import PassengerSelector from "./PassengerSelector";
import { buildFlightSearchUrl } from "@/utils/flightUrl";

export default function FlightSearch() {
  const { language } = useLanguage();
  const [tripType, setTripType] = useState("roundtrip"); // roundtrip, oneway, multicity

  const [flightClass, setFlightClass] = useState("Y"); // Y, W, C, F
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  // For roundtrip and oneway - single segment
  const [singleSegment, setSingleSegment] = useState({
    from: null,
    to: null,
    departureDate: null,
    returnDate: null,
  });

  // For multicity - array of segments
  const [multiCitySegments, setMultiCitySegments] = useState([
    { from: null, to: null, departureDate: null },
    { from: null, to: null, departureDate: null },
  ]);

  const handleTripTypeChange = (type) => {
    setTripType(type);
  };

  const addCity = () => {
    if (multiCitySegments.length < 6) {
      setMultiCitySegments([
        ...multiCitySegments,
        { from: null, to: null, departureDate: null },
      ]);
    }
  };

  const removeCity = (index) => {
    if (multiCitySegments.length > 2) {
      setMultiCitySegments(multiCitySegments.filter((_, i) => i !== index));
    }
  };

  const updateSingleSegment = (field, value) => {
    setSingleSegment((prev) => ({ ...prev, [field]: value }));
  };

  const updateMultiCitySegment = (index, field, value) => {
    const newSegments = [...multiCitySegments];
    newSegments[index] = { ...newSegments[index], [field]: value };
    setMultiCitySegments(newSegments);
  };

  const handleSearch = () => {
    const url = buildFlightSearchUrl({
      tripType,
      flightClass,
      passengers,
      singleSegment,
      multiCitySegments,
    });

    if (url) {
      window.location.href = url;
    } else {
      alert(
        language === "ar"
          ? "الرجاء ملء جميع الحقول المطلوبة"
          : "Please fill in all required fields"
      );
    }
  };

  const totalPassengers =
    passengers.adults + passengers.children + passengers.infants;

  return (
    <div className="flight-search">
      {/* Trip Type Tabs */}
      <div className="flight-search__tabs">
        <button
          onClick={() => handleTripTypeChange("roundtrip")}
          className={`flight-search__tab ${
            tripType === "roundtrip" ? "is-active" : ""
          }`}
        >
          {language === "ar" ? "ذهاب وعودة" : "Round Trip"}
        </button>
        <button
          onClick={() => handleTripTypeChange("oneway")}
          className={`flight-search__tab ${
            tripType === "oneway" ? "is-active" : ""
          }`}
        >
          {language === "ar" ? "ذهاب فقط" : "One Way"}
        </button>
        <button
          onClick={() => handleTripTypeChange("multicity")}
          className={`flight-search__tab ${
            tripType === "multicity" ? "is-active" : ""
          }`}
        >
          {language === "ar" ? "متعدد المدن" : "Multi City"}
        </button>
      </div>

      {/* Flight Search Form */}
      <div className="flight-search__form">
        {tripType === "multicity" ? (
          // Multi-city segments
          <div className="flight-search__multicity">
            {multiCitySegments.map((segment, index) => (
              <div key={index} className="flight-search__segment-wrapper">
                <div className="flight-search__segment-header">
                  <span className="flight-search__segment-label">
                    {language === "ar"
                      ? `رحلة ${index + 1}`
                      : `Flight ${index + 1}`}
                  </span>
                  {multiCitySegments.length > 2 && (
                    <button
                      onClick={() => removeCity(index)}
                      className="flight-search__remove-city"
                      type="button"
                    >
                      <i className="icon-delete"></i>
                      {language === "ar" ? "إزالة" : "Remove"}
                    </button>
                  )}
                </div>
                <FlightSegment
                  from={segment.from}
                  to={segment.to}
                  departureDate={segment.departureDate}
                  onFromChange={(value) =>
                    updateMultiCitySegment(index, "from", value)
                  }
                  onToChange={(value) =>
                    updateMultiCitySegment(index, "to", value)
                  }
                  onDepartureDateChange={(value) =>
                    updateMultiCitySegment(index, "departureDate", value)
                  }
                  showReturn={false}
                />
              </div>
            ))}

            {multiCitySegments.length < 6 && (
              <button
                onClick={addCity}
                className="flight-search__add-city"
                type="button"
              >
                <i className="icon-plus"></i>
                {language === "ar" ? "إضافة مدينة أخرى" : "Add Another City"}
              </button>
            )}
          </div>
        ) : (
          // Single segment (roundtrip or oneway)
          <FlightSegment
            from={singleSegment.from}
            to={singleSegment.to}
            departureDate={singleSegment.departureDate}
            returnDate={singleSegment.returnDate}
            onFromChange={(value) => updateSingleSegment("from", value)}
            onToChange={(value) => updateSingleSegment("to", value)}
            onDepartureDateChange={(value) =>
              updateSingleSegment("departureDate", value)
            }
            onReturnDateChange={(value) =>
              updateSingleSegment("returnDate", value)
            }
            showReturn={tripType === "roundtrip"}
          />
        )}

        {/* Passengers and Class Row */}
        <div className="flight-search__bottom-row">
          <PassengerSelector
            passengers={passengers}
            onPassengersChange={setPassengers}
            flightClass={flightClass}
            onClassChange={setFlightClass}
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="button -dark-1 bg-accent-1 text-white col-12 flight-search__submit"
          type="button"
        >
          <i className="icon-search text-16"></i>
          {language === "ar" ? "بحث عن رحلات" : "Search Flights"}
        </button>
      </div>
    </div>
  );
}
