// Hardcoded airport data
const AIRPORTS_DATA = {
  en: [
    {
      iata: "AUH",
      name: "Abu Dhabi International Airport",
      city: "Abu Dhabi",
      country: "United Arab Emirates",
      countryCode: "AE",
    },
    {
      iata: "CAI",
      name: "Cairo International Airport",
      city: "Cairo",
      country: "Egypt",
      countryCode: "EG",
    },
    {
      iata: "DXB",
      name: "Dubai International Airport",
      city: "Dubai",
      country: "United Arab Emirates",
      countryCode: "AE",
    },
    {
      iata: "LON",
      name: "London All Airports",
      city: "London",
      country: "United Kingdom",
      countryCode: "GB",
    },
    {
      iata: "LOS",
      name: "Murtala Muhammed International Airport",
      city: "Lagos",
      country: "Nigeria",
      countryCode: "NG",
    },
    {
      iata: "NYC",
      name: "All airports",
      city: "New York",
      country: "United States Of America",
      countryCode: "US",
    },
    {
      iata: "PAR",
      name: "All Airports",
      city: "Paris",
      country: "France",
      countryCode: "FR",
    },
    {
      iata: "RUH",
      name: "King Khalid International Airport",
      city: "Riyadh",
      country: "Saudi Arabia",
      countryCode: "SA",
    },
  ],
  ar: [
    {
      iata: "AUH",
      name: "مطار أبو ظبي الدولي",
      city: "أبو ظبي",
      country: "الإمارات العربية المتحدة",
      countryCode: "AE",
    },
    {
      iata: "CAI",
      name: "مطار القاهرة الدولي",
      city: "القاهرة",
      country: "مصر",
      countryCode: "EG",
    },
    {
      iata: "DXB",
      name: "مطار دبي الدولي",
      city: "دبي",
      country: "الإمارات العربية المتحدة",
      countryCode: "AE",
    },
    {
      iata: "LON",
      name: "لندن جميع المطارات",
      city: "لندن",
      country: "المملكة المتحدة",
      countryCode: "GB",
    },
    {
      iata: "LOS",
      name: "مطار مورتالا محمد الدولي",
      city: "لاغوس",
      country: "نيجيريا",
      countryCode: "NG",
    },
    {
      iata: "NYC",
      name: "جميع المطارات",
      city: "نيويورك",
      country: "الولايات المتحدة الأمريكية",
      countryCode: "US",
    },
    {
      iata: "PAR",
      name: "جميع المطارات",
      city: "باريس",
      country: "فرنسا",
      countryCode: "FR",
    },
    {
      iata: "RUH",
      name: "مطار الملك خالد الدولي",
      city: "الرياض",
      country: "المملكة العربية السعودية",
      countryCode: "SA",
    },
  ],
};

/**
 * Get airports for a specific language
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {Array} Array of airport objects
 */
export function getAirports(language = "en") {
  return AIRPORTS_DATA[language] || AIRPORTS_DATA.en;
}

/**
 * Search airports from hardcoded data
 * @param {string} searchQuery - Search term (city, airport code, etc.)
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {Array} Array of filtered airport objects
 */
export function searchAirports(searchQuery, language = "en") {
  const airports = getAirports(language);

  if (!searchQuery || searchQuery.length === 0) {
    return airports;
  }

  // Filter based on search query
  const query = searchQuery.toLowerCase();
  const filtered = airports.filter(
    (airport) =>
      airport.city.toLowerCase().includes(query) ||
      airport.iata.toLowerCase().includes(query) ||
      airport.name.toLowerCase().includes(query) ||
      airport.country.toLowerCase().includes(query)
  );

  return filtered;
}
