# QuickAir

A full-stack travel platform built with **Next.js 15** and **Strapi 5**, designed for multilingual travel discovery, offers, hotel content, pilgrimage experiences, maps, and AI-assisted user interactions.

## Overview

QuickAir is structured as a production-oriented monorepo with a modern frontend and a headless CMS backend. The project supports localized content, dynamic offers, hotel and pilgrimage data, interactive maps, charts, and AI integrations while keeping content management flexible through Strapi.

## Tech Stack

### Frontend
- Next.js 15 / React 19
- Material UI + Emotion
- Bootstrap
- i18next / react-i18next
- Google Maps + Leaflet
- Recharts
- Swiper
- OpenAI + Google Generative AI integrations
- Nodemailer

### Backend / CMS
- Strapi 5
- GraphQL
- Users & Permissions
- PostgreSQL support
- SQLite for local development
- TypeScript

## Project Structure

```text
quickair/
├── frontend/        # Next.js application
├── strapi/          # Strapi CMS and content APIs
├── docs/            # Brand assets and source data
└── scripts/         # Operational, backup and sync helpers
```

## Key Capabilities

- Multilingual frontend with localized routes and content
- Travel offers and CMS-driven content
- Hotel and pilgrimage content workflows
- Interactive maps and location-based experiences
- Charts and rich UI components
- AI-powered integrations
- Email workflows
- Strapi admin dashboard for content management
- Database migrations and seed scripts
- Production build and deployment-ready frontend/backend separation

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

### Strapi

```bash
cd strapi
npm install
npm run dev
```

Strapi admin runs on `http://localhost:1337/admin`.

## Useful Commands

```bash
# Frontend
cd frontend
npm run build
npm run lint

# Strapi
cd strapi
npm run build
npm run migrations
npm run seed:offers
npm run seed:umrah-hotels
npm run seed:pilgrimage
```

## Engineering Notes

- Frontend routes live under `frontend/app/` with reusable components and shared services.
- Strapi APIs and content models live under `strapi/src/`.
- Environment secrets and production credentials should never be committed.
- Automated test coverage is a recommended next step; current verification relies primarily on builds, linting, and targeted manual checks.

## Team

Developed and maintained by **Build8 Developments**.
