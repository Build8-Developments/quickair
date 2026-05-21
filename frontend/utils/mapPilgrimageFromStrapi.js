/**
 * Maps structured Strapi pilgrimage pages to the shape expected by page components (translation-compatible).
 */

const HAJ_RITUAL_IMAGE_FALLBACKS = {
  vipArafat:
    "https://cnn-arabic-images.cnn.io/cloudinary/image/upload/w_1920,c_scale,q_auto/cnnarabic/2023/06/27/images/243914.avif",
  vipMina:
    "https://cdn4.premiumread.com/?url=https://www.al-madina.com/uploads/images/2024/06/16/2315534.jpg",
  distinguishedArafat:
    "https://cnn-arabic-images.cnn.io/cloudinary/image/upload/w_1920,c_scale,q_auto/cnnarabic/2023/06/27/images/243914.avif",
  distinguishedMina:
    "https://cdn4.premiumread.com/?url=https://www.al-madina.com/uploads/images/2024/06/16/2315534.jpg",
};

const SERVICE_ICON_TO_KEY = {
  star: "comfort",
  plane: "vipLounge",
  users: "adminSupervision",
  train: "haramainTrain",
  book: "religiousSupervision",
  list: "multiplePrograms",
};

function resolveMediaUrl(image, baseUrl) {
  if (!image?.url) return null;
  if (image.url.startsWith("http")) return image.url;
  return `${baseUrl}${image.url}`;
}

function bulletsToStrings(bullets) {
  return (bullets || []).map((b) => b?.text).filter(Boolean);
}

function mapHotelsToLegacy(hotels) {
  const list = hotels || [];
  const madinah = list[0];
  const makkah = list[1];
  return {
    madinah: madinah
      ? {
          location: madinah.location,
          name: madinah.name,
          feature1: madinah.feature1,
          feature2: madinah.feature2,
          nights: madinah.nightsDates,
          hotelLink:
            madinah.hotel?.slug ||
            madinah.hotelSlug ||
            madinah.hotel?.documentId ||
            null,
          stars: madinah.hotel?.stars ?? null,
        }
      : {},
    makkah: makkah
      ? {
          location: makkah.location,
          name: makkah.name,
          feature1: makkah.feature1,
          feature2: makkah.feature2,
          nights: makkah.nightsDates,
          hotelLink:
            makkah.hotel?.slug ||
            makkah.hotelSlug ||
            makkah.hotel?.documentId ||
            null,
          stars: makkah.hotel?.stars ?? null,
        }
      : {},
  };
}

function cityKey(value) {
  const text = String(value || "").toLowerCase();
  if (
    text.includes("madinah") ||
    text.includes("medina") ||
    text.includes("المدينة")
  ) {
    return "madinah";
  }
  if (text.includes("makkah") || text.includes("mecca") || text.includes("مكة")) {
    return "makkah";
  }
  return null;
}

function splitHajHotelCards(hotels) {
  const cards = hotels || [];
  const madinah =
    cards.find((hotel) => cityKey(hotel.location) === "madinah") || cards[0];
  const makkah =
    cards.find((hotel) => cityKey(hotel.location) === "makkah") || cards[1];
  return { madinah, makkah };
}

function linkedHotelDisplay(card) {
  const hotel = card?.hotel || null;
  return {
    name: card?.name || hotel?.name || null,
    link: hotel?.slug || card?.hotelSlug || hotel?.documentId || null,
    stars: hotel?.stars ?? null,
  };
}

function mapHajPackageToProgram(pkg, packageKey, page) {
  if (!pkg) return null;

  const { madinah, makkah } = splitHajHotelCards(pkg.hotels);
  const madinahHotel = linkedHotelDisplay(madinah);
  const makkahHotel = linkedHotelDisplay(makkah);
  const pricing = pkg.pricing || {};
  const features = bulletsToStrings(pkg.features);
  const tags = bulletsToStrings(pkg.tags);
  const ritualItems = (pkg.rituals || [])
    .flatMap((ritual) => [
      ritual?.description,
      ...bulletsToStrings(ritual?.featureBullets),
    ])
    .filter(Boolean);

  return {
    badge: pkg.badge,
    tier: pkg.tier || packageKey || null,
    tags,
    releaseDate: page.hero?.dateOrSeason,
    title: pkg.title,
    season: page.hero?.dateOrSeason,
    route: [madinah?.location, makkah?.location].filter(Boolean).join(" - "),
    travelDates: madinah?.nightsDates || makkah?.nightsDates || null,
    headerNote: pkg.notePrimary,
    priceDisclaimer: pkg.noteSecondary || pricing.note,
    hotels:
      madinah || makkah
        ? [
            {
              madinahHotel: madinahHotel.name,
              madinahHotelLink: madinahHotel.link,
              madinahHotelStars: madinahHotel.stars,
              madinahNights: madinah?.nightsDates,
              madinahMeals: [madinah?.feature1, madinah?.feature2]
                .filter(Boolean)
                .join(" · "),
              makkahHotel: makkahHotel.name,
              makkahHotelLink: makkahHotel.link,
              makkahHotelStars: makkahHotel.stars,
              makkahNights: makkah?.nightsDates,
              makkahMeals: [makkah?.feature1, makkah?.feature2]
                .filter(Boolean)
                .join(" · "),
              priceQuad: pricing.quadRoom,
              priceTriple: pricing.tripleRoom,
              priceDouble: pricing.doubleRoom,
            },
          ]
        : [],
    programIncludesTitle: pkg.featuresTitle || pkg.hotelsTitle,
    programIncludes: [...features, ...ritualItems],
    programExcludesTitle: null,
    programExcludes: [],
    notesTitle: pkg.pricingTitle,
    notes: [pricing.note, pkg.footerNote].filter(Boolean),
    documentsTitle: null,
    requiredDocuments: [],
    logoVariant: packageKey,
  };
}

function mapHajPackage(pkg, ritualFallbacks, strapiUrl) {
  if (!pkg) return null;

  const features = bulletsToStrings(pkg.features);
  const tags = bulletsToStrings(pkg.tags);
  const rituals = (pkg.rituals || []).map((ritual, index) => {
    const imageUrl =
      resolveMediaUrl(ritual.image, strapiUrl) ||
      ritualFallbacks[index] ||
      null;
    const featureBullets = bulletsToStrings(ritual.featureBullets);

    if (featureBullets.length > 0) {
      return {
        title: ritual.title,
        imageUrl,
        features: featureBullets,
        featuresTitle: featureBullets[0],
        feature1: featureBullets[1],
        feature2: featureBullets[2],
        feature3: featureBullets[3],
      };
    }

    return {
      title: ritual.title,
      description: ritual.description,
      imageUrl,
    };
  });

  const arafatRitual = rituals[0] || {};
  const minaRitual = rituals[1] || {};

  return {
    title: pkg.title,
    badge: pkg.badge,
    tier: pkg.tier || null,
    tags,
    lotteryNote: pkg.notePrimary,
    lotteryDisclaimer: pkg.noteSecondary,
    ministryNote: pkg.notePrimary,
    priceDisclaimer: pkg.noteSecondary,
    priceWithoutAirfare: pkg.pricing?.note,
    featuresTitle: pkg.featuresTitle,
    features: {
      arafatStay: features[0],
      outdoorSeating: features[1],
      fiveStarRestaurant: features[2],
      kadanaStay: features[3],
      roomCorridors: features[4],
      kadanaMosque: features[5],
    },
    hotelsTitle: pkg.hotelsTitle,
    pricingTitle: pkg.pricingTitle,
    ritualsTitle: pkg.ritualsTitle,
    reservationAmount: pkg.pricing?.reservationAmount,
    directVisaNote: pkg.footerNote,
    minaNote: pkg.footerNote,
    arafatRitual: {
      title: arafatRitual.title,
      description: arafatRitual.description,
    },
    minaRitual: {
      title: minaRitual.title,
      description: minaRitual.description,
      featuresTitle: minaRitual.featuresTitle,
      feature1: minaRitual.feature1,
      feature2: minaRitual.feature2,
      feature3: minaRitual.feature3,
    },
    _rituals: rituals,
    _hotels: pkg.hotels,
    _pricing: pkg.pricing,
  };
}

export function mapHajPageFromStrapi(page, strapiUrl = "") {
  if (!page) return null;

  const services = {};
  (page.servicesSection?.services || []).forEach((service) => {
    const key = SERVICE_ICON_TO_KEY[service.icon] || service.icon;
    services[key] = {
      title: service.title,
      description: service.description,
    };
  });

  const hotels = mapHotelsToLegacy(page.vipPackage?.hotels);
  const vip = mapHajPackage(
    page.vipPackage,
    [HAJ_RITUAL_IMAGE_FALLBACKS.vipArafat, HAJ_RITUAL_IMAGE_FALLBACKS.vipMina],
    strapiUrl,
  );
  const distinguished = mapHajPackage(
    page.distinguishedPackage,
    [
      HAJ_RITUAL_IMAGE_FALLBACKS.distinguishedArafat,
      HAJ_RITUAL_IMAGE_FALLBACKS.distinguishedMina,
    ],
    strapiUrl,
  );
  const packagePrograms = (page.packages || [])
    .map((pkg, index) =>
      mapHajPackageToProgram(pkg, pkg?.tier || `package-${index + 1}`, page),
    )
    .filter(Boolean);

  const steps = {};
  (page.stepsSection?.steps || []).forEach((step, i) => {
    const keys = ["ihram", "tawaf", "sai", "arafat", "muzdalifah", "rami"];
    const key = keys[i];
    if (key) {
      steps[key] = { title: step.title, description: step.description };
    }
  });

  return {
    hero: {
      title: page.hero?.title,
      date: page.hero?.dateOrSeason,
      subtitle: page.hero?.subtitle,
    },
    services: {
      sectionTitle: page.servicesSection?.header?.eyebrow,
      sectionSubtitle: page.servicesSection?.header?.title,
      intro: page.servicesSection?.header?.description,
      ...services,
    },
    vipPackage: vip,
    distinguishedPackage: distinguished,
    hotels,
    programsSection: {
      title: undefined,
      subtitle: page.servicesSection?.header?.description,
    },
    programs:
      packagePrograms.length > 0
        ? packagePrograms
        : [
            mapHajPackageToProgram(page.vipPackage, "vip", page),
            mapHajPackageToProgram(
              page.distinguishedPackage,
              "distinguished",
              page,
            ),
          ].filter(Boolean),
    tableLabels: {
      tripDatesLabel: page.pricingLabels?.nights,
      routeLabel:
        page.pricingLabels?.makkah && page.pricingLabels?.madinah
          ? `${page.pricingLabels.madinah} / ${page.pricingLabels.makkah}`
          : undefined,
      duration: page.hero?.dateOrSeason,
      madinahHeader: page.pricingLabels?.madinah,
      makkahHeader: page.pricingLabels?.makkah,
      perPersonHeader: page.pricingLabels?.perPerson,
      doubleColumn: page.pricingLabels?.doubleRoom,
      tripleColumn: page.pricingLabels?.tripleRoom,
      quadColumn: page.pricingLabels?.quadRoom,
      currency: page.pricingLabels?.currency,
      issueDateLabel: undefined,
    },
    pricing: {
      doubleRoom: page.pricingLabels?.doubleRoom,
      tripleRoom: page.pricingLabels?.tripleRoom,
      quadRoom: page.pricingLabels?.quadRoom,
      doubleRoomDesc: page.pricingLabels?.doubleRoomDesc,
      tripleRoomDesc: page.pricingLabels?.tripleRoomDesc,
      quadRoomDesc: page.pricingLabels?.quadRoomDesc,
      vip: {
        double: page.vipPackage?.pricing?.doubleRoom,
        triple: page.vipPackage?.pricing?.tripleRoom,
        quad: page.vipPackage?.pricing?.quadRoom,
        reservation: page.vipPackage?.pricing?.reservationAmount,
      },
      distinguished: {
        double: page.distinguishedPackage?.pricing?.doubleRoom,
        triple: page.distinguishedPackage?.pricing?.tripleRoom,
        quad: page.distinguishedPackage?.pricing?.quadRoom,
        reservation: page.distinguishedPackage?.pricing?.reservationAmount,
      },
    },
    steps: {
      title: page.stepsSection?.header?.eyebrow,
      subtitle: page.stepsSection?.header?.title,
      description: page.stepsSection?.header?.description,
      ...steps,
    },
    _media: {
      vipArafatRitual: vip?._rituals?.[0]?.imageUrl,
      vipMinaRitual: vip?._rituals?.[1]?.imageUrl,
      distinguishedArafatRitual: distinguished?._rituals?.[0]?.imageUrl,
      distinguishedMinaRitual: distinguished?._rituals?.[1]?.imageUrl,
    },
    _structured: page,
  };
}

function formatPrice(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number") return value;
  const num = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isNaN(num) ? value : num;
}

function mapUmrahPackageCard(card) {
  if (!card) return null;
  return {
    makkahHotel: card.makkahHotel,
    makkahNights: card.makkahNights,
    makkahMeals: card.makkahMeals,
    madinahHotel: card.madinahHotel,
    madinahNights: card.madinahNights,
    madinahMeals: card.madinahMeals,
    prices: {
      double: formatPrice(card.priceDouble),
      triple: formatPrice(card.priceTriple),
      quad: formatPrice(card.priceQuad),
    },
    isFeatured: card.isFeatured,
  };
}

function mapUmrahProgram(prog) {
  if (!prog) return null;
  return {
    badge: prog.badge,
    tier: prog.tier || null,
    tags: bulletsToStrings(prog.tags),
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
    hotels: (prog.hotels || []).map((h) => {
      const madinah = h.madinahHotel || null;
      const makkah = h.makkahHotel || null;
      return {
        madinahHotel: h.madinahHotelLabel || madinah?.name || null,
        // Prefer slug for human-friendly URLs; fall back to documentId.
        madinahHotelLink: madinah?.slug || madinah?.documentId || null,
        madinahHotelStars: madinah?.stars ?? null,
        madinahNights: h.madinahNights,
        madinahMeals: h.madinahMeals,
        makkahHotel: h.makkahHotelLabel || makkah?.name || null,
        makkahHotelLink: makkah?.slug || makkah?.documentId || null,
        makkahHotelStars: makkah?.stars ?? null,
        makkahNights: h.makkahNights,
        makkahMeals: h.makkahMeals,
        priceQuad: h.priceQuad,
        priceTriple: h.priceTriple,
        priceDouble: h.priceDouble,
      };
    }),
    programIncludesTitle: prog.programIncludesTitle,
    programIncludes: bulletsToStrings(prog.programIncludes),
    programExcludesTitle: prog.programExcludesTitle,
    programExcludes: bulletsToStrings(prog.programExcludes),
    notesTitle: prog.notesTitle,
    notes: bulletsToStrings(prog.notes),
    documentsTitle: prog.documentsTitle,
    requiredDocuments: bulletsToStrings(prog.requiredDocuments),
  };
}

export function mapUmrahPageFromStrapi(page) {
  if (!page) return null;

  const steps = {};
  const stepKeys = ["ihram", "tawaf", "sai", "halq"];
  (page.stepsSection?.steps || []).forEach((step, i) => {
    const key = stepKeys[i];
    if (key) {
      steps[key] = { title: step.title, description: step.description };
    }
  });

  const policies = page.policies;
  const mapPolicyItems = (list) => bulletsToStrings(list?.items);

  return {
    hero: {
      title: page.hero?.title,
      season: page.hero?.dateOrSeason,
      subtitle: page.hero?.subtitle,
    },
    steps: {
      title: page.stepsSection?.header?.eyebrow,
      subtitle: page.stepsSection?.header?.title,
      description: page.stepsSection?.header?.description,
      ...steps,
    },
    programsSection: {
      title: page.programsSectionTitle,
      subtitle: page.programsSectionSubtitle,
    },
    programs: (page.programs || []).map(mapUmrahProgram).filter(Boolean),
    tableLabels: page.tableLabels
      ? {
          tripDatesLabel: page.tableLabels.tripDatesLabel,
          routeLabel: page.tableLabels.routeLabel,
          duration: page.tableLabels.duration,
          madinahHeader: page.tableLabels.madinahHeader,
          makkahHeader: page.tableLabels.makkahHeader,
          perPersonHeader: page.tableLabels.perPersonHeader,
          doubleColumn: page.tableLabels.doubleColumn,
          tripleColumn: page.tableLabels.tripleColumn,
          quadColumn: page.tableLabels.quadColumn,
          currency: page.tableLabels.currency,
          issueDateLabel: page.tableLabels.issueDateLabel,
          logoTagline: page.tableLabels.logoTagline,
        }
      : null,
    premium: {
      badge: page.premiumSection?.badge,
      title: page.premiumSection?.title,
      duration: page.premiumSection?.duration,
      haramainTrain: page.premiumSection?.haramainTrain,
      packages: (page.premiumSection?.packages || []).map(mapUmrahPackageCard),
    },
    economy: {
      badge: page.economySection?.badge,
      title: page.economySection?.title,
      duration: page.economySection?.duration,
      route: page.economySection?.route,
      travelDates: bulletsToStrings(page.economySection?.travelDates),
      fridayPrayers: bulletsToStrings(page.economySection?.fridayPrayers),
      package: mapUmrahPackageCard(page.economySection?.package),
    },
    policies: policies
      ? {
          title: policies.title,
          inclusions: {
            title: policies.inclusions?.title,
            items: mapPolicyItems(policies.inclusions),
          },
          exclusions: {
            title: policies.exclusions?.title,
            items: mapPolicyItems(policies.exclusions),
          },
          exchangeRate: {
            title: policies.exchangeRateTitle,
            rate: policies.exchangeRate,
            note: policies.exchangeRateNote,
          },
          roomPolicy: {
            title: policies.roomPolicyTitle,
            description: policies.roomPolicyDescription,
          },
          paymentPolicy: {
            title: policies.paymentPolicyTitle,
            initialPayment: policies.initialPayment,
            finalPayment: policies.finalPayment,
            note: policies.paymentNote,
          },
          cancellation: {
            title: policies.cancellationTitle,
            rules: (policies.cancellationRules || []).map((r) => ({
              period: r.period,
              penalty: Number(r.penaltyPercent),
            })),
            penaltyText: policies.cancellationPenaltyText,
          },
          documents: {
            title: policies.documentsTitle,
            items: mapPolicyItems(policies.documents),
          },
        }
      : null,
    pricing: {
      makkah: page.pricingLabels?.makkah,
      madinah: page.pricingLabels?.madinah,
      nights: page.pricingLabels?.nights,
      doubleRoom: page.pricingLabels?.doubleRoom,
      tripleRoom: page.pricingLabels?.tripleRoom,
      quadRoom: page.pricingLabels?.quadRoom,
      perPerson: page.pricingLabels?.perPerson,
      currency: page.pricingLabels?.currency,
    },
    _structured: page,
  };
}
