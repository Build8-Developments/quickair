# API Architecture Documentation

## 📁 Directory Structure

```
apps/frontend/lib/api/
├── client.js                    # Base API client (GraphQL & REST)
├── index.js                     # Main export point
├── queries/
│   └── location.js              # Location GraphQL queries
├── services/
│   └── location.js              # Location service layer
└── hooks/
    └── useLocation.js           # React hooks for locations
```

---

## 🏗️ Architecture Overview

### 1. **Client Layer** (`client.js`)

Base functions for making API requests.

```javascript
import { executeGraphQL, executeREST } from "@/lib/api/client";

// GraphQL request
const data = await executeGraphQL(query, variables, options);

// REST request
const data = await executeREST("/api/endpoint", options);
```

### 2. **Queries Layer** (`queries/*.js`)

GraphQL query definitions (Strapi 5 format - no data/attributes wrapper).

```javascript
import { GET_ALL_LOCATIONS } from "@/lib/api/queries/location";
```

### 3. **Services Layer** (`services/*.js`)

Business logic and data transformation.

```javascript
import { locationService } from "@/lib/api";

const locations = await locationService.searchLocations({
  query: "bali",
  locale: "en",
  limit: 10,
});
```

### 4. **Hooks Layer** (`hooks/*.js`)

React hooks for client components with state management.

```javascript
import { useLocationSearch } from "@/lib/api/hooks/useLocation";

const { locations, loading, error } = useLocationSearch({
  query: searchQuery,
  locale: language,
});
```

---

## 🎯 Usage Examples

### Example 1: Search Locations (Client Component)

```javascript
"use client";
import { useLocationSearch } from "@/lib/api/hooks/useLocation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const { locations, loading } = useLocationSearch({
    query,
    locale: "en",
    debounceMs: 300,
  });

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading && <p>Loading...</p>}
      {locations.map((loc) => (
        <div key={loc.documentId}>{loc.name}</div>
      ))}
    </div>
  );
}
```

### Example 2: Get All Locations (Client Component)

```javascript
"use client";
import { useAllLocations } from "@/lib/api/hooks/useLocation";

export default function LocationList() {
  const { locations, loading, error, refetch } = useAllLocations({
    locale: "ar",
    limit: 50,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {locations.map((loc) => (
        <div key={loc.documentId}>{loc.name}</div>
      ))}
    </div>
  );
}
```

### Example 3: Server Component (Next.js)

```javascript
import { locationService } from "@/lib/api";

export default async function LocationPage({ params }) {
  const location = await locationService.getLocationBySlug({
    slug: params.slug,
    locale: "en",
  });

  return <div>{location.name}</div>;
}
```

---

## 📝 Adding a New Service (e.g., Offers)

### Step 1: Create Queries

```javascript
// lib/api/queries/offer.js
export const GET_ALL_OFFERS = `
  query GetAllOffers($locale: I18NLocaleCode, $pagination: PaginationArg) {
    offers(locale: $locale, pagination: $pagination) {
      documentId
      title
      slug
      month
      year
    }
  }
`;
```

### Step 2: Create Service

```javascript
// lib/api/services/offer.js
import { executeGraphQL } from "../client";
import { GET_ALL_OFFERS } from "../queries/offer";

export async function getAllOffers({ locale = "en", limit = 10 } = {}) {
  try {
    const data = await executeGraphQL(GET_ALL_OFFERS, {
      locale,
      pagination: { limit },
    });
    return data?.offers || [];
  } catch (error) {
    console.error("[OfferService] Error:", error);
    return [];
  }
}
```

### Step 3: Create Hook (Optional)

```javascript
// lib/api/hooks/useOffer.js
"use client";
import { useState, useEffect } from "react";
import { offerService } from "../index";

export function useAllOffers({ locale = "en", limit = 10 } = {}) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const data = await offerService.getAllOffers({ locale, limit });
      setOffers(data);
      setLoading(false);
    }
    fetch();
  }, [locale, limit]);

  return { offers, loading };
}
```

### Step 4: Export in index.js

```javascript
// lib/api/index.js
import * as locationService from "./services/location";
import * as offerService from "./services/offer";

export { locationService, offerService };
```

### Step 5: Use It!

```javascript
import { offerService } from "@/lib/api";
// or
import { useAllOffers } from "@/lib/api/hooks/useOffer";
```

---

## 🔄 GraphQL vs REST

### When to use GraphQL:

- Fetching structured data (locations, offers, etc.)
- Need specific fields only
- Complex nested queries

### When to use REST:

- Simple CRUD operations
- File uploads
- Custom endpoints

---

## ⚠️ Important Notes

### Strapi 5 GraphQL Structure

**NO `data` and `attributes` wrapper!**

❌ **Wrong** (Strapi 4):

```graphql
{
  locations {
    data {
      id
      attributes {
        name
      }
    }
  }
}
```

✅ **Correct** (Strapi 5):

```graphql
{
  locations {
    documentId
    name
  }
}
```

### Error Handling

All services return empty arrays/objects on error and log to console.

```javascript
const locations = await locationService.getAllLocations({ locale: "en" });
// Always returns an array, never throws
```

### Caching

Configure caching in the `executeGraphQL` function:

```javascript
const data = await executeGraphQL(query, variables, {
  cache: "force-cache", // or 'no-store'
  next: { revalidate: 3600 }, // revalidate every hour
});
```

---

## 🚀 Best Practices

1. **Use Services for Server Components**

   ```javascript
   const data = await locationService.getAllLocations({ locale: "en" });
   ```

2. **Use Hooks for Client Components**

   ```javascript
   const { locations, loading } = useAllLocations({ locale: "en" });
   ```

3. **Always Specify Locale**

   ```javascript
   searchLocations({ query: "bali", locale: language });
   ```

4. **Handle Loading States**

   ```javascript
   if (loading) return <Spinner />;
   if (error) return <Error message={error} />;
   ```

5. **Use documentId for Keys**
   ```javascript
   {
     locations.map((loc) => <div key={loc.documentId}>{loc.name}</div>);
   }
   ```

---

## 📚 API Reference

### Location Service

```typescript
locationService.getAllLocations({ locale, limit, sort });
locationService.searchLocations({ query, locale, limit });
locationService.getFeaturedLocations({ locale, limit });
locationService.getLocationBySlug({ slug, locale });
locationService.getLocationsByType({ locale, limit });
```

### Location Hooks

```typescript
useLocationSearch({ query, locale, debounceMs });
useAllLocations({ locale, limit });
useFeaturedLocations({ locale, limit });
```

---

**Last Updated**: November 10, 2025
