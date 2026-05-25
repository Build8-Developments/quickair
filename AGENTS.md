# Repository Guidelines

## Project Structure & Module Organization

- `frontend/`: Next.js 15 App Router application. Routes live in `app/`, reusable UI in `components/`, API helpers in `lib/api/`, shared services in `services/`, translations in `locales/`, and static files in `public/`.
- `strapi/`: Strapi 5 backend. Content APIs are under `src/api/`, reusable components under `src/components/`, configuration in `config/`, generated types in `types/`, and seed/migration scripts in `scripts/`.
- `docs/`: brand assets, offer PDFs, and JSON source data used by CMS seeding.
- `scripts/`: repository-level operational scripts such as backup and upload sync helpers.

## Build, Test, and Development Commands

Run commands from the relevant package directory.

```bash
cd frontend && npm install
cd frontend && npm run dev      # Start Next.js at http://localhost:3000
cd frontend && npm run build    # Production build
cd frontend && npm run lint     # Next.js ESLint checks

cd strapi && npm install
cd strapi && npm run dev        # Start Strapi at http://localhost:1337/admin
cd strapi && npm run build      # Build Strapi admin/backend
cd strapi && npm run migrations # Run custom database migrations
cd strapi && npm run seed:offers
```

## Coding Style & Naming Conventions

Use JavaScript/JSX in the frontend and TypeScript for Strapi source/config files. Follow existing formatting: 2-space indentation in JSON, semicolon-light JavaScript where already used, and PascalCase for React components such as `HotelCard.jsx`. Use camelCase for helpers, services, and hooks. Keep localized routes under `frontend/app/[locale]`, and put user-facing copy in locale files instead of hard-coding strings.

## Testing Guidelines

There is no dedicated test runner configured yet. Validate changes with `npm run lint`, `npm run build`, and targeted manual checks in English and Arabic routes. When adding tests, colocate them near the feature or use `__tests__/`, and name files after the unit under test, for example `currency.test.js`.

## Commit & Pull Request Guidelines

Use the project’s Conventional Commit pattern: `feat(scope): summary`, `fix: summary`, or `chore(scope): summary`. Keep summaries imperative and specific, for example `feat(chatbot): add live price summary`.

Pull requests should include a short description, linked issue or task when available, verification steps, and screenshots for visible UI changes. Note any Strapi schema, migration, seed-data, or environment-variable changes explicitly.

## Security & Configuration Tips

Do not commit local `.env` files, API keys, or production database credentials. Keep upload and backup scripts environment-aware, and avoid editing generated Strapi types manually unless regenerating them through Strapi.
