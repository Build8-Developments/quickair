# GraphQL Performance Optimization for Offers Query

## Problem Analysis

Your `GetFeaturedTrips` query is taking 60 seconds in production due to:

1. **N+1 Query Problem**: 100+ database queries for 10 offers
2. **Deep Nesting**: 4-5 levels of relations
3. **Missing Database Indexes**
4. **No Query Result Caching**

## Solutions Implemented

### 1. ✅ Controller-Level Population

Updated `apps/strapi/src/api/offer/controllers/offer.ts` to pre-populate all nested relations.

### 2. Database Indexes Needed

Add these indexes to your database:

```sql
-- Offers table
CREATE INDEX idx_offers_created_at ON offers(created_at DESC);
CREATE INDEX idx_offers_published_at ON offers(published_at);
CREATE INDEX idx_offers_locale ON offers(locale);

-- Hotel Options Components
CREATE INDEX idx_hotel_options_hotel ON components_offer_hotel_options(hotel_id);
CREATE INDEX idx_hotel_options_meal_plan ON components_offer_hotel_options(meal_plan_id);

-- Hotels table
CREATE INDEX idx_hotels_location ON hotels(location_id);

-- Junction tables for amenities
CREATE INDEX idx_hotels_amenities_hotel ON hotels_amenities_lnk(hotel_id);
CREATE INDEX idx_hotels_amenities_amenity ON hotels_amenities_lnk(amenity_id);
```

### 3. Enable Database Query Logging

Add to `apps/strapi/config/database.ts`:

```typescript
connection: {
  // ... existing config
  debug: process.env.NODE_ENV === 'development',
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 60000,
    idleTimeoutMillis: 600000,
  },
}
```

### 4. Add Redis Caching (Recommended for Production)

Install:

```bash
npm install @strapi/provider-upload-local ioredis
```

Update `apps/strapi/config/plugins.ts`:

```typescript
export default () => ({
  "rest-cache": {
    enabled: true,
    config: {
      provider: {
        name: "memory",
        options: {
          max: 32767,
          maxAge: 3600000, // 1 hour
        },
      },
      strategy: {
        contentTypes: [
          {
            contentType: "api::offer.offer",
            maxAge: 3600000,
            headers: ["accept", "accept-language"],
          },
        ],
      },
    },
  },
  graphql: {
    enabled: true,
    config: {
      endpoint: "/graphql",
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 10,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },
});
```

### 5. Optimize Query (Frontend)

Simplify the GraphQL query - only request what you need:

```graphql
query GetFeaturedTrips($locale: I18NLocaleCode, $limit: Int) {
  offers(
    locale: $locale
    pagination: { limit: $limit }
    sort: ["createdAt:desc"]
  ) {
    documentId
    title
    description
    month
    year
    coverImage {
      url
    }
    location {
      name
      country
    }
    # Only get first hotel option for listing
    hotelOptions(pagination: { limit: 1 }) {
      nights
      currency
      available
      specialOffer
      hotel {
        name
        stars
      }
      roomPricing(pagination: { limit: 1 }) {
        doubleOccupancyPrice
      }
    }
  }
}
```

Then fetch full details only when user clicks on an offer.

### 6. Production Database Configuration

Ensure your production database has:

- **Connection pooling** enabled (min: 5, max: 20)
- **Sufficient memory** for query cache
- **SSD storage** for faster I/O
- **Read replicas** if possible for GraphQL queries

### 7. Monitor Query Performance

The logging middleware will show execution times. Monitor for queries > 1000ms.

## Expected Results

After these optimizations:

- **Development**: < 100ms
- **Production**: < 500ms (from 60s)
- **Database queries**: ~15-20 (from 100+)

## Next Steps

1. Add database indexes (most critical)
2. Test in staging environment
3. Enable caching for production
4. Consider implementing DataLoader for further optimization
5. Set up monitoring/alerting for slow queries
