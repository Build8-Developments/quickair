# QuickAir Project Documentation

QuickAir is a comprehensive travel and pilgrimage booking platform built with a modern web stack. It features a localized frontend (Next.js) and a powerful headless CMS (Strapi) for content management.

## 🏗 Architecture Overview

### Frontend (Next.js)
- **Framework:** Next.js 15 (App Router) with React 19.
- **Styling:** Material UI (MUI), Bootstrap 5, and custom Vanilla CSS.
- **Localization:** i18next support for English (`en`) and Arabic (`ar`) with RTL support.
- **Mapping:** Leaflet and Google Maps API for location-based features.
- **AI Integration:** Google Generative AI and OpenAI for the built-in AI Chatbot.
- **Data Fetching:** Custom API layer supporting both GraphQL (preferred) and REST.

### Backend (Strapi CMS)
- **Version:** Strapi 5.
- **Database:** SQLite (development) and PostgreSQL (production).
- **API:** GraphQL and REST endpoints.
- **Localization:** Shared `documentId` model across locales (new in Strapi 5).
- **Automation:** Custom scripts for database seeding (Offers, Hotels, Pilgrimage pages).

## 📂 Project Structure

```text
quickair/
├── frontend/               # Next.js Application
│   ├── app/                # App Router (localized routes [locale])
│   ├── components/         # UI Components (Layout, Chatbot, Shared)
│   ├── lib/api/            # API Layer (Clients, Services, Hooks, Queries)
│   ├── locales/            # i18n translation files
│   └── public/             # Static assets (images, CSS, fonts)
├── strapi/                 # Strapi CMS
│   ├── src/api/            # Content Type definitions and logic
│   ├── config/             # Strapi server and plugin configuration
│   └── scripts/            # Seed scripts and migrations
├── docs/                   # Project documentation and raw data
│   ├── offers/             # Offer data (PDFs and JSON for seeding)
│   └── Q Air Branding/     # Brand assets and guidelines
└── scripts/                # Infrastructure scripts (backup, sync)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18.0.0 <= 22.x.x)
- npm

### Development Setup

1. **Start the Backend (Strapi):**
   ```bash
   cd strapi
   npm install
   npm run dev
   ```
   *Admin URL: http://localhost:1337/admin*

2. **Start the Frontend (Next.js):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *App URL: http://localhost:3000/en*

### Database Seeding
To populate the CMS with initial data, use the following scripts from the `strapi` directory:
- `npm run seed:offers` - Seed travel offers from `docs/offers/json`.
- `npm run seed:umrah-hotels` - Seed hotels for Umrah services.
- `npm run seed:pilgrimage` - Seed Haj and Umrah content pages.

## 🛠 Development Conventions

### API Layer Pattern
Follow the 4-layer architecture in `frontend/lib/api/`:
1. **Queries:** Define GraphQL strings in `queries/*.js`.
2. **Client:** Use `executeGraphQL` from `client.js`.
3. **Services:** Implement business logic and data fetching in `services/*.js`.
4. **Hooks:** Create React hooks in `hooks/*.js` for client-side components.

### Strapi 5 GraphQL
**Important:** Strapi 5 removes the `data` and `attributes` wrappers from GraphQL responses.
```graphql
# Correct (Strapi 5)
{
  locations {
    documentId
    name
  }
}
```

### Localization (i18n)
- All user-facing text must use the `useTranslation` hook or the `LanguageContext`.
- Locale-specific routes are handled under `app/[locale]`.
- Direction (LTR/RTL) is automatically managed based on the current locale.

## 📝 Key Commands
- `npm run build`: Build for production (both frontend and strapi).
- `npm run lint`: Run ESLint for the frontend.
- `npm run migrations`: Run database migrations for Strapi.
