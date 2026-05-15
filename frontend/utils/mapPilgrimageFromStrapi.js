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
        }
      : {},
    makkah: makkah
      ? {
          location: makkah.location,
          name: makkah.name,
          feature1: makkah.feature1,
          feature2: makkah.feature2,
          nights: makkah.nightsDates,
        }
      : {},
  };
}

function mapHajPackage(pkg, ritualFallbacks, strapiUrl) {
  if (!pkg) return null;

  const features = bulletsToStrings(pkg.features);
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
