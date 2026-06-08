import { findAirportByIata } from "@/lib/airportSearch";

export const FLIGHT_SEARCH_BASE_URL =
  process.env.NEXT_PUBLIC_FLIGHT_SEARCH_URL ||
  "https://www.skysync.travel/flight/search";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Formats a date for SkySync (e.g. "8-Jun-2026")
 */
export function formatFlightDate(date) {
  if (!date) return "";

  if (typeof date === "object" && typeof date.format === "function") {
    return date.format("D-MMM-YYYY");
  }

  if (typeof date === "object" && date.year && date.month) {
    const monthIndex =
      typeof date.month === "object" ? date.month.number - 1 : date.month - 1;
    const dateObj = new Date(date.year, monthIndex, date.day);
    return `${dateObj.getDate()}-${MONTHS[dateObj.getMonth()]}-${dateObj.getFullYear()}`;
  }

  const dateObj = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(dateObj.getTime())) return "";

  return `${dateObj.getDate()}-${MONTHS[dateObj.getMonth()]}-${dateObj.getFullYear()}`;
}

function parseSkySyncDate(value) {
  if (!value) return null;
  const match = String(value).match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (match) {
    const monthIndex = MONTHS.findIndex(
      (m) => m.toLowerCase() === match[2].toLowerCase(),
    );
    if (monthIndex >= 0) {
      return new Date(Number(match[3]), monthIndex, Number(match[1]));
    }
  }
  const iso = new Date(value);
  return Number.isNaN(iso.getTime()) ? null : iso;
}

function parseIsoDate(value) {
  if (!value) return null;
  const d = new Date(`${value}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function segmentDate(segment) {
  return segment?.date ?? segment?.departureDate ?? null;
}

function emptyErrors() {
  return {
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    sameCity: "",
    multiCity: {},
  };
}

function t(language, ar, en) {
  return language === "ar" ? ar : en;
}

/**
 * Validates flight search form state. Returns { valid, errors }.
 */
export function validateFlightSearch({
  tripType,
  fromAirport,
  toAirport,
  departureDate,
  returnDate,
  multiCitySegments = [],
  passengers,
  language = "en",
}) {
  const errors = emptyErrors();
  let valid = true;

  if (!passengers?.adults || passengers.adults < 1) {
    valid = false;
  }

  if (tripType === "multicity") {
    const validSegments = multiCitySegments.filter(
      (seg) => seg.from && seg.to && segmentDate(seg),
    );

    multiCitySegments.forEach((seg, index) => {
      const segmentErrors = [];
      if (!seg.from) {
        segmentErrors.push(t(language, "المدينة مطلوبة", "City required"));
      }
      if (!seg.to) {
        segmentErrors.push(t(language, "المدينة مطلوبة", "City required"));
      }
      if (!segmentDate(seg)) {
        segmentErrors.push(t(language, "التاريخ مطلوب", "Date required"));
      }
      if (seg.from && seg.to && seg.from.iata === seg.to.iata) {
        segmentErrors.push(
          t(language, "يرجى اختيار مدينة مختلفة", "Cities must be different"),
        );
      }
      if (segmentErrors.length > 0) {
        errors.multiCity[index] = segmentErrors.join(", ");
        valid = false;
      }
    });

    if (validSegments.length < 2) {
      errors.multiCity.general = t(
        language,
        "يرجى ملء رحلتين على الأقل",
        "Please fill in at least 2 flights",
      );
      valid = false;
    }

    return { valid, errors };
  }

  if (!fromAirport) {
    errors.from = t(language, "هذا الحقل مطلوب", "This field is required");
    valid = false;
  }
  if (!toAirport) {
    errors.to = t(language, "هذا الحقل مطلوب", "This field is required");
    valid = false;
  }
  if (!departureDate) {
    errors.departureDate = t(language, "هذا الحقل مطلوب", "This field is required");
    valid = false;
  }
  if (tripType === "roundtrip" && !returnDate) {
    errors.returnDate = t(language, "هذا الحقل مطلوب", "This field is required");
    valid = false;
  }
  if (fromAirport && toAirport && fromAirport.iata === toAirport.iata) {
    errors.sameCity = t(
      language,
      "يرجى اختيار مدينة مختلفة للوصول",
      "Departure and arrival cities must be different",
    );
    valid = false;
  }

  return { valid, errors };
}

/**
 * Builds the SkySync flight search URL (same format as before).
 */
export function buildFlightSearchUrl({
  tripType,
  flightClass = "Y",
  passengers,
  language = "en",
  singleSegment,
  multiCitySegments,
  currency = "EGP",
  tracking = true,
}) {
  if (!passengers?.adults || passengers.adults < 1) return null;

  const params = new URLSearchParams();

  try {
    if (tripType === "multicity") {
      const segments = (multiCitySegments || []).filter(
        (seg) => seg.from && seg.to && segmentDate(seg),
      );
      if (segments.length < 2) return null;

      segments.forEach((segment, i) => {
        const segNum = i + 1;
        params.append(`dep${segNum}`, segment.from.iata);
        params.append(`ret${segNum}`, segment.to.iata);
        params.append(`dtt${segNum}`, formatFlightDate(segmentDate(segment)));
        params.append(`cl${segNum}`, flightClass);
      });
      params.append("triptype", "3");
      params.append("key", "NMC");
    } else if (tripType === "roundtrip") {
      const seg = singleSegment || {};
      if (!seg.from || !seg.to || !seg.departureDate || !seg.returnDate) {
        return null;
      }

      params.append("dep1", seg.from.iata);
      params.append("ret1", seg.to.iata);
      params.append("dtt1", formatFlightDate(seg.departureDate));
      params.append("cl1", flightClass);

      params.append("dep2", seg.to.iata);
      params.append("ret2", seg.from.iata);
      params.append("dtt2", formatFlightDate(seg.returnDate));
      params.append("cl2", flightClass);

      params.append("triptype", "2");
      params.append("key", "IRT");
    } else if (tripType === "oneway") {
      const seg = singleSegment || {};
      if (!seg.from || !seg.to || !seg.departureDate) return null;

      params.append("dep1", seg.from.iata);
      params.append("ret1", seg.to.iata);
      params.append("dtt1", formatFlightDate(seg.departureDate));
      params.append("cl1", flightClass);
      params.append("triptype", "1");
      params.append("key", "OW");
    } else {
      return null;
    }

    params.append("adult", String(passengers.adults));
    params.append("child", String(passengers.children || 0));
    params.append("infant", String(passengers.infants || 0));
    params.append("direct", "false");
    params.append("baggage", "false");
    params.append("pft", "");
    params.append("airlines", "");
    params.append("ref", "false");
    params.append("lc", (language || "en").toUpperCase());
    params.append("curr", currency);
    params.append("currtime", String(Date.now()));

    if (tracking) {
      params.append("utm_source", "quickair");
      params.append("utm_medium", "flight_search");
      params.append("utm_campaign", "website");
    }

    return `${FLIGHT_SEARCH_BASE_URL}?${params.toString()}`;
  } catch (error) {
    console.error("Error building flight search URL:", error);
    return null;
  }
}

export function openFlightSearch(url, { target = "_blank" } = {}) {
  if (!url) return false;
  window.open(url, target, "noopener,noreferrer");
  return true;
}

/**
 * Build SkySync URL directly from query string (pass-through / share links).
 * Example: /en/flights/search?dep1=CAI&ret1=AUH&dtt1=8-Jun-2026&...
 */
export function buildFlightSearchUrlFromQuery(searchParams) {
  if (!searchParams) return null;

  const get = (key) => {
    if (typeof searchParams.get === "function") return searchParams.get(key);
    return searchParams[key] ?? null;
  };

  if (!get("dep1")) return null;

  const allowed = [
    "dep1",
    "ret1",
    "dtt1",
    "cl1",
    "dep2",
    "ret2",
    "dtt2",
    "cl2",
    "dep3",
    "ret3",
    "dtt3",
    "cl3",
    "dep4",
    "ret4",
    "dtt4",
    "cl4",
    "triptype",
    "key",
    "adult",
    "child",
    "infant",
    "direct",
    "baggage",
    "pft",
    "airlines",
    "ref",
    "lc",
    "curr",
    "currtime",
  ];

  const params = new URLSearchParams();
  allowed.forEach((key) => {
    const value = get(key);
    if (value) params.set(key, value);
  });

  if (!params.has("currtime")) params.set("currtime", String(Date.now()));
  if (!params.has("lc")) params.set("lc", "EN");
  if (!params.has("curr")) params.set("curr", "EGP");
  if (!params.has("utm_source")) params.set("utm_source", "quickair");

  return `${FLIGHT_SEARCH_BASE_URL}?${params.toString()}`;
}

/**
 * Friendly URL → form prefill state.
 * /en?from=CAI&to=AUH&depart=2026-06-08&return=2026-06-18&trip=roundtrip&go=1
 */
export function getFlightFormStateFromUrl(searchParams, language = "en") {
  if (!searchParams) return null;

  const get = (key) => {
    if (typeof searchParams.get === "function") return searchParams.get(key);
    return searchParams[key] ?? null;
  };

  // SkySync-native params on homepage → redirect style
  if (get("dep1") && !get("from")) {
    const triptype = get("triptype");
    const tripType =
      triptype === "3"
        ? "multicity"
        : triptype === "1"
          ? "oneway"
          : "roundtrip";

    const state = {
      tripType,
      fromAirport: findAirportByIata(get("dep1"), language),
      toAirport: findAirportByIata(get("ret1"), language),
      departureDate: parseSkySyncDate(get("dtt1")),
      returnDate: parseSkySyncDate(get("dtt2")),
      passengers: {
        adults: Math.max(1, Number(get("adult")) || 1),
        children: Number(get("child")) || 0,
        infants: Number(get("infant")) || 0,
      },
      flightClass: get("cl1") || "Y",
      autoSearch: get("go") === "1" || get("search") === "1",
    };

    if (tripType === "multicity") {
      const segments = [];
      for (let i = 1; i <= 4; i++) {
        const dep = get(`dep${i}`);
        const ret = get(`ret${i}`);
        const dtt = get(`dtt${i}`);
        if (dep && ret && dtt) {
          segments.push({
            from: findAirportByIata(dep, language),
            to: findAirportByIata(ret, language),
            date: parseSkySyncDate(dtt),
          });
        }
      }
      state.multiCitySegments =
        segments.length >= 2
          ? segments
          : [
              { from: null, to: null, date: null },
              { from: null, to: null, date: null },
            ];
    }

    return state;
  }

  const from = get("from");
  const to = get("to");
  const depart = get("depart") || get("departure");
  const ret = get("return") || get("returnDate");
  const trip = get("trip") || get("triptype");

  if (!from && !to && !depart) return null;

  const tripType =
    trip === "oneway" || trip === "1"
      ? "oneway"
      : trip === "multicity" || trip === "3"
        ? "multicity"
        : "roundtrip";

  return {
    tripType,
    fromAirport: from ? findAirportByIata(from, language) : null,
    toAirport: to ? findAirportByIata(to, language) : null,
    departureDate: parseIsoDate(depart) || parseSkySyncDate(depart),
    returnDate: parseIsoDate(ret) || parseSkySyncDate(ret),
    passengers: {
      adults: Math.max(1, Number(get("adults") || get("adult")) || 1),
      children: Number(get("children") || get("child")) || 0,
      infants: Number(get("infants") || get("infant")) || 0,
    },
    flightClass: get("class") || get("cl1") || "Y",
    autoSearch: get("go") === "1" || get("search") === "1",
  };
}

/**
 * Validate + build + open in one step (used by Hero3 & FlightSearch).
 */
export function submitFlightSearch(form, language = "en") {
  const {
    tripType,
    fromAirport,
    toAirport,
    departureDate,
    returnDate,
    multiCitySegments,
    passengers,
    flightClass,
  } = form;

  const validation = validateFlightSearch({
    tripType,
    fromAirport,
    toAirport,
    departureDate,
    returnDate,
    multiCitySegments,
    passengers,
    language,
  });

  if (!validation.valid) {
    return { ok: false, errors: validation.errors, url: null };
  }

  const url = buildFlightSearchUrl({
    tripType,
    flightClass,
    passengers,
    language,
    singleSegment: { from: fromAirport, to: toAirport, departureDate, returnDate },
    multiCitySegments,
  });

  if (!url) {
    return {
      ok: false,
      errors: validation.errors,
      url: null,
    };
  }

  openFlightSearch(url);
  return { ok: true, errors: emptyErrors(), url };
}
