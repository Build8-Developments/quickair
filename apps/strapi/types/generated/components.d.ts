import type { Schema, Struct } from '@strapi/strapi';

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
    currency: Schema.Attribute.Enumeration<['EGP', 'USD', 'EUR', 'GBP']> &
      Schema.Attribute.Required;
    gallery: Schema.Attribute.Media<'images', true>;
    hotelName: Schema.Attribute.String & Schema.Attribute.Required;
    kidsPricing: Schema.Attribute.Component<'offer.kids-pricing', true>;
    location: Schema.Attribute.String;
    mealPlan: Schema.Attribute.String;
    nights: Schema.Attribute.Integer & Schema.Attribute.Required;
    notes: Schema.Attribute.Text;
    roomPricing: Schema.Attribute.Component<'offer.room-pricing', true>;
    stars: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
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
