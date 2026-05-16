#!/usr/bin/env node

/**
 * Seed Umrah-program hotels (Makkah & Madinah hotels referenced by the
 * Umrah landing page programs) into the Strapi `Hotels` collection.
 *
 * Each hotel is created in both EN and AR locales with the same documentId
 * so the linked Umrah-page component can reference a single relation that
 * works across locales.
 *
 * Usage (from strapi/):
 *   npm run build
 *   node scripts/seed-umrah-hotels.js
 *   # or, if you add it to package.json:
 *   npm run seed:umrah-hotels
 *
 * After running this script, run `seed:pilgrimage` so the Umrah Page
 * component re-binds the relation correctly.
 */

const path = require("path");

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const LOCATIONS = [
  {
    slug: "makkah",
    en: {
      name: "Makkah",
      country: "Saudi Arabia",
      shortDescription: "The Holy City of Makkah",
      description: "Home of the Holy Mosque (Masjid Al-Haram).",
    },
    ar: {
      name: "مكة المكرمة",
      country: "المملكة العربية السعودية",
      shortDescription: "مدينة مكة المكرمة",
      description: "موطن المسجد الحرام والكعبة المشرفة.",
    },
    type: "City",
  },
  {
    slug: "madinah",
    en: {
      name: "Madinah",
      country: "Saudi Arabia",
      shortDescription: "The Radiant City of Madinah",
      description: "Home of the Prophet's Mosque (Al-Masjid An-Nabawi).",
    },
    ar: {
      name: "المدينة المنورة",
      country: "المملكة العربية السعودية",
      shortDescription: "المدينة المنورة",
      description: "موطن المسجد النبوي الشريف.",
    },
    type: "City",
  },
];

// Hotels referenced from the Umrah programs (translation file).
// Slug is shared across locales. EN/AR names + shortDescription are localized.
// Names match the ones used in the Umrah programs (frontend translations).
const HOTELS = [
  {
    slug: "fairmont-makkah",
    location: "makkah",
    stars: 5,
    en: {
      name: "Fairmont",
      shortDescription:
        "Luxury 5-star tower hotel inside the Makkah Royal Clock Tower with views of the Holy Mosque.",
    },
    ar: {
      name: "فيرمونت",
      shortDescription:
        "فندق فاخر 5 نجوم داخل برج الساعة الملكي بإطلالة على المسجد الحرام.",
    },
  },
  {
    slug: "movenpick-hajar-makkah",
    location: "makkah",
    stars: 5,
    en: {
      name: "Movenpick Hajar",
      shortDescription:
        "5-star Movenpick property a short walk from the Holy Mosque with breakfast included.",
    },
    ar: {
      name: "موفنبيك هاجر",
      shortDescription:
        "فندق موفنبيك 5 نجوم على بعد دقائق من المسجد الحرام مع وجبة الإفطار.",
    },
  },
  {
    slug: "al-shohada-makkah",
    location: "makkah",
    stars: 4,
    en: {
      name: "Al-Shohada",
      shortDescription:
        "4-star comfortable stay close to the Holy Mosque, breakfast included.",
    },
    ar: {
      name: "الشهداء",
      shortDescription:
        "إقامة مريحة 4 نجوم بالقرب من المسجد الحرام مع الإفطار.",
    },
  },
  {
    slug: "grand-al-massa-makkah",
    location: "makkah",
    stars: 3,
    en: {
      name: "Grand Al-Massa",
      shortDescription:
        "Comfortable hotel close to Masjid Al-Haram with great value for Umrah pilgrims.",
    },
    ar: {
      name: "جراند الماسة",
      shortDescription:
        "فندق مريح بالقرب من المسجد الحرام بأسعار مناسبة لرحلات العمرة.",
    },
  },
  {
    slug: "al-harithia-madinah",
    location: "madinah",
    stars: 4,
    en: {
      name: "Al-Harithia",
      shortDescription:
        "4-star hotel in central Madinah, breakfast included, walking distance to the Prophet's Mosque.",
    },
    ar: {
      name: "الحارثية",
      shortDescription:
        "فندق 4 نجوم في وسط المدينة المنورة مع الإفطار، على بعد خطوات من المسجد النبوي.",
    },
  },
  {
    slug: "grand-plaza-madinah",
    location: "madinah",
    stars: 4,
    en: {
      name: "Grand Plaza",
      shortDescription:
        "Quality 4-star hotel near the Prophet's Mosque, room-only stay.",
    },
    ar: {
      name: "جراند بلازا",
      shortDescription:
        "فندق 4 نجوم بالقرب من المسجد النبوي مع إقامة فقط.",
    },
  },
  {
    slug: "arkan-al-manar-madinah",
    location: "madinah",
    stars: 3,
    en: {
      name: "Arkan Al-Manar",
      shortDescription:
        "Affordable 3-star option close to the Prophet's Mosque, room-only stay.",
    },
    ar: {
      name: "أركان المنار",
      shortDescription:
        "خيار اقتصادي 3 نجوم بالقرب من المسجد النبوي مع إقامة فقط.",
    },
  },
];

const HOTEL_UID = "api::hotel.hotel";
const LOCATION_UID = "api::location.location";

async function upsertLocation(strapi, loc) {
  const slug = loc.slug;
  // Try to find an existing record by slug (slug is shared across locales).
  const existing = await strapi.documents(LOCATION_UID).findMany({
    filters: { slug: { $eq: slug } },
    locale: "en",
  });

  let documentId = existing?.[0]?.documentId || null;

  if (!documentId) {
    const created = await strapi.documents(LOCATION_UID).create({
      locale: "en",
      data: {
        slug,
        type: loc.type,
        ...loc.en,
      },
      status: "published",
    });
    documentId = created.documentId;
    console.log(`  Created location: ${loc.en.name}`);
  } else {
    await strapi.documents(LOCATION_UID).update({
      documentId,
      locale: "en",
      data: { slug, type: loc.type, ...loc.en },
      status: "published",
    });
    console.log(`  Updated location (en): ${loc.en.name}`);
  }

  // Ensure Arabic localization exists
  const arRecord = await strapi.documents(LOCATION_UID).findOne({
    documentId,
    locale: "ar",
  });
  if (arRecord) {
    await strapi.documents(LOCATION_UID).update({
      documentId,
      locale: "ar",
      data: { slug, type: loc.type, ...loc.ar },
      status: "published",
    });
  } else {
    await strapi.documents(LOCATION_UID).update({
      documentId,
      locale: "ar",
      data: { slug, type: loc.type, ...loc.ar },
      status: "published",
    });
  }
  console.log(`  Synced location (ar): ${loc.ar.name}`);

  return documentId;
}

async function upsertHotel(strapi, hotel, locationsBySlug) {
  const slug = hotel.slug;
  const locationDocumentId = locationsBySlug[hotel.location];

  if (!locationDocumentId) {
    console.warn(`  ! Skipping ${hotel.slug}: location ${hotel.location} not found`);
    return null;
  }

  const existing = await strapi.documents(HOTEL_UID).findMany({
    filters: { slug: { $eq: slug } },
    locale: "en",
  });

  let documentId = existing?.[0]?.documentId || null;

  if (!documentId) {
    const created = await strapi.documents(HOTEL_UID).create({
      locale: "en",
      data: {
        slug,
        stars: hotel.stars,
        featured: hotel.stars >= 5,
        location: locationDocumentId,
        ...hotel.en,
      },
      status: "published",
    });
    documentId = created.documentId;
    console.log(`  Created hotel: ${hotel.en.name}`);
  } else {
    await strapi.documents(HOTEL_UID).update({
      documentId,
      locale: "en",
      data: {
        slug,
        stars: hotel.stars,
        featured: hotel.stars >= 5,
        location: locationDocumentId,
        ...hotel.en,
      },
      status: "published",
    });
    console.log(`  Updated hotel (en): ${hotel.en.name}`);
  }

  // Sync Arabic localization
  await strapi.documents(HOTEL_UID).update({
    documentId,
    locale: "ar",
    data: {
      slug,
      stars: hotel.stars,
      featured: hotel.stars >= 5,
      location: locationDocumentId,
      ...hotel.ar,
    },
    status: "published",
  });
  console.log(`  Synced hotel (ar): ${hotel.ar.name}`);

  return documentId;
}

async function main() {
  console.log("Loading Strapi...");
  const fs = require("fs");
  const distDir = path.join(__dirname, "..", "dist");
  if (!fs.existsSync(distDir)) {
    console.error('Run "npm run build" in strapi/ first.');
    process.exit(1);
  }

  const { createStrapi } = require("@strapi/strapi");
  const app = await createStrapi({ distDir: "./dist" }).load();
  console.log("Strapi loaded.\n");

  let exitCode = 0;
  try {
    console.log("Seeding locations (Makkah, Madinah)...");
    const locationsBySlug = {};
    for (const loc of LOCATIONS) {
      locationsBySlug[loc.slug] = await upsertLocation(app, loc);
    }

    console.log("\nSeeding Umrah hotels...");
    for (const hotel of HOTELS) {
      await upsertHotel(app, hotel, locationsBySlug);
    }

    console.log(
      "\nDone. Run 'npm run seed:pilgrimage' to re-bind Umrah Page relations.",
    );
  } catch (error) {
    console.error("Seed failed:", error);
    exitCode = 1;
  }

  if (exitCode === 0) {
    process.exit(0);
  }

  try {
    await app.destroy();
  } catch {
    // ignore
  }
  process.exit(exitCode);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
