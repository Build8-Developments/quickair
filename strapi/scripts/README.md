# Strapi Scripts

## Seed Offers Script (with i18n Support)

Seeds the Strapi database with offer data from JSON files with full internationalization support (English and Arabic).

### Directory Structure

```
docs/offers/json/
├── bali.json           # English data
├── Istanbul.json
├── sharm.json
├── beirut.json
├── hurgada.json
├── sokhna.json
├── Sahl-Hasheesh.json
└── ar/                 # Arabic translations
    ├── bali.json
    ├── Istanbul.json
    ├── sharm.json
    ├── beirut.json
    ├── hurgada.json
    ├── sokhna.json
    └── Sahl-Hasheesh.json
```

### Prerequisites

1. Strapi must be running (`npm run dev` in the strapi directory)
2. Arabic locale must be enabled in Strapi Admin:
   - Go to Settings → Internationalization
   - Add Arabic (ar) locale if not present
3. Create an API token in Strapi Admin:
   - Go to Settings → API Tokens
   - Create a new token with "Full access" permissions
   - Copy the token

### Configuration

Set the following environment variables:

```bash
# In strapi/.env or export in terminal
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token-here
```

### Usage

```bash
# From the strapi directory
npm run seed:offers

# Or directly
node scripts/seed-offers.js
```

### How i18n Works

The script follows Strapi 5's localization model:

1. **Same documentId across locales**: Each entity (location, hotel, offer) has ONE documentId that's shared between EN and AR versions
2. **EN first, then AR**: Creates English version first, then adds Arabic as a localization
3. **Shared vs Localized fields**:
   - **Shared** (same in both languages): Hotel names, prices, star ratings, slugs, coordinates
   - **Localized** (different per language): Titles, descriptions, inclusions/exclusions text, optional trip names

### What Gets Localized

| Entity    | Localized Fields                                                    | Shared Fields                            |
| --------- | ------------------------------------------------------------------- | ---------------------------------------- |
| Location  | name, country, description, shortDescription                        | slug, type, featured                     |
| Hotel     | shortDescription                                                    | name, slug, stars, location              |
| Meal Plan | name                                                                | -                                        |
| Offer     | title, description, inclusions, exclusions, optionalTrips, policies | slug, month, year, hotelOptions (prices) |

### Data Mapping

| JSON Field                | Strapi Field                                 |
| ------------------------- | -------------------------------------------- |
| `offer.title`             | `Offer.title` (localized)                    |
| `offer.validity`          | `Offer.month`                                |
| `hotels[].hotel_name`     | `Hotel.name` (NOT localized - stays English) |
| `hotels[].rating`         | `Hotel.stars`                                |
| `hotels[].prices_egp/usd` | `HotelOption.roomPricing`                    |
| `included[]`              | `Offer.inclusions` (localized)               |
| `not_included[]`          | `Offer.exclusions` (localized)               |
| `optional_tours[]`        | `Offer.optionalTrips` (localized)            |

### Frontend Usage

Since EN and AR share the same `documentId`, fetching works the same way:

```javascript
// Fetch English version
const enOffer = await fetch("/api/offers/abc123?locale=en");

// Fetch Arabic version (same documentId!)
const arOffer = await fetch("/api/offers/abc123?locale=ar");
```

### Notes

- Images use placeholder URLs (`https://placehold.co/800x600`)
- Existing entities are skipped (checked by slug)
- All created entities are automatically published in both locales
- Hotel names intentionally stay in English for consistency
- If AR JSON file is missing, only EN version is created

## Run Migrations Script

Runs database migrations from the `database/migrations` directory.

```bash
npm run migrations
```
