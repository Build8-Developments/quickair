#!/usr/bin/env node

/**
 * Seed Haj & Umrah single-type pages (structured components) from translation files.
 * Usage (from strapi/): npm run build && npm run seed:pilgrimage
 */

const path = require("path");
const fs = require("fs");

const SERVICE_ENTRIES = [
  { key: "comfort", icon: "star" },
  { key: "vipLounge", icon: "plane" },
  { key: "adminSupervision", icon: "users" },
  { key: "haramainTrain", icon: "train" },
  { key: "religiousSupervision", icon: "book" },
  { key: "multiplePrograms", icon: "list" },
];

const HAJ_STEP_KEYS = ["ihram", "tawaf", "sai", "arafat", "muzdalifah", "rami"];
const UMRAH_STEP_KEYS = ["ihram", "tawaf", "sai", "halq"];

function bulletsFromStrings(strings) {
  return (strings || []).filter(Boolean).map((text) => ({ text }));
}

async function buildHajPage(strapi, haj, locale) {
  const s = haj.services || {};
  const hotels = haj.hotels || {};
  const pricing = haj.pricing || {};

  const hotelCards = await Promise.all(
    [hotels.madinah, hotels.makkah].filter(Boolean).map(async (h) => {
      const hotelSlug = resolveHajHotelSlug(h.name);
      const hotelId =
        (await findHotelDocumentId(strapi, h.name, locale)) ||
        (hotelSlug
          ? await findHotelDocumentIdBySlug(strapi, hotelSlug, locale)
          : null);
      return {
        location: h.location,
        name: h.name,
        feature1: h.feature1,
        feature2: h.feature2,
        nightsDates: h.nights,
        hotelSlug,
        hotel: hotelId || null,
      };
    }),
  );

  const buildPackage = (pkg, pricingKey, isVip) => {
    const p = haj.pricing?.[pricingKey] || {};
    const features = pkg.features
      ? Object.values(pkg.features).filter(Boolean)
      : [];

    const rituals = [];
    if (pkg.arafatRitual) {
      rituals.push({
        title: pkg.arafatRitual.title,
        description: pkg.arafatRitual.description,
        featureBullets: [],
      });
    }
    if (pkg.minaRitual) {
      const minaBullets = isVip
        ? [
            pkg.minaRitual.featuresTitle,
            pkg.minaRitual.feature1,
            pkg.minaRitual.feature2,
            pkg.minaRitual.feature3,
          ].filter(Boolean)
        : [];
      rituals.push({
        title: pkg.minaRitual.title,
        description: pkg.minaRitual.description || undefined,
        featureBullets: bulletsFromStrings(minaBullets),
      });
    }

    return {
      badge: pkg.badge,
      title: pkg.title,
      notePrimary: isVip ? pkg.lotteryNote : pkg.ministryNote,
      noteSecondary: isVip ? pkg.lotteryDisclaimer : pkg.priceDisclaimer,
      featuresTitle: pkg.featuresTitle,
      features: bulletsFromStrings(features),
      hotelsTitle: pkg.hotelsTitle,
      hotels: hotelCards,
      pricingTitle: pkg.pricingTitle,
      pricing: {
        doubleRoom: p.double,
        tripleRoom: p.triple,
        quadRoom: p.quad,
        reservationAmount: p.reservation,
        note: isVip ? undefined : pkg.priceWithoutAirfare,
      },
      ritualsTitle: pkg.ritualsTitle,
      rituals,
      footerNote: isVip ? pkg.directVisaNote : undefined,
    };
  };

  return {
    hero: {
      title: haj.hero?.title,
      subtitle: haj.hero?.subtitle,
      dateOrSeason: haj.hero?.date,
    },
    servicesSection: {
      header: {
        eyebrow: s.sectionTitle,
        title: s.sectionSubtitle,
        description: s.intro,
      },
      services: SERVICE_ENTRIES.map(({ key, icon }) => ({
        icon,
        title: s[key]?.title,
        description: s[key]?.description,
      })).filter((item) => item.title),
    },
    vipPackage: buildPackage(haj.vipPackage || {}, "vip", true),
    distinguishedPackage: buildPackage(
      haj.distinguishedPackage || {},
      "distinguished",
      false,
    ),
    pricingLabels: {
      doubleRoom: pricing.doubleRoom,
      tripleRoom: pricing.tripleRoom,
      quadRoom: pricing.quadRoom,
      doubleRoomDesc: pricing.doubleRoomDesc,
      tripleRoomDesc: pricing.tripleRoomDesc,
      quadRoomDesc: pricing.quadRoomDesc,
      reservationAmount: haj.vipPackage?.reservationAmount,
    },
    stepsSection: {
      header: {
        eyebrow: haj.steps?.title,
        title: haj.steps?.subtitle,
        description: haj.steps?.description,
      },
      steps: HAJ_STEP_KEYS.map((key) => ({
        title: haj.steps?.[key]?.title,
        description: haj.steps?.[key]?.description,
      })).filter((step) => step.title),
    },
  };
}

function formatUmrahPrice(value) {
  if (value == null) return null;
  return String(value);
}

function buildUmrahPackageCard(pkg) {
  if (!pkg) return null;
  const prices = pkg.prices || {};
  return {
    makkahHotel: pkg.makkahHotel,
    makkahNights: pkg.makkahNights,
    makkahMeals: pkg.makkahMeals,
    madinahHotel: pkg.madinahHotel,
    madinahNights: pkg.madinahNights,
    madinahMeals: pkg.madinahMeals,
    priceDouble: formatUmrahPrice(prices.double),
    priceTriple: formatUmrahPrice(prices.triple),
    priceQuad: formatUmrahPrice(prices.quad),
    isFeatured: Boolean(pkg.isFeatured),
  };
}

async function buildUmrahPage(strapi, omra, locale) {
  const policies = omra.policies || {};
  const pricing = omra.pricing || {};
  const tableLabels = omra.tableLabels || {};
  const programsSection = omra.programsSection || {};
  const programs = Array.isArray(omra.programs) ? omra.programs : [];

  const builtPrograms = [];
  for (const prog of programs) {
    const built = await buildUmrahProgram(strapi, prog, locale);
    if (built) builtPrograms.push(built);
  }

  return {
    hero: {
      title: omra.hero?.title,
      subtitle: omra.hero?.subtitle,
      dateOrSeason: omra.hero?.season,
    },
    stepsSection: {
      header: {
        eyebrow: omra.steps?.title,
        title: omra.steps?.subtitle,
        description: omra.steps?.description,
      },
      steps: UMRAH_STEP_KEYS.map((key) => ({
        title: omra.steps?.[key]?.title,
        description: omra.steps?.[key]?.description,
      })).filter((step) => step.title),
    },
    programsSectionTitle: programsSection.title,
    programsSectionSubtitle: programsSection.subtitle,
    programs: builtPrograms,
    premiumSection: {
      badge: omra.premium?.badge,
      title: omra.premium?.title,
      duration: omra.premium?.duration,
      haramainTrain: omra.premium?.haramainTrain,
      packages: (omra.premium?.packages || [])
        .map(buildUmrahPackageCard)
        .filter(Boolean),
    },
    economySection: {
      badge: omra.economy?.badge,
      title: omra.economy?.title,
      duration: omra.economy?.duration,
      route: omra.economy?.route,
      travelDates: bulletsFromStrings(omra.economy?.travelDates),
      fridayPrayers: bulletsFromStrings(omra.economy?.fridayPrayers),
      package: buildUmrahPackageCard(omra.economy?.package),
    },
    policies: {
      title: policies.title,
      inclusions: {
        title: policies.inclusions?.title,
        items: bulletsFromStrings(policies.inclusions?.items),
      },
      exclusions: {
        title: policies.exclusions?.title,
        items: bulletsFromStrings(policies.exclusions?.items),
      },
      exchangeRateTitle: policies.exchangeRate?.title,
      exchangeRate: policies.exchangeRate?.rate,
      exchangeRateNote: policies.exchangeRate?.note,
      roomPolicyTitle: policies.roomPolicy?.title,
      roomPolicyDescription: policies.roomPolicy?.description,
      paymentPolicyTitle: policies.paymentPolicy?.title,
      initialPayment: policies.paymentPolicy?.initialPayment,
      finalPayment: policies.paymentPolicy?.finalPayment,
      paymentNote: policies.paymentPolicy?.note,
      cancellationTitle: policies.cancellation?.title,
      cancellationRules: (policies.cancellation?.rules || []).map((rule) => ({
        period: rule.period,
        penaltyPercent: rule.penalty,
      })),
      documentsTitle: policies.documents?.title,
      documents: {
        title: policies.documents?.title,
        items: bulletsFromStrings(policies.documents?.items),
      },
      cancellationPenaltyText: policies.cancellation?.penaltyText,
    },
    pricingLabels: {
      doubleRoom: pricing.doubleRoom,
      tripleRoom: pricing.tripleRoom,
      quadRoom: pricing.quadRoom,
      perPerson: pricing.perPerson,
      currency: pricing.currency,
      makkah: pricing.makkah,
      madinah: pricing.madinah,
      nights: pricing.nights,
    },
    tableLabels: {
      tripDatesLabel: tableLabels.tripDatesLabel,
      routeLabel: tableLabels.routeLabel,
      duration: tableLabels.duration,
      madinahHeader: tableLabels.madinahHeader,
      makkahHeader: tableLabels.makkahHeader,
      perPersonHeader: tableLabels.perPersonHeader,
      doubleColumn: tableLabels.doubleColumn,
      tripleColumn: tableLabels.tripleColumn,
      quadColumn: tableLabels.quadColumn,
      currency: tableLabels.currency,
      issueDateLabel: tableLabels.issueDateLabel,
      logoTagline: tableLabels.logoTagline,
    },
  };
}

async function findHotelDocumentId(strapi, name, locale) {
  if (!name) return null;
  const trimmed = String(name).trim();
  if (!trimmed) return null;
  // Search by exact (case-insensitive) name match in the requested locale.
  // Also try the default locale as a fallback so seeding works when only one
  // locale of the hotel exists.
  // NOTE: Strapi 5's strapi.documents().findMany() requires the `$` prefix on
  // operators (e.g. $eqi). Without it the filter is silently ignored and the
  // first row in the table is returned, which previously caused every program
  // hotel relation to point at the same (wrong) hotel.
  const tryLocales = [locale, "en", "ar"].filter(
    (l, i, arr) => l && arr.indexOf(l) === i,
  );
  for (const tryLocale of tryLocales) {
    const matches = await strapi.documents("api::hotel.hotel").findMany({
      locale: tryLocale,
      filters: { name: { $eqi: trimmed } },
      fields: ["documentId", "name"],
      limit: 1,
    });
    if (matches?.length) return matches[0].documentId;
  }
  return null;
}

function normalizeHotelName(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, " ")
    .trim();
}

function resolveHajHotelSlug(name) {
  const normalized = normalizeHotelName(name);
  const known = [
    ["movenpick anwar al madinah", "movenpick-anwar-madinah"],
    ["موفنبيك انوار المدينة", "movenpick-anwar-madinah"],
    ["movenpick hajar swiss", "movenpick-hajar-makkah"],
    ["موفنبيك هاجر سويس", "movenpick-hajar-makkah"],
    ["fairmont clock tower", "fairmont-makkah"],
    ["فيرمونت برج الساعة", "fairmont-makkah"],
  ];
  return known.find(([needle]) => normalized.includes(needle))?.[1] || null;
}

async function findHotelDocumentIdBySlug(strapi, slug, locale) {
  if (!slug) return null;
  const tryLocales = [locale, "en", "ar"].filter(
    (l, i, arr) => l && arr.indexOf(l) === i,
  );
  for (const tryLocale of tryLocales) {
    const matches = await strapi.documents("api::hotel.hotel").findMany({
      locale: tryLocale,
      filters: { slug: { $eq: slug } },
      fields: ["documentId", "slug"],
      limit: 1,
    });
    if (matches?.length) return matches[0].documentId;
  }
  return null;
}

async function buildUmrahProgram(strapi, prog, locale) {
  if (!prog) return null;
  const hotels = await Promise.all(
    (prog.hotels || []).map(async (h) => {
      const [madinahId, makkahId] = await Promise.all([
        findHotelDocumentId(strapi, h.madinahHotel, locale),
        findHotelDocumentId(strapi, h.makkahHotel, locale),
      ]);
      return {
        // relation by documentId; null is acceptable (Strapi 5 allows it)
        madinahHotel: madinahId || null,
        // Always keep the displayed label so the brochure renders even if the
        // hotel relation hasn't been linked yet.
        madinahHotelLabel: h.madinahHotel || null,
        madinahNights: h.madinahNights,
        madinahMeals: h.madinahMeals,
        makkahHotel: makkahId || null,
        makkahHotelLabel: h.makkahHotel || null,
        makkahNights: h.makkahNights,
        makkahMeals: h.makkahMeals,
        priceQuad: h.priceQuad,
        priceTriple: h.priceTriple,
        priceDouble: h.priceDouble,
      };
    }),
  );

  return {
    badge: prog.badge,
    releaseDate: prog.releaseDate,
    title: prog.title,
    season: prog.season,
    route: prog.route,
    travelDates: prog.travelDates,
    duration: prog.duration,
    headerNote: prog.headerNote,
    priceDisclaimer: prog.priceDisclaimer,
    logoVariant: prog.logoVariant || "default",
    accentColor: prog.accentColor || "default",
    hotels,
    programIncludesTitle: prog.programIncludesTitle,
    programIncludes: bulletsFromStrings(prog.programIncludes),
    programExcludesTitle: prog.programExcludesTitle,
    programExcludes: bulletsFromStrings(prog.programExcludes),
    notesTitle: prog.notesTitle,
    notes: bulletsFromStrings(prog.notes),
    documentsTitle: prog.documentsTitle,
    requiredDocuments: bulletsFromStrings(prog.requiredDocuments),
  };
}

async function upsertBaseLocale(strapi, uid, locale, data) {
  const existing = await strapi.documents(uid).findMany({ locale });

  if (existing?.length > 0) {
    const updated = await strapi.documents(uid).update({
      documentId: existing[0].documentId,
      locale,
      data,
      status: "published",
    });
    return updated.documentId;
  }

  const created = await strapi.documents(uid).create({
    data,
    locale,
    status: "published",
  });
  return created.documentId;
}

async function upsertLinkedLocale(strapi, uid, documentId, locale, data) {
  const existing = await strapi.documents(uid).findMany({ locale });
  const matching = existing?.find((entry) => entry.documentId === documentId);
  const unlinked = existing?.filter((entry) => entry.documentId !== documentId);

  if (unlinked?.length > 0) {
    console.warn(
      `Found ${unlinked.length} unlinked ${uid} ${locale} document(s). ` +
        "They should be removed before reseeding to avoid duplicate dashboard entries.",
    );
  }

  const result = await strapi.documents(uid).update({
    documentId,
    locale,
    data,
    status: "published",
  });

  return matching?.documentId || result.documentId;
}

async function seedLocalizedSingleType(strapi, uid, enData, arData, label) {
  console.log(`Seeding structured ${label} page (en, ar)...`);
  const documentId = await upsertBaseLocale(strapi, uid, "en", enData);
  await upsertLinkedLocale(strapi, uid, documentId, "ar", arData);
  return documentId;
}

async function main() {
  const arPath = path.join(
    __dirname,
    "../../frontend/locales/ar/translation.json",
  );
  const enPath = path.join(
    __dirname,
    "../../frontend/locales/en/translation.json",
  );

  if (!fs.existsSync(arPath) || !fs.existsSync(enPath)) {
    console.error("Translation files not found.");
    process.exit(1);
  }

  const distDir = path.join(__dirname, "..", "dist");
  if (!fs.existsSync(distDir)) {
    console.error('Run "npm run build" in strapi/ first.');
    process.exit(1);
  }

  const ar = JSON.parse(fs.readFileSync(arPath, "utf8"));
  const en = JSON.parse(fs.readFileSync(enPath, "utf8"));

  console.log("Loading Strapi...");
  const { createStrapi } = require("@strapi/strapi");
  const app = await createStrapi({ distDir: "./dist" }).load();
  console.log("Strapi loaded.\n");

  const hajUid = "api::haj-page.haj-page";
  const umrahUid = "api::umrah-page.umrah-page";

  let exitCode = 0;

  try {
    await seedLocalizedSingleType(
      app,
      hajUid,
      await buildHajPage(app, en.haj, "en"),
      await buildHajPage(app, ar.haj, "ar"),
      "Haj",
    );

    await seedLocalizedSingleType(
      app,
      umrahUid,
      await buildUmrahPage(app, en.omra, "en"),
      await buildUmrahPage(app, ar.omra, "ar"),
      "Umrah",
    );

    console.log("\nDone. Haj & Umrah pages seeded with structured components.");
  } catch (error) {
    console.error("Seed failed:", error);
    exitCode = 1;
  }

  if (exitCode === 0) {
    // Exit before PG pool teardown — avoids harmless "aborted" error from tarn
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
