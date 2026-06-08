"use client";
import { useEffect, useState, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { submitFlightSearch } from "@/utils/flightUrl";
import FlightCalendar from "./FlightCalendar";
import AirportSearch from "./AirportSearch";
import PassengersClass from "./PassengersClass";

export default function FlightSearch({ onBack }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [currentActiveDD, setCurrentActiveDD] = useState("");
  const [tripType, setTripType] = useState("roundtrip");
  const [fromAirport, setFromAirport] = useState(null);
  const [toAirport, setToAirport] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [multiCitySegments, setMultiCitySegments] = useState([
    { from: null, to: null, date: null },
    { from: null, to: null, date: null },
  ]);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [flightClass, setFlightClass] = useState("Y");
  const [errors, setErrors] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    sameCity: "",
    multiCity: {},
  });

  useEffect(() => {
    setCurrentActiveDD("");
    // Clear errors when fields change
    setErrors({
      from: "",
      to: "",
      departureDate: "",
      returnDate: "",
      sameCity: "",
      multiCity: {},
    });
  }, [fromAirport, toAirport, departureDate, returnDate, tripType]);

  const dropDownContainer = useRef();
  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setCurrentActiveDD("");
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleSearch = () => {
    const result = submitFlightSearch(
      {
        tripType,
        fromAirport,
        toAirport,
        departureDate,
        returnDate,
        multiCitySegments,
        passengers,
        flightClass,
      },
      language,
    );
    if (!result.ok) setErrors(result.errors);
  };

  const totalPassengers =
    passengers.adults + passengers.children + passengers.infants;
  const classLabels = {
    Y: "Economy",
    W: "Premium Economy",
    C: "Business Class",
    F: "First Class",
  };

  return (
    <div className="hero__filter" ref={dropDownContainer} dir={isRTL ? "rtl" : "ltr"} style={{ position: "relative", zIndex: 100 }}>
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="button -sm text-14 bg-blue-1-05 text-blue-1 mb-20"
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >
          <i className={`icon-arrow-${isRTL ? "right" : "left"} text-12`}></i>
          {isRTL ? "عودة" : "Back"}
        </button>
      )}

      {/* Trip Type Tabs */}
      <div className="searchForm__tabs">
        <button
          className={`searchForm__tab ${tripType === "roundtrip" ? "is-active" : ""
            }`}
          onClick={() => setTripType("roundtrip")}
        >
          {t("flightSearch.tripTypes.roundTrip")}
        </button>
        <button
          className={`searchForm__tab ${tripType === "oneway" ? "is-active" : ""
            }`}
          onClick={() => setTripType("oneway")}
        >
          {t("flightSearch.tripTypes.oneWay")}
        </button>
        <button
          className={`searchForm__tab ${tripType === "multicity" ? "is-active" : ""
            }`}
          onClick={() => setTripType("multicity")}
        >
          {t("flightSearch.tripTypes.multiCity")}
        </button>
      </div>

      {/* Flight Search Form */}
      <div className="flight-search-form">
        {tripType !== "multicity" ? (
          <>
            <div className="flight-search-row">
              {/* FROM */}
              <div
                className="flight-field"
                onClick={() =>
                  setCurrentActiveDD((pre) =>
                    pre === "from" ? "" : "from"
                  )
                }
              >
                <div className="flight-field-label">
                  {t("flightSearch.fields.from")}
                </div>
                <div
                  className={
                    fromAirport
                      ? "flight-field-value"
                      : "flight-field-placeholder"
                  }
                >
                  {fromAirport
                    ? `${fromAirport.city}`
                    : t("flightSearch.placeholders.departureAirport")}
                </div>
                <AirportSearch
                  setAirport={setFromAirport}
                  active={currentActiveDD === "from"}
                />
              </div>

              <div className="flight-search-divider"></div>

              {/* TO */}
              <div
                className="flight-field"
                onClick={() =>
                  setCurrentActiveDD((pre) =>
                    pre === "to" ? "" : "to"
                  )
                }
              >
                <div className="flight-field-label">
                  {t("flightSearch.fields.to")}
                </div>
                <div
                  className={
                    toAirport
                      ? "flight-field-value"
                      : "flight-field-placeholder"
                  }
                >
                  {toAirport
                    ? `${toAirport.city}`
                    : t("flightSearch.placeholders.arrivalAirport")}
                </div>
                <AirportSearch
                  setAirport={setToAirport}
                  active={currentActiveDD === "to"}
                />
              </div>

              <div className="flight-search-divider"></div>

              {/* DEPARTURE DATE */}
              <div
                className="flight-field"
                onClick={() =>
                  setCurrentActiveDD((pre) =>
                    pre === "departure" ? "" : "departure"
                  )
                }
              >
                <div className="flight-field-label">
                  {t("flightSearch.fields.departure")}
                </div>
                <div
                  className={
                    departureDate
                      ? "flight-field-value"
                      : "flight-field-placeholder"
                  }
                >
                  <FlightCalendar
                    active={currentActiveDD === "departure"}
                    date={departureDate}
                    setDate={setDepartureDate}
                  />
                </div>
              </div>

              {tripType === "roundtrip" && (
                <>
                  <div className="flight-search-divider"></div>

                  {/* RETURN DATE */}
                  <div
                    className="flight-field"
                    onClick={() =>
                      setCurrentActiveDD((pre) =>
                        pre === "return" ? "" : "return"
                      )
                    }
                  >
                    <div className="flight-field-label">
                      {t("flightSearch.fields.return")}
                    </div>
                    <div
                      className={
                        returnDate
                          ? "flight-field-value"
                          : "flight-field-placeholder"
                      }
                    >
                      <FlightCalendar
                        active={currentActiveDD === "return"}
                        date={returnDate}
                        setDate={setReturnDate}
                        minDate={departureDate}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flight-search-divider"></div>

              <div
                className="flight-field"
                onClick={() =>
                  setCurrentActiveDD((pre) =>
                    pre === "passengers" ? "" : "passengers"
                  )
                }
              >
                <div className="flight-field-label">
                  {t("flightSearch.fields.passengersClass")}
                </div>
                <div className="flight-field-value">
                  {totalPassengers}{" "}
                  {totalPassengers === 1
                    ? t("flightSearch.passengers.traveller")
                    : t("flightSearch.passengers.travellers")}
                  , {classLabels[flightClass]}
                </div>
                <PassengersClass
                  active={currentActiveDD === "passengers"}
                  passengers={passengers}
                  setPassengers={setPassengers}
                  flightClass={flightClass}
                  setFlightClass={setFlightClass}
                  onClose={() => setCurrentActiveDD("")}
                />
              </div>
            </div>

            {/* Error Messages for Single Segment */}
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
                        {language === "ar"
                          ? "المغادرة: "
                          : "Departure: "}
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
        ) : (
          <>
            {/* MULTI CITY */}
            {multiCitySegments.map((segment, index) => (
              <div
                key={index}
                style={{
                  marginBottom:
                    index < multiCitySegments.length - 1
                      ? "12px"
                      : "0",
                  position: "relative",
                }}
              >
                <div className="flight-search-row">
                  {/* FROM */}
                  <div
                    className="flight-field"
                    onClick={() =>
                      setCurrentActiveDD((pre) =>
                        pre === `mc-from-${index}`
                          ? ""
                          : `mc-from-${index}`
                      )
                    }
                  >
                    <div className="flight-field-label">
                      {t("flightSearch.fields.from")}
                    </div>
                    <div
                      className={
                        segment.from
                          ? "flight-field-value"
                          : "flight-field-placeholder"
                      }
                    >
                      {segment.from
                        ? segment.from.city
                        : t(
                          "flightSearch.placeholders.departureAirport"
                        )}
                    </div>
                    <AirportSearch
                      setAirport={(airport) => {
                        const newSegments = [...multiCitySegments];
                        newSegments[index].from = airport;
                        setMultiCitySegments(newSegments);
                      }}
                      active={currentActiveDD === `mc-from-${index}`}
                    />
                  </div>

                  <div className="flight-search-divider"></div>

                  {/* TO */}
                  <div
                    className="flight-field"
                    onClick={() =>
                      setCurrentActiveDD((pre) =>
                        pre === `mc-to-${index}`
                          ? ""
                          : `mc-to-${index}`
                      )
                    }
                  >
                    <div className="flight-field-label">
                      {t("flightSearch.fields.to")}
                    </div>
                    <div
                      className={
                        segment.to
                          ? "flight-field-value"
                          : "flight-field-placeholder"
                      }
                    >
                      {segment.to
                        ? segment.to.city
                        : t(
                          "flightSearch.placeholders.arrivalAirport"
                        )}
                    </div>
                    <AirportSearch
                      setAirport={(airport) => {
                        const newSegments = [...multiCitySegments];
                        newSegments[index].to = airport;
                        // Auto-calculate next segment's 'from' field
                        if (index < multiCitySegments.length - 1) {
                          newSegments[index + 1].from = airport;
                        }
                        setMultiCitySegments(newSegments);
                      }}
                      active={currentActiveDD === `mc-to-${index}`}
                    />
                  </div>

                  <div className="flight-search-divider"></div>

                  {/* DEPARTURE DATE */}
                  <div
                    className="flight-field"
                    onClick={() =>
                      setCurrentActiveDD((pre) =>
                        pre === `mc-date-${index}`
                          ? ""
                          : `mc-date-${index}`
                      )
                    }
                  >
                    <div className="flight-field-label">
                      {t("flightSearch.fields.departure")}
                    </div>
                    <div
                      className={
                        segment.date
                          ? "flight-field-value"
                          : "flight-field-placeholder"
                      }
                    >
                      <FlightCalendar
                        active={
                          currentActiveDD === `mc-date-${index}`
                        }
                        date={segment.date}
                        setDate={(date) => {
                          const newSegments = [...multiCitySegments];
                          newSegments[index].date = date;
                          setMultiCitySegments(newSegments);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                {multiCitySegments.length > 2 && (
                  <button
                    onClick={() => {
                      const newSegments = multiCitySegments.filter(
                        (_, i) => i !== index
                      );
                      setMultiCitySegments(newSegments);
                    }}
                    style={{
                      position: "absolute",
                      top: "8px",
                      ...(isRTL ? { left: "8px" } : { right: "8px" }),
                      width: "28px",
                      height: "28px",
                      background: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ef4444",
                      fontSize: "16px",
                      transition:
                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      zIndex: 10,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#fee2e2";
                      e.currentTarget.style.borderColor = "#ef4444";
                      e.currentTarget.style.transform =
                        "scale(1.1) rotate(90deg)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(239, 68, 68, 0.25)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                      e.currentTarget.style.transform =
                        "scale(1) rotate(0deg)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    title="Remove this flight"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {/* Multi-city error messages */}
            {Object.keys(errors.multiCity).length > 0 && (
              <div className="flight-search__error-container">
                {Object.entries(errors.multiCity).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flight-search__error"
                      dir={language === "ar" ? "rtl" : "ltr"}
                    >
                      <AlertCircle size={16} />
                      <span>
                        {key === "general"
                          ? value
                          : `${language === "ar"
                            ? `رحلة ${parseInt(key) + 1}`
                            : `Flight ${parseInt(key) + 1}`
                          }: ${value}`}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}

            {multiCitySegments.length < 6 && (
              <button
                onClick={() => {
                  const lastSegment =
                    multiCitySegments[multiCitySegments.length - 1];
                  const newSegmentFrom = lastSegment.to || null;
                  setMultiCitySegments([
                    ...multiCitySegments,
                    { from: newSegmentFrom, to: null, date: null },
                  ]);
                }}
                style={{
                  marginTop: "12px",
                  marginBottom: "12px",
                  padding: "8px 16px",
                  fontSize: "13px",
                  color: "var(--color-accent-1)",
                  background: "transparent",
                  border: "1px solid var(--color-accent-1)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    "var(--color-accent-1)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(1, 159, 177, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color =
                    "var(--color-accent-1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {t("flightSearch.buttons.addFlight")}
              </button>
            )}

            <div className="flight-search-row">
              <div
                className="flight-field"
                onClick={() =>
                  setCurrentActiveDD((pre) =>
                    pre === "passengers" ? "" : "passengers"
                  )
                }
              >
                <div className="flight-field-label">
                  {t("flightSearch.fields.passengersClass")}
                </div>
                <div className="flight-field-value">
                  {totalPassengers}{" "}
                  {totalPassengers === 1
                    ? t("flightSearch.passengers.traveller")
                    : t("flightSearch.passengers.travellers")}
                  , {classLabels[flightClass]}
                </div>
                <PassengersClass
                  active={currentActiveDD === "passengers"}
                  passengers={passengers}
                  setPassengers={setPassengers}
                  flightClass={flightClass}
                  setFlightClass={setFlightClass}
                  onClose={() => setCurrentActiveDD("")}
                />
              </div>
            </div>
          </>
        )}

        {/* Search Button */}
        <button onClick={handleSearch} className="flight-search-btn">
          <i className="icon-search text-18"></i>
          {t("flightSearch.buttons.searchFlights")}
        </button>
      </div>
    </div>
  );
}
