import type { Schema, Struct } from '@strapi/strapi';

export interface HotelAmenity extends Struct.ComponentSchema {
  collectionName: 'components_hotel_amenities';
  info: {
    description: 'Hotel facilities and amenities';
    displayName: 'Amenity';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      [
        'General',
        'Room Features',
        'Activities',
        'Food & Drink',
        'Services',
        'Internet',
        'Transportation',
        'Wellness',
      ]
    > &
      Schema.Attribute.DefaultTo<'General'>;
    icon: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HotelCoordinates extends Struct.ComponentSchema {
  collectionName: 'components_hotel_coordinates';
  info: {
    description: 'Geographic coordinates for hotel location';
    displayName: 'Coordinates';
  };
  attributes: {
    latitude: Schema.Attribute.Decimal & Schema.Attribute.Required;
    longitude: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

export interface MealPlanMealInclusion extends Struct.ComponentSchema {
  collectionName: 'components_meal_plan_meal_inclusions';
  info: {
    description: 'Individual meal or beverage included in a meal plan';
    displayName: 'Meal Inclusion';
  };
  attributes: {
    description: Schema.Attribute.String;
    item: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OfferExclusion extends Struct.ComponentSchema {
  collectionName: 'components_offer_exclusions';
  info: {
    description: 'Items NOT included in the offer';
    displayName: 'Exclusion';
  };
  attributes: {
    item: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OfferHotelOption extends Struct.ComponentSchema {
  collectionName: 'components_offer_hotel_options';
  info: {
    description: 'Individual hotel package with pricing';
    displayName: 'Hotel Option';
  };
  attributes: {
    available: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    currency: Schema.Attribute.Enumeration<['EGP', 'USD', 'EUR', 'GBP']> &
      Schema.Attribute.Required;
    hotel: Schema.Attribute.Relation<'oneToOne', 'api::hotel.hotel'>;
    kidsPricing: Schema.Attribute.Component<'offer.kids-pricing', true>;
    mealPlan: Schema.Attribute.Relation<'oneToOne', 'api::meal-plan.meal-plan'>;
    nights: Schema.Attribute.Integer & Schema.Attribute.Required;
    notes: Schema.Attribute.Text;
    roomPricing: Schema.Attribute.Component<'offer.room-pricing', true>;
    specialOffer: Schema.Attribute.String;
  };
}

export interface OfferInclusion extends Struct.ComponentSchema {
  collectionName: 'components_offer_inclusions';
  info: {
    description: 'Items included in the offer';
    displayName: 'Inclusion';
  };
  attributes: {
    item: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OfferKidsPricing extends Struct.ComponentSchema {
  collectionName: 'components_offer_kids_pricings';
  info: {
    description: 'Age-based pricing for children';
    displayName: 'Kids Pricing';
  };
  attributes: {
    ageFrom: Schema.Attribute.Integer;
    ageTo: Schema.Attribute.Integer;
    discount: Schema.Attribute.Integer;
    isFree: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    notes: Schema.Attribute.Text;
    price: Schema.Attribute.Decimal;
  };
}

export interface OfferOptionalTrip extends Struct.ComponentSchema {
  collectionName: 'components_offer_optional_trips';
  info: {
    description: 'Optional excursions/adventures available with the offer';
    displayName: 'Optional Trip';
  };
  attributes: {
    currency: Schema.Attribute.Enumeration<['EGP', 'USD', 'EUR', 'GBP']>;
    description: Schema.Attribute.Text;
    inclusions: Schema.Attribute.Component<'offer.trip-inclusion', true>;
    pricePerPerson: Schema.Attribute.Decimal;
    title: Schema.Attribute.String;
  };
}

export interface OfferRoomPricing extends Struct.ComponentSchema {
  collectionName: 'components_offer_room_pricings';
  info: {
    description: 'Per-person pricing based on room occupancy for different room categories';
    displayName: 'Room Pricing';
  };
  attributes: {
    doubleOccupancyPrice: Schema.Attribute.Decimal;
    notes: Schema.Attribute.Text;
    roomType: Schema.Attribute.String & Schema.Attribute.Required;
    singleOccupancyPrice: Schema.Attribute.Decimal;
    tripleOccupancyPrice: Schema.Attribute.Decimal;
  };
}

export interface OfferTripInclusion extends Struct.ComponentSchema {
  collectionName: 'components_offer_trip_inclusions';
  info: {
    description: 'Items included in an optional trip';
    displayName: 'Trip Inclusion';
  };
  attributes: {
    item: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PilgrimageBullet extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_bullets';
  info: {
    displayName: 'Bullet';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PilgrimageCancellationRule extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_cancellation_rules';
  info: {
    displayName: 'Cancellation Rule';
    icon: 'calendar';
  };
  attributes: {
    penaltyPercent: Schema.Attribute.Decimal & Schema.Attribute.Required;
    period: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PilgrimageHajPackage extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_haj_packages';
  info: {
    displayName: 'Haj Package';
    icon: 'gift';
  };
  attributes: {
    badge: Schema.Attribute.String;
    features: Schema.Attribute.Component<'pilgrimage.bullet', true>;
    featuresTitle: Schema.Attribute.String;
    footerNote: Schema.Attribute.Text;
    hotels: Schema.Attribute.Component<'pilgrimage.hotel-card', true>;
    hotelsTitle: Schema.Attribute.String;
    notePrimary: Schema.Attribute.Text;
    noteSecondary: Schema.Attribute.Text;
    pricing: Schema.Attribute.Component<'pilgrimage.room-pricing', false>;
    pricingTitle: Schema.Attribute.String;
    rituals: Schema.Attribute.Component<'pilgrimage.ritual-card', true>;
    ritualsTitle: Schema.Attribute.String;
    tags: Schema.Attribute.Component<'pilgrimage.bullet', true>;
    tier: Schema.Attribute.Enumeration<
      ['economy', 'standard', 'premium', 'vip', 'distinguished']
    >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PilgrimageHero extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_heroes';
  info: {
    displayName: 'Hero';
    icon: 'picture';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    dateOrSeason: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PilgrimageHotelCard extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_hotel_cards';
  info: {
    displayName: 'Hotel Card';
    icon: 'house';
  };
  attributes: {
    feature1: Schema.Attribute.String;
    feature2: Schema.Attribute.String;
    hotel: Schema.Attribute.Relation<'oneToOne', 'api::hotel.hotel'>;
    hotelSlug: Schema.Attribute.String;
    location: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    nightsDates: Schema.Attribute.String;
  };
}

export interface PilgrimagePolicyList extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_policy_lists';
  info: {
    displayName: 'Policy List';
    icon: 'bulletList';
  };
  attributes: {
    items: Schema.Attribute.Component<'pilgrimage.bullet', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PilgrimagePricingLabels extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_pricing_labels';
  info: {
    displayName: 'Pricing Labels';
    icon: 'priceTag';
  };
  attributes: {
    currency: Schema.Attribute.String;
    doubleRoom: Schema.Attribute.String;
    doubleRoomDesc: Schema.Attribute.String;
    madinah: Schema.Attribute.String;
    makkah: Schema.Attribute.String;
    nights: Schema.Attribute.String;
    perPerson: Schema.Attribute.String;
    quadRoom: Schema.Attribute.String;
    quadRoomDesc: Schema.Attribute.String;
    reservationAmount: Schema.Attribute.String;
    tripleRoom: Schema.Attribute.String;
    tripleRoomDesc: Schema.Attribute.String;
  };
}

export interface PilgrimageRitualCard extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_ritual_cards';
  info: {
    displayName: 'Ritual Card';
    icon: 'landscape';
  };
  attributes: {
    description: Schema.Attribute.Text;
    featureBullets: Schema.Attribute.Component<'pilgrimage.bullet', true>;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PilgrimageRoomPricing extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_room_pricings';
  info: {
    displayName: 'Room Pricing';
    icon: 'priceTag';
  };
  attributes: {
    doubleRoom: Schema.Attribute.String;
    note: Schema.Attribute.String;
    quadRoom: Schema.Attribute.String;
    reservationAmount: Schema.Attribute.String;
    tripleRoom: Schema.Attribute.String;
  };
}

export interface PilgrimageSectionHeader extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_section_headers';
  info: {
    displayName: 'Section Header';
    icon: 'heading';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface PilgrimageServiceCard extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_service_cards';
  info: {
    displayName: 'Service Card';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Enumeration<
      ['star', 'plane', 'users', 'train', 'book', 'list']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'star'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PilgrimageServicesSection extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_services_sections';
  info: {
    displayName: 'Services Section';
    icon: 'grid';
  };
  attributes: {
    header: Schema.Attribute.Component<'pilgrimage.section-header', false>;
    services: Schema.Attribute.Component<'pilgrimage.service-card', true>;
  };
}

export interface PilgrimageStepsSection extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_steps_sections';
  info: {
    displayName: 'Steps Section';
    icon: 'layer';
  };
  attributes: {
    header: Schema.Attribute.Component<'pilgrimage.section-header', false>;
    steps: Schema.Attribute.Component<'pilgrimage.text-block', true>;
  };
}

export interface PilgrimageTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_text_blocks';
  info: {
    displayName: 'Text Block';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PilgrimageUmrahEconomySection extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_umrah_economy_sections';
  info: {
    displayName: 'Umrah Economy Section';
    icon: 'layer';
  };
  attributes: {
    badge: Schema.Attribute.String;
    duration: Schema.Attribute.String;
    fridayPrayers: Schema.Attribute.Component<'pilgrimage.bullet', true>;
    package: Schema.Attribute.Component<'pilgrimage.umrah-package-card', false>;
    route: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    travelDates: Schema.Attribute.Component<'pilgrimage.bullet', true>;
  };
}

export interface PilgrimageUmrahHotelRow extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_umrah_hotel_rows';
  info: {
    description: 'A single hotel row in an Umrah program (Madinah hotel relation + Makkah hotel relation + per-person pricing)';
    displayName: 'Umrah Hotel Row';
    icon: 'house';
  };
  attributes: {
    madinahHotel: Schema.Attribute.Relation<'oneToOne', 'api::hotel.hotel'>;
    madinahHotelLabel: Schema.Attribute.String;
    madinahMeals: Schema.Attribute.String;
    madinahNights: Schema.Attribute.String;
    makkahHotel: Schema.Attribute.Relation<'oneToOne', 'api::hotel.hotel'>;
    makkahHotelLabel: Schema.Attribute.String;
    makkahMeals: Schema.Attribute.String;
    makkahNights: Schema.Attribute.String;
    priceDouble: Schema.Attribute.String;
    priceQuad: Schema.Attribute.String;
    priceTriple: Schema.Attribute.String;
  };
}

export interface PilgrimageUmrahPackageCard extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_umrah_package_cards';
  info: {
    displayName: 'Umrah Package Card';
    icon: 'stack';
  };
  attributes: {
    isFeatured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    madinahHotel: Schema.Attribute.String & Schema.Attribute.Required;
    madinahMeals: Schema.Attribute.String;
    madinahNights: Schema.Attribute.Integer & Schema.Attribute.Required;
    makkahHotel: Schema.Attribute.String & Schema.Attribute.Required;
    makkahMeals: Schema.Attribute.String;
    makkahNights: Schema.Attribute.Integer & Schema.Attribute.Required;
    priceDouble: Schema.Attribute.String;
    priceQuad: Schema.Attribute.String;
    priceTriple: Schema.Attribute.String;
  };
}

export interface PilgrimageUmrahPolicies extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_umrah_policies';
  info: {
    displayName: 'Umrah Policies';
    icon: 'file';
  };
  attributes: {
    cancellationPenaltyText: Schema.Attribute.String;
    cancellationRules: Schema.Attribute.Component<
      'pilgrimage.cancellation-rule',
      true
    >;
    cancellationTitle: Schema.Attribute.String;
    documents: Schema.Attribute.Component<'pilgrimage.policy-list', false>;
    documentsTitle: Schema.Attribute.String;
    exchangeRate: Schema.Attribute.Decimal;
    exchangeRateNote: Schema.Attribute.Text;
    exchangeRateTitle: Schema.Attribute.String;
    exclusions: Schema.Attribute.Component<'pilgrimage.policy-list', false>;
    finalPayment: Schema.Attribute.String;
    inclusions: Schema.Attribute.Component<'pilgrimage.policy-list', false>;
    initialPayment: Schema.Attribute.String;
    paymentNote: Schema.Attribute.Text;
    paymentPolicyTitle: Schema.Attribute.String;
    roomPolicyDescription: Schema.Attribute.Text;
    roomPolicyTitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PilgrimageUmrahPremiumSection extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_umrah_premium_sections';
  info: {
    displayName: 'Umrah Premium Section';
    icon: 'crown';
  };
  attributes: {
    badge: Schema.Attribute.String;
    duration: Schema.Attribute.String;
    haramainTrain: Schema.Attribute.String;
    packages: Schema.Attribute.Component<'pilgrimage.umrah-package-card', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PilgrimageUmrahProgram extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_umrah_programs';
  info: {
    description: 'A complete Umrah program (one offer/sheet) with hotels and policies';
    displayName: 'Umrah Program';
    icon: 'stack';
  };
  attributes: {
    accentColor: Schema.Attribute.Enumeration<['red', 'pink', 'default']> &
      Schema.Attribute.DefaultTo<'default'>;
    badge: Schema.Attribute.String;
    documentsTitle: Schema.Attribute.String;
    duration: Schema.Attribute.String;
    headerNote: Schema.Attribute.Text;
    hotels: Schema.Attribute.Component<'pilgrimage.umrah-hotel-row', true>;
    logoVariant: Schema.Attribute.Enumeration<['umrah', 'ramadan', 'default']> &
      Schema.Attribute.DefaultTo<'default'>;
    notes: Schema.Attribute.Component<'pilgrimage.bullet', true>;
    notesTitle: Schema.Attribute.String;
    priceDisclaimer: Schema.Attribute.String;
    programExcludes: Schema.Attribute.Component<'pilgrimage.bullet', true>;
    programExcludesTitle: Schema.Attribute.String;
    programIncludes: Schema.Attribute.Component<'pilgrimage.bullet', true>;
    programIncludesTitle: Schema.Attribute.String;
    releaseDate: Schema.Attribute.String;
    requiredDocuments: Schema.Attribute.Component<'pilgrimage.bullet', true>;
    route: Schema.Attribute.String;
    season: Schema.Attribute.String;
    tags: Schema.Attribute.Component<'pilgrimage.bullet', true>;
    tier: Schema.Attribute.Enumeration<
      ['economy', 'standard', 'premium', 'vip', 'distinguished']
    >;
    title: Schema.Attribute.Text & Schema.Attribute.Required;
    travelDates: Schema.Attribute.String;
  };
}

export interface PilgrimageUmrahTableLabels extends Struct.ComponentSchema {
  collectionName: 'components_pilgrimage_umrah_table_labels';
  info: {
    description: 'Common labels used across all Umrah program tables';
    displayName: 'Umrah Table Labels';
    icon: 'layout';
  };
  attributes: {
    currency: Schema.Attribute.String;
    doubleColumn: Schema.Attribute.String;
    duration: Schema.Attribute.String;
    issueDateLabel: Schema.Attribute.String;
    logoTagline: Schema.Attribute.String;
    madinahHeader: Schema.Attribute.String;
    makkahHeader: Schema.Attribute.String;
    perPersonHeader: Schema.Attribute.String;
    quadColumn: Schema.Attribute.String;
    routeLabel: Schema.Attribute.String;
    tripDatesLabel: Schema.Attribute.String;
    tripleColumn: Schema.Attribute.String;
  };
}

export interface SharedOpenGraph extends Struct.ComponentSchema {
  collectionName: 'components_shared_open_graphs';
  info: {
    displayName: 'openGraph';
    icon: 'project-diagram';
  };
  attributes: {
    ogDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    ogType: Schema.Attribute.String;
    ogUrl: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String;
    openGraph: Schema.Attribute.Component<'shared.open-graph', false>;
    structuredData: Schema.Attribute.JSON;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'hotel.amenity': HotelAmenity;
      'hotel.coordinates': HotelCoordinates;
      'meal-plan.meal-inclusion': MealPlanMealInclusion;
      'offer.exclusion': OfferExclusion;
      'offer.hotel-option': OfferHotelOption;
      'offer.inclusion': OfferInclusion;
      'offer.kids-pricing': OfferKidsPricing;
      'offer.optional-trip': OfferOptionalTrip;
      'offer.room-pricing': OfferRoomPricing;
      'offer.trip-inclusion': OfferTripInclusion;
      'pilgrimage.bullet': PilgrimageBullet;
      'pilgrimage.cancellation-rule': PilgrimageCancellationRule;
      'pilgrimage.haj-package': PilgrimageHajPackage;
      'pilgrimage.hero': PilgrimageHero;
      'pilgrimage.hotel-card': PilgrimageHotelCard;
      'pilgrimage.policy-list': PilgrimagePolicyList;
      'pilgrimage.pricing-labels': PilgrimagePricingLabels;
      'pilgrimage.ritual-card': PilgrimageRitualCard;
      'pilgrimage.room-pricing': PilgrimageRoomPricing;
      'pilgrimage.section-header': PilgrimageSectionHeader;
      'pilgrimage.service-card': PilgrimageServiceCard;
      'pilgrimage.services-section': PilgrimageServicesSection;
      'pilgrimage.steps-section': PilgrimageStepsSection;
      'pilgrimage.text-block': PilgrimageTextBlock;
      'pilgrimage.umrah-economy-section': PilgrimageUmrahEconomySection;
      'pilgrimage.umrah-hotel-row': PilgrimageUmrahHotelRow;
      'pilgrimage.umrah-package-card': PilgrimageUmrahPackageCard;
      'pilgrimage.umrah-policies': PilgrimageUmrahPolicies;
      'pilgrimage.umrah-premium-section': PilgrimageUmrahPremiumSection;
      'pilgrimage.umrah-program': PilgrimageUmrahProgram;
      'pilgrimage.umrah-table-labels': PilgrimageUmrahTableLabels;
      'shared.open-graph': SharedOpenGraph;
      'shared.seo': SharedSeo;
    }
  }
}
