import airportsData from "@/data/airports.js";

/** Arabic display + search aliases for common routes (IATA → labels) */
const ARABIC_ALIASES = {
  AUH: { city: "أبو ظبي", name: "مطار أبو ظبي الدولي", country: "الإمارات" },
  CAI: { city: "القاهرة", name: "مطار القاهرة الدولي", country: "مصر" },
  DXB: { city: "دبي", name: "مطار دبي الدولي", country: "الإمارات" },
  HRG: { city: "الغردقة", name: "مطار الغردقة الدولي", country: "مصر" },
  SSH: { city: "شرم الشيخ", name: "مطار شرم الشيخ", country: "مصر" },
  ALY: { city: "الإسكندرية", name: "مطار النزهة", country: "مصر" },
  LXR: { city: "الأقصر", name: "مطار الأقصر", country: "مصر" },
  ASW: { city: "أسوان", name: "مطار أسوان", country: "مصر" },
  HBE: { city: "الإسكندرية", name: "مطار برج العرب", country: "مصر" },
  JED: { city: "جدة", name: "مطار الملك عبدالعزيز", country: "السعودية" },
  RUH: { city: "الرياض", name: "مطار الملك خالد", country: "السعودية" },
  DMM: { city: "الدمام", name: "مطار الملك فهد", country: "السعودية" },
  MED: { city: "المدينة", name: "مطار الأمير محمد بن عبدالعزيز", country: "السعودية" },
  IST: { city: "إسطنبول", name: "مطار إسطنبول", country: "تركيا" },
  SAW: { city: "إسطنبول", name: "مطار صبيحة", country: "تركيا" },
  BEY: { city: "بيروت", name: "مطار بيروت", country: "لبنان" },
  AMM: { city: "عمان", name: "مطار الملكة علياء", country: "الأردن" },
  DOH: { city: "الدوحة", name: "مطار حمد الدولي", country: "قطر" },
  KWI: { city: "الكويت", name: "مطار الكويت", country: "الكويت" },
  BAH: { city: "المنامة", name: "مطار البحرين", country: "البحرين" },
  MCT: { city: "مسقط", name: "مطار مسقط", country: "عُمان" },
  LON: { city: "لندن", name: "جميع مطارات لندن", country: "المملكة المتحدة" },
  PAR: { city: "باريس", name: "جميع مطارات باريس", country: "فرنسا" },
  NYC: { city: "نيويورك", name: "جميع مطارات نيويورك", country: "أمريكا" },
  LOS: { city: "لاغوس", name: "مطار لاغوس", country: "نيجيريا" },
  SHJ: { city: "الشارقة", name: "مطار الشارقة", country: "الإمارات" },
  AYT: { city: "أنطاليا", name: "مطار أنطاليا", country: "تركيا" },
  LHR: { city: "لندن", name: "مطار هيثرو", country: "المملكة المتحدة" },
  CDG: { city: "باريس", name: "مطار شارل ديغول", country: "فرنسا" },
  KUL: { city: "كوالالمبور", name: "مطار كوالالمبور", country: "ماليزيا" },
  BKK: { city: "بانكوك", name: "مطار سوفارنابومي", country: "تايلاند" },
  RMF: { city: "مرسى علم", name: "مطار مرسى علم", country: "مصر" },
  ATZ: { city: "أسيوط", name: "مطار أسيوط", country: "مصر" },
};

const POPULAR_IATA = [
  "CAI",
  "HRG",
  "SSH",
  "ALY",
  "HBE",
  "DXB",
  "AUH",
  "JED",
  "RUH",
  "IST",
  "LHR",
  "CDG",
  "BEY",
  "AMM",
  "DOH",
  "KUL",
  "BKK",
  "NYC",
  "LON",
];

function localizeAirport(airport, language = "en") {
  if (language !== "ar") return airport;
  const ar = ARABIC_ALIASES[airport.iata];
  if (!ar) return airport;
  return {
    ...airport,
    name: ar.name || airport.name,
    city: ar.city || airport.city,
    country: ar.country || airport.country,
  };
}

function airportSearchText(airport, language = "en") {
  const localized = localizeAirport(airport, language);
  const ar = ARABIC_ALIASES[airport.iata];
  const parts = [
    localized.name,
    localized.city,
    localized.country,
    airport.iata,
    airport.name,
    airport.city,
    airport.country,
  ];
  if (ar) {
    parts.push(ar.name, ar.city, ar.country);
  }
  return parts.join(" ").toLowerCase();
}

function sortAirports(results, query) {
  const q = query.toLowerCase().trim();
  return [...results].sort((a, b) => {
    const aIata = a.iata.toLowerCase() === q;
    const bIata = b.iata.toLowerCase() === q;
    if (aIata && !bIata) return -1;
    if (!aIata && bIata) return 1;

    const aCity = a.city.toLowerCase().startsWith(q);
    const bCity = b.city.toLowerCase().startsWith(q);
    if (aCity && !bCity) return -1;
    if (!aCity && bCity) return 1;

    return a.city.localeCompare(b.city);
  });
}

/**
 * Search airports from the full static dataset (~88 major airports).
 */
export function searchAirports(searchQuery = "", language = "en", maxResults = 20) {
  const query = (searchQuery || "").trim();

  if (!query) {
    const popular = POPULAR_IATA.map((code) =>
      airportsData.find((a) => a.iata === code),
    ).filter(Boolean);
    return popular
      .slice(0, maxResults)
      .map((a) => localizeAirport(a, language));
  }

  const q = query.toLowerCase();
  const filtered = airportsData.filter((airport) =>
    airportSearchText(airport, language).includes(q),
  );

  return sortAirports(filtered, query)
    .slice(0, maxResults)
    .map((a) => localizeAirport(a, language));
}

export function getPopularAirports(language = "en", maxResults = 20) {
  return searchAirports("", language, maxResults);
}

export function getAirports(language = "en") {
  return airportsData.map((a) => localizeAirport(a, language));
}

export async function preloadAirports() {
  return airportsData;
}

/** Resolve airport by IATA (for URL deep-links); falls back to code-only stub */
export function findAirportByIata(iata, language = "en") {
  if (!iata) return null;
  const code = String(iata).trim().toUpperCase();
  const airport = airportsData.find((a) => a.iata.toUpperCase() === code);
  if (airport) return localizeAirport(airport, language);
  return {
    iata: code,
    name: code,
    city: code,
    country: "",
  };
}
