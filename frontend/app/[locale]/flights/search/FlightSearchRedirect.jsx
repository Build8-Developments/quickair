"use client";

import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  buildFlightSearchUrlFromQuery,
  getFlightFormStateFromUrl,
  submitFlightSearch,
} from "@/utils/flightUrl";

export default function FlightSearchRedirect() {
  const searchParams = useSearchParams();
  const { locale } = useParams();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const passThrough = buildFlightSearchUrlFromQuery(searchParams);
    if (passThrough && searchParams.get("dep1")) {
      window.location.href = passThrough;
      return;
    }

    const state = getFlightFormStateFromUrl(searchParams, locale || "en");
    if (state) {
      submitFlightSearch(
        {
          tripType: state.tripType,
          fromAirport: state.fromAirport,
          toAirport: state.toAirport,
          departureDate: state.departureDate,
          returnDate: state.returnDate,
          multiCitySegments: state.multiCitySegments,
          passengers: state.passengers,
          flightClass: state.flightClass,
        },
        locale || "en",
      );
    }

    window.location.href = `/${locale || "en"}`;
  }, [searchParams, locale]);

  const isArabic = locale === "ar";

  return (
    <main
      style={{
        minHeight: "40vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <p>
        {isArabic ? "جاري تحويلك لنتائج الرحلات…" : "Redirecting to flight results…"}
      </p>
    </main>
  );
}
