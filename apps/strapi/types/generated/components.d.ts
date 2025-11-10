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
    ageFrom: Schema.Attribute.Integer & Schema.Attribute.Required;
    ageTo: Schema.Attribute.Integer & Schema.Attribute.Required;
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
    currency: Schema.Attribute.Enumeration<['EGP', 'USD', 'EUR', 'GBP']> &
      Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    inclusions: Schema.Attribute.Component<'offer.trip-inclusion', true>;
    pricePerPerson: Schema.Attribute.Decimal & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OfferRoomPricing extends Struct.ComponentSchema {
  collectionName: 'components_offer_room_pricings';
  info: {
    description: 'Detailed pricing for different room types and occupancy';
    displayName: 'Room Pricing';
  };
  attributes: {
    doublePrice: Schema.Attribute.Decimal;
    notes: Schema.Attribute.Text;
    roomType: Schema.Attribute.String & Schema.Attribute.Required;
    singlePrice: Schema.Attribute.Decimal;
    triplePrice: Schema.Attribute.Decimal;
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
      'shared.open-graph': SharedOpenGraph;
      'shared.seo': SharedSeo;
    }
  }
}
