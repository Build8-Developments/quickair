"use client";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
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

  // Error states
  const [errors, setErrors] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    sameCity: "",
    multiCity: {},
  });

  const handleTripTypeChange = (type) => {
    setTripType(type);
    // Clear errors when changing trip type
    setErrors({
      from: "",
      to: "",
      departureDate: "",
      returnDate: "",
      sameCity: "",
      multiCity: {},
    });
  };

  const addCity = () => {
    if (multiCitySegments.length < 6) {
      // Get the 'to' airport from the last segment to auto-fill the new segment's 'from'
      const lastSegment = multiCitySegments[multiCitySegments.length - 1];
      const newSegmentFrom = lastSegment.to || null;

      setMultiCitySegments([
        ...multiCitySegments,
        { from: newSegmentFrom, to: null, departureDate: null },
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
    // Clear error for this field when user updates it
    setErrors((prev) => ({ ...prev, [field]: "", sameCity: "" }));
  };

  const updateMultiCitySegment = (index, field, value) => {
    const newSegments = [...multiCitySegments];
    newSegments[index] = { ...newSegments[index], [field]: value };

    // Auto-calculate next segment's 'from' field when 'to' changes
    if (field === "to" && value && index < newSegments.length - 1) {
      newSegments[index + 1] = { ...newSegments[index + 1], from: value };
    }

    setMultiCitySegments(newSegments);
    // Clear error for this segment when user updates it
    setErrors((prev) => ({
      ...prev,
      multiCity: { ...prev.multiCity, [index]: "" },
    }));
  };

  const handleSearch = () => {
    // Reset errors
    const newErrors = {
      from: "",
      to: "",
      departureDate: "",
      returnDate: "",
      sameCity: "",
      multiCity: {},
    };

    // Validation
    if (tripType !== "multicity") {
      // Single segment validation
      if (!singleSegment.from) {
        newErrors.from =
          language === "ar" ? "هذا الحقل مطلوب" : "This field is required";
      }
      if (!singleSegment.to) {
        newErrors.to =
          language === "ar" ? "هذا الحقل مطلوب" : "This field is required";
      }
      if (!singleSegment.departureDate) {
        newErrors.departureDate =
          language === "ar" ? "هذا الحقل مطلوب" : "This field is required";
      }
      if (tripType === "roundtrip" && !singleSegment.returnDate) {
        newErrors.returnDate =
          language === "ar" ? "هذا الحقل مطلوب" : "This field is required";
      }

      // Check if From and To are the same
      if (
        singleSegment.from &&
        singleSegment.to &&
        singleSegment.from.iata === singleSegment.to.iata
      ) {
        newErrors.sameCity =
          language === "ar"
            ? "يرجى اختيار مدينة مختلفة للوصول"
            : "Departure and arrival cities must be different";
      }

      // If there are errors, set them and return
      if (
        Object.values(newErrors).some(
          (error) => typeof error === "string" && error !== ""
        )
      ) {
        setErrors(newErrors);
        return;
      }
    } else {
      // Multi-city validation
      let hasErrors = false;
      multiCitySegments.forEach((seg, index) => {
        const segmentErrors = [];
        if (!seg.from)
          segmentErrors.push(
            language === "ar" ? "المدينة مطلوبة" : "City required"
          );
        if (!seg.to)
          segmentErrors.push(
            language === "ar" ? "المدينة مطلوبة" : "City required"
          );
        if (!seg.departureDate)
          segmentErrors.push(
            language === "ar" ? "التاريخ مطلوب" : "Date required"
          );

        // Check if From and To are the same
        if (seg.from && seg.to && seg.from.iata === seg.to.iata) {
          segmentErrors.push(
            language === "ar"
              ? "يرجى اختيار مدينة مختلفة"
              : "Cities must be different"
          );
        }

        if (segmentErrors.length > 0) {
          newErrors.multiCity[index] = segmentErrors.join(", ");
          hasErrors = true;
        }
      });

      // Check if at least 2 segments are filled
      const validSegments = multiCitySegments.filter(
        (seg) => seg.from && seg.to && seg.departureDate
      );
      if (validSegments.length < 2) {
        newErrors.multiCity.general =
          language === "ar"
            ? "يرجى ملء رحلتين على الأقل"
            : "Please fill in at least 2 flights";
        hasErrors = true;
      }

      if (hasErrors) {
        setErrors(newErrors);
        return;
      }
    }

    const url = buildFlightSearchUrl({
      tripType,
      flightClass,
      passengers,
      singleSegment,
      multiCitySegments,
    });

    if (url) {
      window.location.href = url;
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
                {errors.multiCity[index] && (
                  <div
                    className="flight-search__error"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <AlertCircle size={16} />
                    <span>{errors.multiCity[index]}</span>
                  </div>
                )}
              </div>
            ))}

            {errors.multiCity.general && (
              <div
                className="flight-search__error"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                <AlertCircle size={16} />
                <span>{errors.multiCity.general}</span>
              </div>
            )}

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
          <>
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
            {(errors.from ||
              errors.to ||
              errors.departureDate ||
              errors.returnDate ||
              errors.sameCity) && (
              <div className="flight-search__error-container">
                {errors.from && (
                  <div
                    className="flight-search__error"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <AlertCircle size={16} />
                    <span>
                      {language === "ar" ? "من: " : "From: "}
                      {errors.from}
                    </span>
                  </div>
                )}
                {errors.to && (
                  <div
                    className="flight-search__error"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <AlertCircle size={16} />
                    <span>
                      {language === "ar" ? "إلى: " : "To: "}
                      {errors.to}
                    </span>
                  </div>
                )}
                {errors.departureDate && (
                  <div
                    className="flight-search__error"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <AlertCircle size={16} />
                    <span>
                      {language === "ar" ? "المغادرة: " : "Departure: "}
                      {errors.departureDate}
                    </span>
                  </div>
                )}
                {errors.returnDate && (
                  <div
                    className="flight-search__error"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <AlertCircle size={16} />
                    <span>
                      {language === "ar" ? "العودة: " : "Return: "}
                      {errors.returnDate}
                    </span>
                  </div>
                )}
                {errors.sameCity && (
                  <div
                    className="flight-search__error"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <AlertCircle size={16} />
                    <span>{errors.sameCity}</span>
                  </div>
                )}
              </div>
            )}
          </>
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
