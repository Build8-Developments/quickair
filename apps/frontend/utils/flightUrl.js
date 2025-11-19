/**
 * Builds the Amadeus Online Suite flight search URL
 * @param {Object} params - Flight search parameters
 * @param {string} params.tripType - Trip type: roundtrip, oneway, or multicity
 * @param {string} params.flightClass - Flight class: Y, W, C, or F
 * @param {Object} params.passengers - Passenger counts { adults, children, infants }
 * @param {Object} params.singleSegment - Single segment for roundtrip/oneway
 * @param {Array} params.multiCitySegments - Array of segments for multicity
 * @returns {string|null} The constructed URL or null if validation fails
 */
export function buildFlightSearchUrl({
  tripType,
  flightClass,
  passengers,
  singleSegment,
  multiCitySegments,
}) {
  const baseUrl = "https://skysync.travel/flight/search";
  const params = new URLSearchParams();

  // Validate passengers
  if (!passengers.adults || passengers.adults < 1) {
    return null;
  }

  try {
    if (tripType === "multicity") {
      // Multi-city trip
      if (!multiCitySegments || multiCitySegments.length < 2) {
        return null;
      }

      // Validate all segments
      for (let i = 0; i < multiCitySegments.length; i++) {
        const segment = multiCitySegments[i];
        if (!segment.from || !segment.to || !segment.departureDate) {
          return null;
        }

        const segNum = i + 1;
        params.append(`dep${segNum}`, segment.from.iata);
        params.append(`ret${segNum}`, segment.to.iata);
        params.append(`dtt${segNum}`, formatDate(segment.departureDate));
        params.append(`cl${segNum}`, flightClass);
      }

      params.append("triptype", "2"); // Multi-city trip type
    } else if (tripType === "roundtrip") {
      // Round trip
      if (
        !singleSegment.from ||
        !singleSegment.to ||
        !singleSegment.departureDate ||
        !singleSegment.returnDate
      ) {
        return null;
      }

      // Outbound flight
      params.append("dep1", singleSegment.from.iata);
      params.append("ret1", singleSegment.to.iata);
      params.append("dtt1", formatDate(singleSegment.departureDate));
      params.append("cl1", flightClass);

      // Return flight
      params.append("dep2", singleSegment.to.iata);
      params.append("ret2", singleSegment.from.iata);
      params.append("dtt2", formatDate(singleSegment.returnDate));
      params.append("cl2", flightClass);

      params.append("triptype", "2"); // Round trip type
    } else if (tripType === "oneway") {
      // One way trip
      if (
        !singleSegment.from ||
        !singleSegment.to ||
        !singleSegment.departureDate
      ) {
        return null;
      }

      params.append("dep1", singleSegment.from.iata);
      params.append("ret1", singleSegment.to.iata);
      params.append("dtt1", formatDate(singleSegment.departureDate));
      params.append("cl1", flightClass);

      params.append("triptype", "1"); // One way trip type
    } else {
      return null;
    }

    // Add passenger counts
    params.append("adult", passengers.adults.toString());
    params.append("child", passengers.children.toString());
    params.append("infant", passengers.infants.toString());

    // Add additional parameters
    params.append("direct", "false");
    params.append("baggage", "false");
    params.append("pft", "");
    params.append("key", "IRT");
    params.append("airlines", "");
    params.append("ref", "false");
    params.append("lc", "EN");
    params.append("curr", "EGP");
    params.append("currtime", Date.now().toString());

    return `${baseUrl}?${params.toString()}`;
  } catch (error) {
    console.error("Error building flight search URL:", error);
    return null;
  }
}

/**
 * Formats a date object or date string to DD-MMM-YYYY format
 * @param {Date|string|object} date - Date to format (can be Date object, string, or date-picker object)
 * @returns {string} Formatted date string (e.g., "19-Nov-2025")
 */
function formatDate(date) {
  if (!date) return "";

  let dateObj;

  // Handle react-multi-date-picker DateObject
  if (date && typeof date === "object" && date.format) {
    return date.format("DD-MMM-YYYY");
  }

  // Handle Date object or string
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === "string") {
    dateObj = new Date(date);
  } else if (typeof date === "object" && date.year && date.month) {
    // Handle date object with year, month, day properties
    dateObj = new Date(date.year, date.month.number - 1, date.day);
  } else {
    return "";
  }

  const months = [
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

  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`;
}
