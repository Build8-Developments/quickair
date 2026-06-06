# Package-Specific Manasik Editing for Haj and Omra

## Summary

Move Manasik content from static frontend sections into editable Strapi package/program data. Each Haj or Omra package will show its own Manasik inside its program card. The current global/static Manasik guide sections will be removed from both pages, and if a package has no Manasik configured, no Manasik section will render for that package.

## Key Changes

- Extend the existing Strapi `pilgrimage.ritual-card` component to support the full guide shape: `title`, `subtitle`, `description`, repeatable `steps`, `dua`, `significance`, and optional `icon`.
- Reuse that same `ritual-card` component for both Haj and Omra:
  - Haj already has `ritualsTitle` and repeatable `rituals` on `pilgrimage.haj-package`.
  - Add `ritualsTitle` and repeatable `rituals` to `pilgrimage.umrah-program`.
- Update the GraphQL `RITUAL_CARD` and `UMRAH_PROGRAM` fragments so Omra programs fetch the new rituals fields, and Haj fetches the expanded full-guide fields.
- Update `mapHajPageFromStrapi` and `mapUmrahPageFromStrapi` so every mapped program can include `ritualsTitle` and `rituals`.
- Add a reusable package-level frontend section for rendering these rituals inside `UmrahProgramCard`, since that card is used for both Haj and Omra package cards.
- Remove the global static `<RitualsGuideSection />` render from `HajPageContent` and `OmraPageContent`.
- Remove the global Omra `<UmrahStepsSection />` render as part of moving Manasik content into package-specific CMS data.
- Keep existing services, hero, package tabs, hotels, pricing, includes, excludes, notes, and documents behavior unchanged.

## Rendering Behavior

- Inside each package card, render the package Manasik section only when `program.rituals` has at least one item.
- Use `program.ritualsTitle` when available; otherwise use a localized default label such as `مناسك البرنامج` / `Program rituals`.
- Render only filled subfields for each ritual: title is primary, subtitle optional, description optional, steps optional, dua optional, significance optional.
- Do not fall back to the old static Hajj/Umrah ritual arrays when package rituals are missing.

## Test Plan

- Run `cd frontend && npm run lint`.
- Run `cd frontend && npm run build`.
- Run `cd strapi && npm run build` to confirm the updated component schemas compile.
- Manual check `/ar/haj`, `/en/haj`, `/ar/omra`, `/en/omra`:
  - packages render normally;
  - package-specific Manasik appear when populated;
  - no global static Manasik guide appears above packages;
  - packages with empty rituals do not show an empty section.
- Manual Strapi admin check:
  - Haj packages expose the expanded ritual fields;
  - Omra programs expose `ritualsTitle` and repeatable rituals;
  - Arabic and English localized entries can be edited independently.

## Assumptions

- "Each package can have different مناسك" means package/program-level Strapi fields, not a page-level default with overrides.
- The old static general Manasik guide should not appear once package-level Manasik are implemented.
- Existing Haj ritual data can remain in place; new fields will be additive, so old title/description content is not destroyed.
