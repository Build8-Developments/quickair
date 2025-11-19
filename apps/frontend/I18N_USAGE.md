# i18next Translation System - Usage Guide

## Overview

The flight search component now uses a centralized translation system with i18next, making it easy to manage translations across the entire application.

## File Structure

```
apps/frontend/
├── locales/
│   ├── en/
│   │   └── translation.json    # English translations
│   └── ar/
│       └── translation.json    # Arabic translations
├── lib/
│   └── i18n.js                 # i18next configuration
└── contexts/
    └── LanguageContext.js      # Language state + i18next sync
```

## Translation Files

### English (`locales/en/translation.json`)

```json
{
  "common": {
    "search": "Search",
    "reset": "Reset",
    "apply": "Apply"
  },
  "flightSearch": {
    "tripTypes": {
      "roundTrip": "Round Trip",
      "oneWay": "One Way"
    },
    "fields": {
      "from": "From",
      "to": "To"
    }
  }
}
```

### Arabic (`locales/ar/translation.json`)

Similar structure with Arabic text.

## How to Use in Components

### 1. Import the hook

```jsx
import { useTranslation } from "react-i18next";
```

### 2. Use translations

```jsx
export default function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <button>{t("common.apply")}</button>
      <h1>{t("flightSearch.tripTypes.roundTrip")}</h1>
    </div>
  );
}
```

## Adding New Translations

### 1. Add to both JSON files

Add the same key path to both `en/translation.json` and `ar/translation.json`:

**English:**

```json
{
  "myNewSection": {
    "greeting": "Hello"
  }
}
```

**Arabic:**

```json
{
  "myNewSection": {
    "greeting": "مرحبا"
  }
}
```

### 2. Use in your component

```jsx
{
  t("myNewSection.greeting");
}
```

## Translation Keys Reference

### Common

- `common.search` - Search button
- `common.reset` - Reset button
- `common.apply` - Apply button
- `common.loading` - Loading text

### Flight Search - Trip Types

- `flightSearch.tripTypes.roundTrip`
- `flightSearch.tripTypes.oneWay`
- `flightSearch.tripTypes.multiCity`

### Flight Search - Fields

- `flightSearch.fields.from`
- `flightSearch.fields.to`
- `flightSearch.fields.departure`
- `flightSearch.fields.return`
- `flightSearch.fields.passengersClass`

### Flight Search - Placeholders

- `flightSearch.placeholders.departureAirport`
- `flightSearch.placeholders.arrivalAirport`
- `flightSearch.placeholders.selectDate`

### Flight Search - Buttons

- `flightSearch.buttons.addFlight`
- `flightSearch.buttons.searchFlights`

### Flight Search - Passengers

- `flightSearch.passengers.traveller`
- `flightSearch.passengers.travellers`
- `flightSearch.passengers.adults`
- `flightSearch.passengers.children`
- `flightSearch.passengers.infants`
- `flightSearch.passengers.ages.adults`
- `flightSearch.passengers.ages.children`
- `flightSearch.passengers.ages.infants`

### Flight Search - Classes

- `flightSearch.classes.travelClass`
- `flightSearch.classes.economy`
- `flightSearch.classes.premiumEconomy`
- `flightSearch.classes.business`
- `flightSearch.classes.first`

### Flight Search - Airport

- `flightSearch.airport.searchPlaceholder`
- `flightSearch.airport.noResults`

## Language Switching

The language switching is handled automatically by `LanguageContext`. When the user changes language:

1. `LanguageContext.changeLanguage()` is called
2. i18next is synced automatically
3. All components re-render with new translations
4. RTL/LTR direction is updated
5. Language is saved to localStorage and cookies

## Benefits

✅ **Centralized** - All translations in one place
✅ **Type-safe** - Easy to track missing translations
✅ **Scalable** - Easy to add new languages
✅ **Maintainable** - No duplicate translation objects
✅ **DX** - Better developer experience with autocomplete
