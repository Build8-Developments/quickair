/**
 * GraphQL queries for Haj & Umrah single-type pages (Strapi 5 structured components)
 */

const BULLET = `text`;

const SECTION_HEADER = `
  eyebrow
  title
  description
`;

const HERO = `
  title
  subtitle
  dateOrSeason
  backgroundImage {
    url
    alternativeText
  }
`;

const SERVICE_CARD = `
  icon
  title
  description
`;

const HOTEL_CARD = `
  location
  name
  feature1
  feature2
  nightsDates
  hotelSlug
  hotel {
    documentId
    name
    slug
    stars
  }
`;

const ROOM_PRICING = `
  doubleRoom
  tripleRoom
  quadRoom
  reservationAmount
  note
`;

const RITUAL_CARD = `
  title
  subtitle
  description
  icon
  steps {
    ${BULLET}
  }
  dua
  significance
  featureBullets {
    ${BULLET}
  }
`;

const HAJ_PACKAGE = `
  badge
  tier
  tags {
    ${BULLET}
  }
  title
  notePrimary
  noteSecondary
  featuresTitle
  features {
    ${BULLET}
  }
  hotelsTitle
  hotels {
    ${HOTEL_CARD}
  }
  pricingTitle
  pricing {
    ${ROOM_PRICING}
  }
  ritualsTitle
  showRituals
  rituals {
    ${RITUAL_CARD}
  }
  footerNote
`;

const SERVICES_SECTION = `
  header {
    ${SECTION_HEADER}
  }
  services {
    ${SERVICE_CARD}
  }
`;

const STEPS_SECTION = `
  header {
    ${SECTION_HEADER}
  }
  steps {
    title
    description
  }
`;

const PRICING_LABELS = `
  doubleRoom
  tripleRoom
  quadRoom
  doubleRoomDesc
  tripleRoomDesc
  quadRoomDesc
  reservationAmount
  makkah
  madinah
  nights
  perPerson
  currency
`;

const UMRAH_PACKAGE = `
  makkahHotel
  makkahNights
  makkahMeals
  madinahHotel
  madinahNights
  madinahMeals
  priceDouble
  priceTriple
  priceQuad
  isFeatured
`;

const UMRAH_HOTEL_ROW = `
  madinahHotelLabel
  madinahNights
  madinahMeals
  madinahHotel {
    documentId
    name
    slug
    stars
  }
  makkahHotelLabel
  makkahNights
  makkahMeals
  makkahHotel {
    documentId
    name
    slug
    stars
  }
  priceQuad
  priceTriple
  priceDouble
`;

const UMRAH_PROGRAM = `
  badge
  tier
  tags {
    ${BULLET}
  }
  releaseDate
  title
  season
  route
  travelDates
  duration
  headerNote
  priceDisclaimer
  logoVariant
  accentColor
  hotels {
    ${UMRAH_HOTEL_ROW}
  }
  programIncludesTitle
  programIncludes {
    ${BULLET}
  }
  programExcludesTitle
  programExcludes {
    ${BULLET}
  }
  notesTitle
  notes {
    ${BULLET}
  }
  documentsTitle
  requiredDocuments {
    ${BULLET}
  }
  ritualsTitle
  showRituals
  rituals {
    ${RITUAL_CARD}
  }
`;

const UMRAH_TABLE_LABELS = `
  tripDatesLabel
  routeLabel
  duration
  madinahHeader
  makkahHeader
  perPersonHeader
  doubleColumn
  tripleColumn
  quadColumn
  currency
  issueDateLabel
  logoTagline
`;

const UMRAH_PREMIUM = `
  badge
  title
  duration
  haramainTrain
  packages {
    ${UMRAH_PACKAGE}
  }
`;

const UMRAH_ECONOMY = `
  badge
  title
  duration
  route
  travelDates {
    ${BULLET}
  }
  fridayPrayers {
    ${BULLET}
  }
  package {
    ${UMRAH_PACKAGE}
  }
`;

const POLICY_LIST = `
  title
  items {
    ${BULLET}
  }
`;

const UMRAH_POLICIES = `
  title
  inclusions {
    ${POLICY_LIST}
  }
  exclusions {
    ${POLICY_LIST}
  }
  exchangeRateTitle
  exchangeRate
  exchangeRateNote
  roomPolicyTitle
  roomPolicyDescription
  paymentPolicyTitle
  initialPayment
  finalPayment
  paymentNote
  cancellationTitle
  cancellationRules {
    period
    penaltyPercent
  }
  documentsTitle
  documents {
    ${POLICY_LIST}
  }
  cancellationPenaltyText
`;

const SEO = `
  metaTitle
  metaDescription
  keywords
  metaImage {
    url
    alternativeText
  }
`;

export const HAJ_PAGE_QUERY = `
  query GetHajPage($locale: I18NLocaleCode!) {
    hajPage(locale: $locale) {
      documentId
      hero {
        ${HERO}
      }
      servicesSection {
        ${SERVICES_SECTION}
      }
      vipPackage {
        ${HAJ_PACKAGE}
      }
      distinguishedPackage {
        ${HAJ_PACKAGE}
      }
      packages {
        ${HAJ_PACKAGE}
      }
      pricingLabels {
        ${PRICING_LABELS}
      }
      stepsSection {
        ${STEPS_SECTION}
      }
      seo {
        ${SEO}
      }
    }
  }
`;

export const UMRAH_PAGE_QUERY = `
  query GetUmrahPage($locale: I18NLocaleCode!) {
    umrahPage(locale: $locale) {
      documentId
      hero {
        ${HERO}
      }
      stepsSection {
        ${STEPS_SECTION}
      }
      programsSectionTitle
      programsSectionSubtitle
      programs {
        ${UMRAH_PROGRAM}
      }
      premiumSection {
        ${UMRAH_PREMIUM}
      }
      economySection {
        ${UMRAH_ECONOMY}
      }
      policies {
        ${UMRAH_POLICIES}
      }
      pricingLabels {
        ${PRICING_LABELS}
      }
      tableLabels {
        ${UMRAH_TABLE_LABELS}
      }
      seo {
        ${SEO}
      }
    }
  }
`;
