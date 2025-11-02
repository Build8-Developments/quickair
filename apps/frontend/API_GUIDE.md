# Centralized API Configuration Guide

Complete guide for using the centralized API system with GraphQL and Strapi.

---

## 📁 File Structure

```
apps/frontend/
├── config/
│   └── api.js                 # API configuration & environment handling
├── lib/
│   └── graphql.js             # GraphQL client & utilities
├── services/
│   └── api.js                 # API service layer (offers, tours, etc.)
├── graphql/
│   └── seoQueries.js          # GraphQL queries for SEO
├── .env.example               # Example environment file
└── .env.local                 # Your local environment (git-ignored)
```

---

## 🚀 Quick Start

### 1. Setup Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local` with your values:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your-token-here
NEXT_PUBLIC_DEBUG=true
```

### 2. Use the API

```javascript
import api from "@/services/api";

// Get all offers
const offers = await api.offers.getAll({ locale: "en" });

// Get single offer
const offer = await api.offers.getBySlug("summer-sale", "en");
```

---

## 📖 API Reference

### Offers API

```javascript
import { offersAPI } from "@/services/api";

// Get all offers
const offers = await offersAPI.getAll({
  locale: "en", // 'en' or 'ar'
  limit: 10, // Number of items
  start: 0, // Offset for pagination
});

// Get single offer by slug
const offer = await offersAPI.getBySlug("summer-sale-2024", "en");
```

### Tours API

```javascript
import { toursAPI } from "@/services/api";

// Get all tours
const tours = await toursAPI.getAll({
  locale: "ar",
  limit: 20,
  start: 0,
});

// Get single tour
const tour = await toursAPI.getBySlug("dubai-desert-safari", "en");
```

### Destinations API

```javascript
import { destinationsAPI } from "@/services/api";

// Get all destinations
const destinations = await destinationsAPI.getAll({ locale: "en" });

// Get single destination
const destination = await destinationsAPI.getBySlug("dubai", "ar");
```

### Blogs API

```javascript
import { blogsAPI } from "@/services/api";

// Get all blog posts
const blogs = await blogsAPI.getAll({ locale: "en", limit: 5 });

// Get single blog post
const blog = await blogsAPI.getBySlug("travel-tips-2024", "en");
```

---

## 🔧 Advanced Usage

### Custom GraphQL Query

```javascript
import { graphqlRequest } from "@/lib/graphql";

const query = `
  query CustomQuery($locale: I18NLocaleCode!) {
    offers(locale: $locale) {
      data {
        id
        attributes {
          title
          price
        }
      }
    }
  }
`;

const data = await graphqlRequest(query, { locale: "en" });
```

### With Custom Options

```javascript
import { graphqlRequest } from "@/lib/graphql";
import { CACHE_CONFIG } from "@/config/api";

const data = await graphqlRequest(query, variables, {
  authenticated: true, // Use API token
  timeout: 30000, // 30 second timeout
  revalidate: 60, // Revalidate every 60 seconds
  tags: ["offers"], // Cache tags
});
```

### GraphQL Mutation (POST)

```javascript
import { graphqlMutation } from "@/lib/graphql";

const mutation = `
  mutation CreateBooking($data: BookingInput!) {
    createBooking(data: $data) {
      data {
        id
        attributes {
          tourName
          status
        }
      }
    }
  }
`;

const result = await graphqlMutation(mutation, {
  data: {
    tourName: "Dubai Safari",
    customerEmail: "user@example.com",
  },
});
```

### Batch Requests

```javascript
import { graphqlBatch } from "@/lib/graphql";

const results = await graphqlBatch([
  { query: offersQuery, variables: { locale: "en" } },
  { query: toursQuery, variables: { locale: "en" } },
  { query: destinationsQuery, variables: { locale: "en" } },
]);

const [offers, tours, destinations] = results;
```

---

## 🌍 Environment Configuration

### Development

```env
# .env.local
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_DEBUG=true
```

### Staging

```env
# .env.staging
NEXT_PUBLIC_STRAPI_URL=https://staging-api.quickair.com
NEXT_PUBLIC_ENV=staging
NEXT_PUBLIC_DEBUG=false
```

### Production

```env
# .env.production
NEXT_PUBLIC_STRAPI_URL=https://api.quickair.com
NEXT_PUBLIC_STRAPI_API_TOKEN=prod-token-here
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_DEBUG=false
```

---

## 🛠️ Utility Functions

### Format Image URLs

```javascript
import { formatImageUrl } from "@/lib/graphql";

// From Strapi object
const imageUrl = formatImageUrl(offer.image);
// Returns: https://api.quickair.com/uploads/image.jpg

// From string
const url = formatImageUrl("/uploads/photo.jpg");
// Returns: https://api.quickair.com/uploads/photo.jpg
```

### Extract Strapi Data

```javascript
import { extractStrapiData } from "@/lib/graphql";

const response = await graphqlRequest(query, variables);

// Extract array data
const offers = extractStrapiData(response, "offers");
// Returns: [{ id: 1, title: "...", ... }, ...]

// Extract single item
const offer = extractStrapiData(response, "offer");
// Returns: { id: 1, title: "...", ... }
```

### Handle Pagination

```javascript
import { extractPaginatedData } from "@/lib/graphql";

const response = await graphqlRequest(query, variables);
const { data, pagination } = extractPaginatedData(response, "offers");

console.log(pagination);
// {
//   page: 1,
//   pageSize: 10,
//   pageCount: 5,
//   total: 50
// }
```

---

## 📝 Usage Examples

### Example 1: Fetch Offers for Homepage

```javascript
"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import api from "@/services/api";

export default function OffersSection() {
  const { language } = useLanguage();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOffers() {
      try {
        const data = await api.offers.getAll({
          locale: language,
          limit: 6,
        });
        setOffers(data);
      } catch (error) {
        console.error("Failed to load offers:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOffers();
  }, [language]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="offers-grid">
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}
```

### Example 2: Tour Detail Page

```javascript
import api from "@/services/api";
import DynamicSEO from "@/components/common/DynamicSEO";

export default async function TourPage({ params }) {
  const tour = await api.tours.getBySlug(params.slug, "en");

  if (!tour) {
    return <div>Tour not found</div>;
  }

  return (
    <>
      <DynamicSEO
        contentType="tour"
        slug={params.slug}
        fallbackPage="tourSingle"
      />

      <div className="tour-detail">
        <h1>{tour.title}</h1>
        <p>{tour.description}</p>
        <span>${tour.price}</span>
      </div>
    </>
  );
}
```

### Example 3: Server Component with Caching

```javascript
import api from "@/services/api";

// This will cache for 1 hour
export default async function ToursPage() {
  const tours = await api.tours.getAll({
    locale: "en",
    limit: 20,
  });

  return (
    <div className="tours-grid">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}

// Optional: Configure revalidation
export const revalidate = 3600; // 1 hour
```

---

## 🔒 Authentication

For authenticated requests (mutations, private data):

```javascript
import { graphqlMutation } from "@/lib/graphql";

const mutation = `
  mutation UpdateProfile($data: ProfileInput!) {
    updateProfile(data: $data) {
      data {
        id
        attributes {
          name
          email
        }
      }
    }
  }
`;

// This will automatically use the API token
const result = await graphqlMutation(mutation, {
  data: { name: "John Doe" },
});
```

---

## 🐛 Error Handling

```javascript
import { GraphQLError } from "@/lib/graphql";

try {
  const data = await api.offers.getAll();
} catch (error) {
  if (error instanceof GraphQLError) {
    // GraphQL-specific errors
    console.error("GraphQL errors:", error.errors);
  } else {
    // Network or other errors
    console.error("Request failed:", error.message);
  }
}
```

---

## ⚡ Performance Tips

1. **Use Server Components** when possible for automatic caching
2. **Set appropriate revalidation** times based on content freshness
3. **Use cache tags** for on-demand revalidation
4. **Batch requests** when fetching multiple independent queries
5. **Optimize images** by requesting specific sizes from Strapi

---

## 🔍 Debugging

Enable debug mode in `.env.local`:

```env
NEXT_PUBLIC_DEBUG=true
```

This will log:

- API configuration on startup
- All GraphQL requests
- All GraphQL responses
- Errors with full details

---

## ✅ Best Practices

1. **Always use the API service layer** (`services/api.js`) instead of direct GraphQL
2. **Handle loading states** in client components
3. **Handle errors gracefully** with try-catch
4. **Use the correct locale** based on language context
5. **Leverage caching** for better performance
6. **Don't expose API tokens** in client-side code

---

## 📚 Additional Resources

- [Strapi GraphQL Documentation](https://docs.strapi.io/developer-docs/latest/plugins/graphql.html)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [React Query Integration](https://tanstack.com/query) (optional, for advanced caching)

---

Need help? Check the console logs when `NEXT_PUBLIC_DEBUG=true` is enabled!
