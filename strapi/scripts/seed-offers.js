#!/usr/bin/env node

/**
 * Seed script to import offer data from JSON files to Strapi with i18n support
 * Uses Strapi's internal Document Service API
 *
 * Usage: node scripts/seed-offers.js
 */

const fs = require("fs");
const path = require("path");

// Directories
const JSON_FILES_DIR_EN = path.join(
  __dirname,
  "..",
  "..",
  "docs",
  "offers",
  "json"
);
const JSON_FILES_DIR_AR = path.join(
  __dirname,
  "..",
  "..",
  "docs",
  "offers",
  "json",
  "ar"
);
const PDF_FILES_DIR = path.join(__dirname, "..", "..", "docs", "offers");

// PDF file mapping
const PDF_MAPPING = {
  bali: "bali.pdf",
  beirut: "Beirut.pdf",
  dahab: "dahab.pdf",
  hurgada: "hurgada.pdf",
  Istanbul: "Istanbul.pdf",
  sharm: "Sharm.pdf",
  sokhna: "ElSokhna.pdf",
  "Sahl-Hasheesh": "Sahl-Hasheesh.pdf",
};

// Location mapping
const LOCATION_MAPPING = {
  bali: {
    en: {
      name: "Bali",
      country: "Indonesia",
      description: "Discover the beauty of Bali",
      shortDescription: "Tropical paradise",
    },
    ar: {
      name: "بالي",
      country: "إندونيسيا",
      description: "اكتشف جمال بالي",
      shortDescription: "جنة استوائية",
    },
    type: "Island",
  },
  Istanbul: {
    en: {
      name: "Istanbul",
      country: "Turkey",
      description: "Experience Istanbul magic",
      shortDescription: "East meets West",
    },
    ar: {
      name: "إسطنبول",
      country: "تركيا",
      description: "اختبر سحر إسطنبول",
      shortDescription: "الشرق يلتقي الغرب",
    },
    type: "City",
  },
  sharm: {
    en: {
      name: "Sharm El Sheikh",
      country: "Egypt",
      description: "Relax at Sharm beaches",
      shortDescription: "Red Sea paradise",
    },
    ar: {
      name: "شرم الشيخ",
      country: "مصر",
      description: "استرخِ على شواطئ شرم",
      shortDescription: "جنة البحر الأحمر",
    },
    type: "Beach",
  },
  beirut: {
    en: {
      name: "Beirut",
      country: "Lebanon",
      description: "Explore vibrant Beirut",
      shortDescription: "Paris of Middle East",
    },
    ar: {
      name: "بيروت",
      country: "لبنان",
      description: "استكشف بيروت",
      shortDescription: "باريس الشرق",
    },
    type: "City",
  },
  hurgada: {
    en: {
      name: "Hurghada",
      country: "Egypt",
      description: "Enjoy Hurghada resorts",
      shortDescription: "Diving destination",
    },
    ar: {
      name: "الغردقة",
      country: "مصر",
      description: "استمتع بمنتجعات الغردقة",
      shortDescription: "وجهة الغوص",
    },
    type: "Beach",
  },
  sokhna: {
    en: {
      name: "El Sokhna",
      country: "Egypt",
      description: "Escape to El Sokhna",
      shortDescription: "Cairo beach getaway",
    },
    ar: {
      name: "العين السخنة",
      country: "مصر",
      description: "اهرب إلى السخنة",
      shortDescription: "شاطئ القاهرة",
    },
    type: "Beach",
  },
  "Sahl-Hasheesh": {
    en: {
      name: "Sahl Hasheesh",
      country: "Egypt",
      description: "Luxury at Sahl Hasheesh",
      shortDescription: "Exclusive resort",
    },
    ar: {
      name: "سهل حشيش",
      country: "مصر",
      description: "الفخامة في سهل حشيش",
      shortDescription: "منتجع حصري",
    },
    type: "Beach",
  },
  dahab: {
    en: {
      name: "Dahab",
      country: "Egypt",
      description: "Discover the magic of Dahab",
      shortDescription: "Diving paradise",
    },
    ar: {
      name: "دهب",
      country: "مصر",
      description: "اكتشف سحر دهب",
      shortDescription: "جنة الغوص",
    },
    type: "Beach",
  },
};

const MEAL_PLAN_MAPPING = {
  Breakfast: { en: "Breakfast", ar: "إفطار" },
  "Half Board": { en: "Half Board", ar: "نصف إقامة" },
  "All Inclusive": { en: "All Inclusive", ar: "إقامة شاملة" },
};

function normalizeMealPlan(name) {
  if (!name) return MEAL_PLAN_MAPPING["Breakfast"];
  const lowerName = (name || "").toLowerCase();
  if (lowerName.includes("all inclusive") || (name || "").includes("شاملة"))
    return MEAL_PLAN_MAPPING["All Inclusive"];
  if (lowerName.includes("half board") || lowerName.includes("dinner"))
    return MEAL_PLAN_MAPPING["Half Board"];
  return MEAL_PLAN_MAPPING["Breakfast"];
}

// Store created entities: { key: { en: documentId, ar: documentId } }
const createdEntities = {
  locations: {},
  mealPlans: {},
  hotels: {},
  offers: {},
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function parseStarRating(ratingStr) {
  if (!ratingStr) return 3;
  const match = ratingStr.match(/(\d)/);
  return match ? parseInt(match[1]) : 3;
}

function loadJsonFile(filename, locale = "en") {
  const baseDir = locale === "ar" ? JSON_FILES_DIR_AR : JSON_FILES_DIR_EN;
  const filePath = path.join(baseDir, filename);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf8").trim();
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

/**
 * Upload PDF file - copies to uploads folder and creates DB entry
 */
async function uploadPdfFile(strapi, locationKey) {
  const pdfFilename = PDF_MAPPING[locationKey];
  if (!pdfFilename) {
    console.log(`  No PDF mapping for: ${locationKey}`);
    return null;
  }

  const pdfPath = path.join(PDF_FILES_DIR, pdfFilename);
  if (!fs.existsSync(pdfPath)) {
    console.log(`  PDF not found: ${pdfFilename}`);
    return null;
  }

  // Check if already uploaded
  const existing = await strapi.db.query("plugin::upload.file").findMany({
    where: { name: { $eq: pdfFilename } },
  });

  if (existing?.length > 0) {
    console.log(`  PDF exists: ${pdfFilename}`);
    return existing[0].id;
  }

  try {
    const fileStats = fs.statSync(pdfPath);

    // Copy file to uploads folder
    const uploadsDir = path.join(__dirname, "..", "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    fs.copyFileSync(pdfPath, path.join(uploadsDir, pdfFilename));

    // Create file entry directly in database
    const result = await strapi.db.query("plugin::upload.file").create({
      data: {
        name: pdfFilename,
        alternativeText: pdfFilename.replace(".pdf", ""),
        caption: pdfFilename.replace(".pdf", ""),
        hash: `pdf_${locationKey}_${Date.now()}`,
        ext: ".pdf",
        mime: "application/pdf",
        size: parseFloat((fileStats.size / 1024).toFixed(2)),
        url: `/uploads/${pdfFilename}`,
        provider: "local",
      },
    });

    if (result) {
      console.log(`  Uploaded PDF: ${pdfFilename}`);
      return result.id;
    }
  } catch (error) {
    console.log(`  PDF upload failed: ${error.message}`);
  }

  return null;
}

/**
 * Create location for a specific locale
 * If existingDocumentId is provided, creates a localization of that document
 */
async function createLocationForLocale(
  strapi,
  locationKey,
  locale,
  existingDocumentId = null
) {
  const locationData = LOCATION_MAPPING[locationKey];
  if (!locationData) return null;

  const localeData = locationData[locale];
  const slug = slugify(locationData.en.name);

  // Check if this locale version already exists
  const existing = await strapi.documents("api::location.location").findMany({
    filters: { slug: { $eq: slug } },
    locale: locale,
  });

  if (existing?.length > 0) {
    console.log(
      `  Location exists (${locale.toUpperCase()}): ${localeData.name}`
    );
    return existing[0].documentId;
  }

  // If we have an existing documentId, create a localization using update
  if (existingDocumentId) {
    const result = await strapi.documents("api::location.location").update({
      documentId: existingDocumentId,
      data: {
        name: localeData.name,
        slug: slug,
        country: localeData.country,
        type: locationData.type,
        description: localeData.description,
        shortDescription: localeData.shortDescription,
        featured: true,
      },
      locale: locale,
      status: "published",
    });

    console.log(
      `  Created location localization (${locale.toUpperCase()}): ${localeData.name}`
    );
    return result.documentId;
  }

  // Create new document (first locale)
  const result = await strapi.documents("api::location.location").create({
    data: {
      name: localeData.name,
      slug: slug,
      country: localeData.country,
      type: locationData.type,
      description: localeData.description,
      shortDescription: localeData.shortDescription,
      featured: true,
    },
    locale: locale,
    status: "published",
  });

  console.log(
    `  Created location (${locale.toUpperCase()}): ${localeData.name}`
  );
  return result.documentId;
}

/**
 * Create meal plan for a specific locale
 * If existingDocumentId is provided, creates a localization of that document
 */
async function createMealPlanForLocale(
  strapi,
  mealPlanName,
  locale,
  existingDocumentId = null
) {
  const normalized = normalizeMealPlan(mealPlanName);
  const localeName = normalized[locale];

  const existing = await strapi.documents("api::meal-plan.meal-plan").findMany({
    filters: { name: { $eq: localeName } },
    locale: locale,
  });

  if (existing?.length > 0) {
    console.log(`  Meal plan exists (${locale.toUpperCase()}): ${localeName}`);
    return existing[0].documentId;
  }

  // If we have an existing documentId, create a localization using update
  if (existingDocumentId) {
    const result = await strapi.documents("api::meal-plan.meal-plan").update({
      documentId: existingDocumentId,
      data: { name: localeName },
      locale: locale,
    });

    console.log(
      `  Created meal plan localization (${locale.toUpperCase()}): ${localeName}`
    );
    return result.documentId;
  }

  // Create new document (first locale)
  const result = await strapi.documents("api::meal-plan.meal-plan").create({
    data: { name: localeName },
    locale: locale,
  });

  console.log(`  Created meal plan (${locale.toUpperCase()}): ${localeName}`);
  return result.documentId;
}

/**
 * Create hotel for a specific locale
 * If existingDocumentId is provided, creates a localization of that document
 */
async function createHotelForLocale(
  strapi,
  hotelData,
  locationDocumentId,
  locale,
  existingDocumentId = null
) {
  const hotelName = hotelData.hotel_name;
  const slug = slugify(hotelName);
  const stars = parseStarRating(hotelData.rating);
  // Get image URL from either 'img' or 'image' field
  const externalImageUrl = hotelData.img || hotelData.image || null;

  const existing = await strapi.documents("api::hotel.hotel").findMany({
    filters: { slug: { $eq: slug } },
    locale: locale,
  });

  if (existing?.length > 0) {
    console.log(`  Hotel exists (${locale.toUpperCase()}): ${hotelName}`);
    return existing[0].documentId;
  }

  const shortDesc =
    locale === "ar"
      ? `فندق ${stars} نجوم${hotelData.area ? ` في ${hotelData.area}` : ""}`
      : `${stars}-star hotel${hotelData.area ? ` in ${hotelData.area}` : ""}`;

  const hotelCreateData = {
    name: hotelName,
    slug: slug,
    stars: stars,
    location: locationDocumentId,
    shortDescription: shortDesc,
    featured: stars >= 4,
  };

  // Add external image URL if available
  if (externalImageUrl) {
    hotelCreateData.externalImageUrl = externalImageUrl;
  }

  // If we have an existing documentId, create a localization using update
  if (existingDocumentId) {
    const result = await strapi.documents("api::hotel.hotel").update({
      documentId: existingDocumentId,
      data: hotelCreateData,
      locale: locale,
      status: "published",
    });

    console.log(
      `  Created hotel localization (${locale.toUpperCase()}): ${hotelName}${externalImageUrl ? " (with image)" : ""}`
    );
    return result.documentId;
  }

  // Create new document (first locale)
  const result = await strapi.documents("api::hotel.hotel").create({
    data: hotelCreateData,
    locale: locale,
    status: "published",
  });

  console.log(
    `  Created hotel (${locale.toUpperCase()}): ${hotelName}${externalImageUrl ? " (with image)" : ""}`
  );
  return result.documentId;
}

// Helper functions
function determineCurrency(hotelData, jsonData) {
  if (hotelData.prices_egp) return "EGP";
  if (hotelData.prices_usd || hotelData.price_usd) return "USD";
  return jsonData.offer?.currency || "USD";
}

function buildRoomPricing(hotelData) {
  const roomType = hotelData.room_type || "Standard Room";
  if (hotelData.prices_egp) {
    return [
      {
        roomType,
        singleOccupancyPrice: hotelData.prices_egp.single,
        doubleOccupancyPrice: hotelData.prices_egp.double,
        tripleOccupancyPrice: hotelData.prices_egp.triple,
      },
    ];
  } else if (hotelData.prices_usd) {
    return [
      {
        roomType,
        singleOccupancyPrice: hotelData.prices_usd.single,
        doubleOccupancyPrice:
          hotelData.prices_usd.double_or_triple || hotelData.prices_usd.double,
        tripleOccupancyPrice: hotelData.prices_usd.double_or_triple,
      },
    ];
  } else if (hotelData.price_usd) {
    return [{ roomType, doubleOccupancyPrice: hotelData.price_usd }];
  }
  return [];
}

function transformHotelOption(
  hotelData,
  hotelDocumentId,
  mealPlanDocumentId,
  jsonData
) {
  return {
    hotel: hotelDocumentId,
    nights: jsonData.offer?.duration?.nights || 3,
    mealPlan: mealPlanDocumentId,
    currency: determineCurrency(hotelData, jsonData),
    roomPricing: buildRoomPricing(hotelData),
    available: true,
    notes: hotelData.valid_dates || hotelData.valid_until || null,
  };
}

function transformInclusions(included) {
  return Array.isArray(included) ? included.map((item) => ({ item })) : [];
}

function transformExclusions(notIncluded) {
  return Array.isArray(notIncluded)
    ? notIncluded.map((item) => ({ item }))
    : [];
}

function transformOptionalTrips(optionalTours, currency = "USD") {
  if (!Array.isArray(optionalTours)) return [];
  return optionalTours.map((tour) => ({
    title: tour.name,
    description: tour.highlights ? tour.highlights.join(", ") : null,
    pricePerPerson: tour.price_per_person_usd || tour.price_usd || 0,
    currency,
    inclusions: tour.highlights
      ? tour.highlights.map((h) => ({ item: h }))
      : [],
  }));
}

function getValidityMonth(validity) {
  if (!validity) return "November";
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const validityStr = Array.isArray(validity) ? validity[0] : validity;
  for (const month of months) {
    if (validityStr.includes(month)) return month;
  }
  return "November";
}

function buildPoliciesText(jsonData, locale = "en") {
  const parts = [];
  if (jsonData.notes?.length) {
    parts.push(locale === "ar" ? "**ملاحظات:**" : "**Notes:**");
    jsonData.notes.forEach((note) => parts.push(`- ${note}`));
  }
  return parts.join("\n") || null;
}

/**
 * Create offer for a specific locale
 * If existingDocumentId is provided, creates a localization of that document
 */
async function createOfferForLocale(
  strapi,
  jsonData,
  locationKey,
  hotelOptions,
  pdfFileId,
  locale,
  existingDocumentId = null
) {
  const locationData = LOCATION_MAPPING[locationKey];
  const offerTitle =
    jsonData.offer?.title || `${locationData?.en?.name || locationKey} Offer`;
  const offerSlug = slugify(
    offerTitle.replace(/[^\w\s-]/g, "").trim() || locationKey
  );

  const existing = await strapi.documents("api::offer.offer").findMany({
    filters: { slug: { $eq: offerSlug } },
    locale: locale,
  });

  if (existing?.length > 0) {
    console.log(`  Offer exists (${locale.toUpperCase()}): ${offerTitle}`);
    return existing[0].documentId;
  }

  const locationDocumentId = createdEntities.locations[locationKey]?.en; // Always use the same documentId

  const offerData = {
    title: offerTitle,
    slug: offerSlug,
    description:
      jsonData.offer?.description ||
      `Discover ${locationData?.[locale]?.name || locationKey}`,
    location: locationDocumentId,
    month: getValidityMonth(jsonData.offer?.validity),
    year: "2024",
    hotelOptions: hotelOptions,
    inclusions: transformInclusions(jsonData.included),
    exclusions: transformExclusions(jsonData.not_included),
    optionalTrips: transformOptionalTrips(jsonData.optional_tours),
    policies: buildPoliciesText(jsonData, locale),
  };

  if (pdfFileId) {
    offerData.pdfFile = pdfFileId;
  }

  // If we have an existing documentId, create a localization using update
  if (existingDocumentId) {
    const result = await strapi.documents("api::offer.offer").update({
      documentId: existingDocumentId,
      data: offerData,
      locale: locale,
      status: "published",
    });

    console.log(
      `  Created offer localization (${locale.toUpperCase()}): ${offerTitle}`
    );
    return result.documentId;
  }

  // Create new document (first locale)
  const result = await strapi.documents("api::offer.offer").create({
    data: offerData,
    locale: locale,
    status: "published",
  });

  console.log(`  Created offer (${locale.toUpperCase()}): ${offerTitle}`);
  return result.documentId;
}

/**
 * Process a single location/offer - creates EN first, then AR as localizations
 */
async function processLocation(strapi, filename) {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`Processing: ${filename}`);
  console.log("=".repeat(50));

  const locationKey = filename.replace(".json", "");
  const enData = loadJsonFile(filename, "en");
  const arData = loadJsonFile(filename, "ar");

  if (!enData) {
    console.log(`  Skipping: No EN data`);
    return;
  }

  // Initialize storage only if not already initialized
  if (!createdEntities.locations[locationKey])
    createdEntities.locations[locationKey] = {};
  if (!createdEntities.mealPlans[locationKey])
    createdEntities.mealPlans[locationKey] = {};
  if (!createdEntities.hotels[locationKey])
    createdEntities.hotels[locationKey] = {};
  if (!createdEntities.offers[locationKey])
    createdEntities.offers[locationKey] = {};

  // ========== PHASE 1: Create all EN entities ==========
  console.log("\n--- Creating EN entities ---");

  // 1. Location EN
  const locationEnId = await createLocationForLocale(strapi, locationKey, "en");
  createdEntities.locations[locationKey].en = locationEnId;

  // 2. Meal plans EN - store by normalized key
  const mealPlanName = enData.offer?.meal_plan || "Breakfast";
  const normalizedMealPlan = normalizeMealPlan(mealPlanName);
  const mealPlanKey = normalizedMealPlan.en; // Use EN name as key
  if (!createdEntities.mealPlans[mealPlanKey]) {
    createdEntities.mealPlans[mealPlanKey] = {};
  }
  const mealPlanEnId = await createMealPlanForLocale(
    strapi,
    mealPlanName,
    "en"
  );
  createdEntities.mealPlans[mealPlanKey].en = mealPlanEnId;

  // 3. Hotels EN and build hotel options
  const hotelOptionsEn = [];
  if (enData.hotels?.length) {
    for (const hotelData of enData.hotels) {
      const hotelEnId = await createHotelForLocale(
        strapi,
        hotelData,
        locationEnId,
        "en"
      );

      // Handle hotel-specific meal plan
      const hotelMealPlanName = hotelData.meal_plan || mealPlanName;
      const hotelNormalizedMealPlan = normalizeMealPlan(hotelMealPlanName);
      const hotelMealPlanKey = hotelNormalizedMealPlan.en;
      if (!createdEntities.mealPlans[hotelMealPlanKey]) {
        createdEntities.mealPlans[hotelMealPlanKey] = {};
      }
      const hotelMealPlanEnId = await createMealPlanForLocale(
        strapi,
        hotelMealPlanName,
        "en"
      );
      createdEntities.mealPlans[hotelMealPlanKey].en = hotelMealPlanEnId;

      hotelOptionsEn.push(
        transformHotelOption(hotelData, hotelEnId, hotelMealPlanEnId, enData)
      );

      // Store hotel ID by slug
      const slug = slugify(hotelData.hotel_name);
      if (!createdEntities.hotels[locationKey][slug])
        createdEntities.hotels[locationKey][slug] = {};
      createdEntities.hotels[locationKey][slug].en = hotelEnId;
    }
  }

  // 4. Upload PDF (shared between locales)
  const pdfFileId = await uploadPdfFile(strapi, locationKey);

  // 5. Offer EN
  const offerEnId = await createOfferForLocale(
    strapi,
    enData,
    locationKey,
    hotelOptionsEn,
    pdfFileId,
    "en"
  );
  createdEntities.offers[locationKey].en = offerEnId;

  // ========== PHASE 2: Create all AR entities as localizations ==========
  if (arData) {
    console.log("\n--- Creating AR localizations ---");

    // 1. Location AR - use EN documentId to create localization
    const locationArId = await createLocationForLocale(
      strapi,
      locationKey,
      "ar",
      locationEnId // Pass EN documentId
    );
    createdEntities.locations[locationKey].ar = locationArId;

    // 2. Meal plans AR - use EN documentId to create localization
    const arMealPlanName = arData.offer?.meal_plan || mealPlanName;
    const arNormalizedMealPlan = normalizeMealPlan(arMealPlanName);
    const arMealPlanKey = arNormalizedMealPlan.en; // Use EN name as key for lookup
    const mealPlanArId = await createMealPlanForLocale(
      strapi,
      arMealPlanName,
      "ar",
      createdEntities.mealPlans[arMealPlanKey]?.en // Pass EN documentId
    );
    createdEntities.mealPlans[arMealPlanKey].ar = mealPlanArId;

    // 3. Hotels AR and build hotel options - use EN documentIds to create localizations
    const hotelOptionsAr = [];
    if (arData.hotels?.length) {
      for (let i = 0; i < arData.hotels.length; i++) {
        const hotelData = arData.hotels[i];
        // Try to match with EN hotel by index or slug
        const enHotelData = enData.hotels?.[i];
        const slug = enHotelData
          ? slugify(enHotelData.hotel_name)
          : slugify(hotelData.hotel_name);
        const existingHotelEnId = createdEntities.hotels[locationKey][slug]?.en;

        const hotelArId = await createHotelForLocale(
          strapi,
          hotelData,
          locationArId,
          "ar",
          existingHotelEnId // Pass EN documentId
        );

        // Handle hotel-specific meal plan
        const hotelMealPlanName = hotelData.meal_plan || arMealPlanName;
        const hotelNormalizedMealPlan = normalizeMealPlan(hotelMealPlanName);
        const hotelMealPlanKey = hotelNormalizedMealPlan.en;
        const hotelMealPlanArId = await createMealPlanForLocale(
          strapi,
          hotelMealPlanName,
          "ar",
          createdEntities.mealPlans[hotelMealPlanKey]?.en // Pass EN documentId
        );

        // Use the EN hotel documentId for the hotel option (same document, different locale)
        const hotelDocIdForOption = existingHotelEnId || hotelArId;
        hotelOptionsAr.push(
          transformHotelOption(
            hotelData,
            hotelDocIdForOption,
            hotelMealPlanArId,
            arData
          )
        );
      }
    }

    // 4. Offer AR - use EN documentId to create localization
    await createOfferForLocale(
      strapi,
      arData,
      locationKey,
      hotelOptionsAr,
      pdfFileId,
      "ar",
      offerEnId // Pass EN documentId
    );
  } else {
    console.log("\n--- Skipping AR: No Arabic JSON file ---");
  }
}

/**
 * Main function
 */
async function main() {
  console.log("=".repeat(60));
  console.log("Strapi Offer Seeder with i18n Support");
  console.log("=".repeat(60));

  if (!fs.existsSync(JSON_FILES_DIR_EN)) {
    console.error(`JSON directory not found: ${JSON_FILES_DIR_EN}`);
    process.exit(1);
  }

  console.log("\nLoading Strapi...");
  const { createStrapi } = require("@strapi/strapi");
  const app = await createStrapi({ distDir: "./dist" }).load();
  console.log("Strapi loaded!\n");

  try {
    const jsonFiles = fs
      .readdirSync(JSON_FILES_DIR_EN)
      .filter((f) => f.endsWith(".json"));
    console.log(`Found ${jsonFiles.length} JSON files`);

    for (const filename of jsonFiles) {
      await processLocation(app, filename);
    }

    console.log("\n" + "=".repeat(60));
    console.log("Seeding Complete!");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await app.destroy();
  }
}

main().catch(console.error);
