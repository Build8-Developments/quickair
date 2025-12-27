/**
 * Hajj Data Transformation Utility
 * Transforms raw JSON data from haj-fakher.json into component-friendly structures
 *
 * @module hajDataTransform
 */

/**
 * Service icon mapping for the services section
 */
const SERVICE_ICONS = {
  comfort: "star",
  "vip-lounge": "plane",
  admin: "users",
  train: "train",
  religious: "book",
  programs: "list",
};

/**
 * Transforms a hotel object from JSON to component-friendly format
 * @param {Object} hotelData - Raw hotel data from JSON
 * @returns {Object} Transformed hotel object
 */
const transformHotel = (hotelData) => {
  if (!hotelData) return null;

  const features = [];
  if (hotelData.features) {
    Object.values(hotelData.features).forEach((feature) => {
      if (feature && feature.trim()) {
        features.push(feature.trim());
      }
    });
  }

  return {
    location: hotelData.location || "",
    name: hotelData.hotel || "",
    features,
    nightsDates: hotelData["nights/dates"] || "",
  };
};

/**
 * Transforms pricing data from JSON to component-friendly format
 * @param {Object} pricingData - Raw pricing data from JSON
 * @returns {Object} Transformed pricing object
 */
const transformPricing = (pricingData) => {
  if (!pricingData) return null;

  return {
    doubleRoom: pricingData["person in double room"] || "",
    tripleRoom: pricingData["person in triple room"] || "",
    quadRoom: pricingData["person in quad room"] || "",
    note: pricingData.note || null,
  };
};

/**
 * Transforms ritual data from JSON to component-friendly format
 * @param {Object} ritualData - Raw ritual data from JSON
 * @returns {Object} Transformed ritual object
 */
const transformRitual = (ritualData) => {
  if (!ritualData) return null;

  const features = [];
  if (ritualData.features) {
    // Extract title if present
    const featureTitle = ritualData.features.title || "";

    // Extract numbered features
    Object.entries(ritualData.features).forEach(([key, value]) => {
      if (key !== "title" && value && value.trim()) {
        features.push(value.trim());
      }
    });

    // Add title as first feature if present
    if (featureTitle) {
      features.unshift(featureTitle);
    }
  }

  return {
    title: ritualData.title || "",
    description: ritualData.description || "",
    features: features.length > 0 ? features : undefined,
    imageUrl: ritualData.imageUrl || undefined,
  };
};

/**
 * Transforms VIP package data from JSON to component-friendly format
 * @param {Object} vipData - Raw VIP package data from JSON
 * @returns {Object} Transformed VIP package object
 */
const transformVIPPackage = (vipData) => {
  if (!vipData) return null;

  // Transform hotels
  const hotels = [];
  if (vipData.hotels) {
    Object.values(vipData.hotels).forEach((hotel) => {
      const transformed = transformHotel(hotel);
      if (transformed) hotels.push(transformed);
    });
  }

  // Transform rituals
  const rituals = [];
  if (vipData.rituals?.rituals) {
    vipData.rituals.rituals.forEach((ritual) => {
      const transformed = transformRitual(ritual);
      if (transformed) rituals.push(transformed);
    });
  }

  // Transform VIP features/services
  const features = [];
  if (vipData["services/features"]) {
    Object.values(vipData["services/features"]).forEach((feature) => {
      if (feature && feature.trim()) {
        features.push(feature.trim());
      }
    });
  }

  // Collect notes
  const notes = [];
  if (vipData.note) notes.push(vipData.note);
  if (vipData.note2) notes.push(vipData.note2);
  if (vipData["Luxury level"]?.note) notes.push(vipData["Luxury level"].note);

  return {
    title: vipData.title || "",
    reservationAmount: vipData["Seriousness of reservation"] || "",
    hotels,
    pricing: transformPricing(vipData.pricing),
    rituals,
    notes,
    features,
    luxuryLevelText: vipData["Luxury level"]?.text || "",
  };
};

/**
 * Transforms Distinguished package data from JSON to component-friendly format
 * @param {Object} distinguishedData - Raw Distinguished package data from JSON
 * @returns {Object} Transformed Distinguished package object
 */
const transformDistinguishedPackage = (distinguishedData) => {
  if (!distinguishedData) return null;

  // Transform hotels
  const hotels = [];
  if (distinguishedData.hotels) {
    Object.values(distinguishedData.hotels).forEach((hotel) => {
      const transformed = transformHotel(hotel);
      if (transformed) hotels.push(transformed);
    });
  }

  // Transform rituals
  const rituals = [];
  if (distinguishedData.rituals?.rituals) {
    distinguishedData.rituals.rituals.forEach((ritual) => {
      const transformed = transformRitual(ritual);
      if (transformed) rituals.push(transformed);
    });
  }

  // Collect notes
  const notes = [];
  if (distinguishedData.pricing?.note)
    notes.push(distinguishedData.pricing.note);

  return {
    title: distinguishedData.title || "",
    reservationAmount: distinguishedData["Seriousness of reservation"] || "",
    hotels,
    pricing: transformPricing(distinguishedData.pricing),
    rituals,
    notes,
    features: [], // Distinguished package doesn't have VIP features
  };
};

/**
 * Transforms services data from JSON to component-friendly format
 * @param {Object} jsonData - Raw JSON data
 * @param {boolean} isArabic - Whether the locale is Arabic
 * @returns {Array} Array of transformed service objects
 */
const transformServices = (jsonData, isArabic) => {
  return [
    {
      id: "comfort",
      icon: SERVICE_ICONS.comfort,
      titleAr: "خدمات مميزة",
      titleEn: "Distinguished Services",
      descriptionAr: jsonData["A group of distinguished services"] || "",
      descriptionEn:
        "We strive to provide the highest levels of comfort and luxury for the guests of Allah through our services that ensure them a sacred journey free from any hardship or fatigue",
    },
    {
      id: "vip-lounge",
      icon: SERVICE_ICONS["vip-lounge"],
      titleAr: "صالة كبار الزوار",
      titleEn: "VIP Lounge",
      descriptionAr: jsonData["VIP lounge at Cairo Airport"] || "",
      descriptionEn:
        "We offer you a luxurious and comfortable travel experience through the VIP lounge at Cairo International Airport with services that exceed expectations at a 5-star level",
    },
    {
      id: "admin",
      icon: SERVICE_ICONS.admin,
      titleAr: "إشراف إداري",
      titleEn: "Administrative Supervision",
      descriptionAr: jsonData["Administrative supervision"] || "",
      descriptionEn:
        "We are proud to provide a selection of experienced and highly qualified supervisors to always be by your side throughout your blessed journey, specializing in caring for the elderly and special cases",
    },
    {
      id: "train",
      icon: SERVICE_ICONS.train,
      titleAr: "قطار الحرمين",
      titleEn: "Haramain Train",
      descriptionAr: jsonData["Haramain train"] || "",
      descriptionEn:
        "Transportation from Madinah to Makkah via the Haramain train to provide all means of comfort",
    },
    {
      id: "religious",
      icon: SERVICE_ICONS.religious,
      titleAr: "إشراف ديني",
      titleEn: "Religious Supervision",
      descriptionAr: jsonData["Religious supervision"] || "",
      descriptionEn:
        "Each trip is accompanied by a group of senior Al-Azhar scholars under the supervision of Sheikh Dr. Mahmoud Al-Abidi to ensure the completion of Hajj and Umrah rituals in accordance with Islamic law",
    },
    {
      id: "programs",
      icon: SERVICE_ICONS.programs,
      titleAr: "برامج متعددة",
      titleEn: "Multiple Programs",
      descriptionAr: jsonData["Multiple programs"] || "",
      descriptionEn:
        "The company provides various and multiple Hajj programs suitable for all levels in terms of service level and price, allowing you to choose the most suitable for your needs to make your journey the easiest and most comfortable",
    },
  ];
};

/**
 * Main transformation function - transforms raw JSON data into component-friendly structure
 * @param {Object} jsonData - Raw JSON data from haj-fakher.json
 * @param {string} locale - Current locale ('ar' or 'en')
 * @returns {Object} Transformed data object with hero, services, vipPackage, and distinguishedPackage
 */
export const transformHajData = (jsonData, locale = "ar") => {
  if (!jsonData) {
    return getDefaultHajData(locale);
  }

  return {
    hero: {
      title: jsonData.title || "حج",
      date: jsonData.date || "2026 / 1447هـ",
      subtitle: jsonData.subtitle || "",
    },
    services: transformServices(jsonData, locale === "ar"),
    vipPackage: transformVIPPackage(jsonData["Luxury Hajj programme"]),
    distinguishedPackage: transformDistinguishedPackage(
      jsonData["Distinguished Hajj"]
    ),
  };
};

/**
 * Returns default/fallback data when JSON loading fails
 * @param {string} _locale - Current locale ('ar' or 'en') - reserved for future use
 * @returns {Object} Default data structure
 */
export const getDefaultHajData = (_locale = "ar") => {
  return {
    hero: {
      title: "حج",
      date: "2026 / 1447هـ",
      subtitle: "",
    },
    services: [],
    vipPackage: null,
    distinguishedPackage: null,
  };
};

export default transformHajData;
