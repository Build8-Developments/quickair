/**
 * Currency utility functions
 * Determines the appropriate currency based on location
 */

// Countries that use EGP (Egyptian Pound)
const EGP_COUNTRIES = ["Egypt", "مصر"];

/**
 * Get the appropriate currency based on location country
 * @param {string} country - The country name (in English or Arabic)
 * @param {string} fallbackCurrency - Fallback currency if country doesn't match
 * @returns {string} The currency code (EGP or USD)
 */
export function getCurrencyByCountry(country, fallbackCurrency = "USD") {
  if (!country) return fallbackCurrency;

  // Check if the country is Egypt (in any language)
  const isEgypt = EGP_COUNTRIES.some((egpCountry) =>
    country.toLowerCase().includes(egpCountry.toLowerCase())
  );

  return isEgypt ? "EGP" : fallbackCurrency;
}

/**
 * Get the appropriate currency symbol
 * @param {string} currencyCode - The currency code (EGP, USD, etc.)
 * @returns {string} The currency symbol
 */
export function getCurrencySymbol(currencyCode) {
  const symbols = {
    EGP: "ج.م",
    USD: "$",
    EUR: "€",
    GBP: "£",
    AED: "د.إ",
  };

  return symbols[currencyCode] || currencyCode;
}

/**
 * Format price with appropriate currency
 * @param {number} price - The price value
 * @param {string} currency - The currency code
 * @param {string} locale - The locale for formatting (default: 'en')
 * @returns {string} Formatted price string
 */
export function formatPrice(price, currency = "USD", locale = "en") {
  if (price === null || price === undefined) return "";

  const formattedNumber = price.toLocaleString(
    locale === "ar" ? "ar-EG" : "en-US"
  );

  return `${formattedNumber} ${currency}`;
}

/**
 * Determine currency from hotel option or location
 * Priority: hotelOption.currency > location.country > fallback
 * @param {Object} hotelOption - The hotel option object
 * @param {Object} hotel - The hotel object with location
 * @param {string} fallback - Fallback currency
 * @returns {string} The currency code
 */
export function getHotelCurrency(hotelOption, hotel, fallback = "USD") {
  // First check if hotelOption has currency
  if (hotelOption?.currency) {
    return hotelOption.currency;
  }

  // Then check hotel location country
  if (hotel?.location?.country) {
    return getCurrencyByCountry(hotel.location.country, fallback);
  }

  return fallback;
}
