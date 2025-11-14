# Strapi Content Type Schemas for Travel Offers

## Overview

Based on the provided PDF offers (Bali, Beirut, Dahab, El Sokhna, Hurghada, Istanbul, Sahl Hasheesh, Sharm), this schema defines a simple structure for monthly hotel offers.

---

## Content Types

### 1. **Offer** (Collection Type)

#### Fields:

| Field Name    | Type                   | Required | Notes                             |
| ------------- | ---------------------- | -------- | --------------------------------- |
| title         | Text                   | Yes      | E.g., "Dahab - November Offer"    |
| slug          | UID                    | Yes      | Auto-generated from title         |
| destination   | Text                   | Yes      | E.g., "Dahab", "Istanbul", "Bali" |
| month         | Text                   | Yes      | E.g., "November", "Nov&Dec"       |
| year          | Number                 | No       | E.g., 2025                        |
| pdfFile       | Media (Single)         | Yes      | Original PDF file                 |
| coverImage    | Media (Single)         | No       | Main offer image                  |
| hotelOptions  | Component (repeatable) | Yes      | `offer.hotel-option`              |
| inclusions    | Component (repeatable) | No       | `offer.inclusion`                 |
| exclusions    | Component (repeatable) | No       | `offer.exclusion`                 |
| policies      | Rich Text              | No       | Kids policies, general policies   |
| optionalTrips | Component (repeatable) | No       | `offer.optional-trip`             |
| published     | Boolean                | No       | Default: false                    |

---

## Components

### **offer.hotel-option**

Individual hotel package with pricing.

#### Fields:

| Field Name  | Type                   | Required | Notes                              |
| ----------- | ---------------------- | -------- | ---------------------------------- |
| hotelName   | Text                   | Yes      | Name of hotel/resort               |
| nights      | Number                 | Yes      | Number of nights (e.g., 3, 7)      |
| mealPlan    | Text                   | No       | E.g., "Breakfast", "All Inclusive" |
| currency    | Text                   | Yes      | E.g., "USD", "EUR", "EGP"          |
| roomPricing | Component (repeatable) | No       | `offer.room-pricing`               |
| kidsPricing | Component (repeatable) | No       | `offer.kids-pricing`               |
| notes       | Text                   | No       | Additional details or conditions   |

---

### **offer.room-pricing**

Detailed pricing for different room types and occupancy (سعر الفرد فى الغرفة).

#### Fields:

| Field Name  | Type    | Required | Notes                                 |
| ----------- | ------- | -------- | ------------------------------------- |
| roomType    | Text    | Yes      | E.g., "Standard", "Sea View", "Suite" |
| singlePrice | Decimal | No       | Price per person in single occupancy  |
| doublePrice | Decimal | No       | Price per person in double occupancy  |
| triplePrice | Decimal | No       | Price per person in triple occupancy  |
| notes       | Text    | No       | Room-specific details                 |

---

### **offer.kids-pricing**

Age-based pricing for children.

#### Fields:

| Field Name | Type    | Required | Notes                                        |
| ---------- | ------- | -------- | -------------------------------------------- |
| ageFrom    | Number  | Yes      | Starting age (e.g., 0, 2, 6)                 |
| ageTo      | Number  | Yes      | Ending age (e.g., 2, 6, 12)                  |
| price      | Decimal | No       | Fixed price (leave empty if free/percentage) |
| discount   | Number  | No       | Discount percentage (e.g., 50 for 50%)       |
| isFree     | Boolean | No       | True if free for this age range              |
| notes      | Text    | No       | E.g., "In parents' room"                     |

---

### **offer.inclusion**

Items included in the offer.

#### Fields:

| Field Name | Type | Required | Notes                                  |
| ---------- | ---- | -------- | -------------------------------------- |
| item       | Text | Yes      | E.g., "Airport transfers", "Breakfast" |

---

### **offer.exclusion**

Items NOT included in the offer.

#### Fields:

| Field Name | Type | Required | Notes                                  |
| ---------- | ---- | -------- | -------------------------------------- |
| item       | Text | Yes      | E.g., "Personal expenses", "Visa fees" |

---

### **offer.optional-trip**

Optional excursions/adventures available with the offer.

#### Fields:

| Field Name     | Type                   | Required | Notes                  |
| -------------- | ---------------------- | -------- | ---------------------- |
| title          | Text                   | Yes      | Trip/adventure name    |
| description    | Text                   | No       | Trip description       |
| pricePerPerson | Decimal                | Yes      | Price per person       |
| currency       | Text                   | Yes      | E.g., "EGP", "USD"     |
| inclusions     | Component (repeatable) | No       | `offer.trip-inclusion` |

---

### **offer.trip-inclusion**

Items included in an optional trip.

#### Fields:

| Field Name | Type | Required | Notes                                |
| ---------- | ---- | -------- | ------------------------------------ |
| item       | Text | Yes      | E.g., "Lunch", "Guide", "Entry fees" |

---

## Schema-Mapped Mock Example

This example shows how the data structure maps to the actual content type schema, making it easier to understand the relationship between fields and components.

---

### 📄 **Offer Content Type** - Main Container

```
┌─────────────────────────────────────────────────────────────┐
│ OFFER: Sharm El Sheikh - November Special                  │
└─────────────────────────────────────────────────────────────┘
```

**Basic Fields:**

- `title`: "Sharm El Sheikh - November Special"
- `slug`: "sharm-el-sheikh-november-special"
- `destination`: "Sharm El Sheikh"
- `month`: "November"
- `year`: 2025
- `published`: true
- `pdfFile`: "sharm-november-2025.pdf"
- `coverImage`: "sharm-cover.jpg"

---

### 🏨 **Component: hotel-option** (Repeatable - 3 instances)

#### Hotel Option #1

```
┌─────────────────────────────────────────────────────────────┐
│ HOTEL OPTION #1                                             │
├─────────────────────────────────────────────────────────────┤
│ hotelName: "Rixos Premium Seagate"                         │
│ nights: 5                                                   │
│ mealPlan: "Ultra All Inclusive"                            │
│ currency: "USD"                                             │
│ notes: "5-star luxury resort with private beach..."        │
└─────────────────────────────────────────────────────────────┘
```

**Nested Component: `room-pricing`** (3 instances)

**Room Pricing #1:**

- `roomType`: "Standard"
- `singlePrice`: 450
- `doublePrice`: 280
- `triplePrice`: 240
- `notes`: null

**Room Pricing #2:**

- `roomType`: "Sea View"
- `singlePrice`: 550
- `doublePrice`: 340
- `triplePrice`: 290
- `notes`: "Direct sea view with balcony"

**Room Pricing #3:**

- `roomType`: "Family Suite"
- `singlePrice`: 700
- `doublePrice`: 420
- `triplePrice`: 360
- `notes`: "Two bedrooms, suitable for families"

**Nested Component: `kids-pricing`** (4 instances)

**Kids Pricing #1:**

- `ageFrom`: 0
- `ageTo`: 2
- `isFree`: true
- `price`: null
- `discount`: null
- `notes`: "Free in parents' room with crib"

**Kids Pricing #2:**

- `ageFrom`: 2
- `ageTo`: 6
- `isFree`: false
- `price`: null
- `discount`: 50
- `notes`: "50% discount on adult price"

**Kids Pricing #3:**

- `ageFrom`: 6
- `ageTo`: 12
- `isFree`: false
- `price`: null
- `discount`: 30
- `notes`: "30% discount on adult price"

**Kids Pricing #4:**

- `ageFrom`: 12
- `ageTo`: 18
- `isFree`: false
- `price`: null
- `discount`: 15
- `notes`: "15% discount, must share room with adults"

---

#### Hotel Option #2

```
┌─────────────────────────────────────────────────────────────┐
│ HOTEL OPTION #2                                             │
├─────────────────────────────────────────────────────────────┤
│ hotelName: "Baron Palace Sahl Hasheesh"                    │
│ nights: 5                                                   │
│ mealPlan: "All Inclusive"                                   │
│ currency: "USD"                                             │
│ notes: "Family-friendly resort with kids club..."          │
└─────────────────────────────────────────────────────────────┘
```

**Nested Component: `room-pricing`** (3 instances)

**Room Pricing #1:**

- `roomType`: "Standard"
- `singlePrice`: 380
- `doublePrice`: 240
- `triplePrice`: 210

**Room Pricing #2:**

- `roomType`: "Pool View"
- `singlePrice`: 450
- `doublePrice`: 280
- `triplePrice`: 240
- `notes`: "Overlooking the main pool area"

**Room Pricing #3:**

- `roomType`: "Deluxe Sea View"
- `singlePrice`: 520
- `doublePrice`: 320
- `triplePrice`: 270
- `notes`: "Premium location with panoramic views"

**Nested Component: `kids-pricing`** (2 instances)

**Kids Pricing #1:**

- `ageFrom`: 0
- `ageTo`: 3
- `isFree`: true
- `notes`: "Free, no extra bed"

**Kids Pricing #2:**

- `ageFrom`: 3
- `ageTo`: 12
- `price`: 120
- `notes`: "Fixed price per night including meals"

---

#### Hotel Option #3

```
┌─────────────────────────────────────────────────────────────┐
│ HOTEL OPTION #3                                             │
├─────────────────────────────────────────────────────────────┤
│ hotelName: "Albatros Palace Resort"                        │
│ nights: 5                                                   │
│ mealPlan: "Soft All Inclusive"                             │
│ currency: "EGP"                                             │
│ notes: null                                                 │
└─────────────────────────────────────────────────────────────┘
```

**Nested Component: `room-pricing`** (2 instances)

**Room Pricing #1:**

- `roomType`: "Standard"
- `singlePrice`: 8500
- `doublePrice`: 5200
- `triplePrice`: 4500

**Room Pricing #2:**

- `roomType`: "Superior"
- `singlePrice`: 9800
- `doublePrice`: 6100
- `triplePrice`: 5300
- `notes`: "Renovated rooms with modern amenities"

**Nested Component: `kids-pricing`** (2 instances)

**Kids Pricing #1:**

- `ageFrom`: 0
- `ageTo`: 6
- `isFree`: true

**Kids Pricing #2:**

- `ageFrom`: 6
- `ageTo`: 12
- `discount`: 40

---

### ✅ **Component: inclusion** (Repeatable - 7 instances)

**Inclusion #1:**

- `item`: "Round-trip airport transfers from Sharm El Sheikh Airport"

**Inclusion #2:**

- `item`: "Accommodation at selected hotel"

**Inclusion #3:**

- `item`: "Meals according to meal plan"

**Inclusion #4:**

- `item`: "Access to hotel facilities (pools, beach, gym)"

**Inclusion #5:**

- `item`: "WiFi in public areas"

**Inclusion #6:**

- `item`: "Kids club activities (selected hotels)"

**Inclusion #7:**

- `item`: "Animation and entertainment programs"

---

### ❌ **Component: exclusion** (Repeatable - 8 instances)

**Exclusion #1:**

- `item`: "International airfare"

**Exclusion #2:**

- `item`: "Entry visa to Egypt (if applicable)"

**Exclusion #3:**

- `item`: "Travel and medical insurance"

**Exclusion #4:**

- `item`: "Personal expenses and shopping"

**Exclusion #5:**

- `item`: "Spa and massage services"

**Exclusion #6:**

- `item`: "Motorized water sports"

**Exclusion #7:**

- `item`: "Optional excursions and tours"

**Exclusion #8:**

- `item`: "Tips and gratuities"

---

### 📜 **Field: policies** (Rich Text)

```markdown
**Kids Policy:**

- Children 0-2 years: Free (crib upon request)
- Children 2-6 years: 50% discount
- Children 6-12 years: 30-40% discount depending on hotel
- Children must be accompanied by adults
- Age verification may be required at check-in

**Booking Policy:**

- Minimum 2 nights stay required
- Check-in: 2:00 PM / Check-out: 12:00 PM
- Early check-in/late check-out subject to availability

**Cancellation Policy:**

- More than 14 days before arrival: Full refund minus 10% processing fee
- 7-14 days before arrival: 50% refund
- Less than 7 days: No refund
- No-show: Full charge

**Payment Policy:**

- 30% deposit required to confirm booking
- Full payment due 7 days before arrival
- Accepted: Cash, Credit Cards, Bank Transfer

**General Terms:**

- Prices are per person per night
- Rates are subject to availability
- All prices include taxes and service charges
- Hotel reserves the right to change room categories based on availability
```

---

### 🎯 **Component: optional-trip** (Repeatable - 6 instances)

#### Optional Trip #1

```
┌─────────────────────────────────────────────────────────────┐
│ OPTIONAL TRIP #1                                            │
├─────────────────────────────────────────────────────────────┤
│ title: "Ras Mohammed National Park Snorkeling"             │
│ description: "Full-day snorkeling trip to one of the..."    │
│ pricePerPerson: 650                                         │
│ currency: "EGP"                                             │
└─────────────────────────────────────────────────────────────┘
```

**Nested Component: `trip-inclusion`** (7 instances)

- `item`: "Hotel pickup and drop-off"
- `item`: "Air-conditioned transport"
- `item`: "Snorkeling equipment and life jackets"
- `item`: "Professional diving guide"
- `item`: "Buffet lunch on boat"
- `item`: "Soft drinks and water"
- `item`: "National park entry fees"

---

#### Optional Trip #2

```
┌─────────────────────────────────────────────────────────────┐
│ OPTIONAL TRIP #2                                            │
├─────────────────────────────────────────────────────────────┤
│ title: "Quad Biking Desert Safari"                         │
│ description: "Thrilling quad bike adventure through..."     │
│ pricePerPerson: 800                                         │
│ currency: "EGP"                                             │
└─────────────────────────────────────────────────────────────┘
```

**Nested Component: `trip-inclusion`** (6 instances)

- `item`: "Hotel transfers"
- `item`: "Quad bike for 1 hour"
- `item`: "Safety equipment and instructions"
- `item`: "Bedouin village visit"
- `item`: "Traditional tea experience"
- `item`: "Desert sunset viewing"

---

#### Optional Trip #3

```
┌─────────────────────────────────────────────────────────────┐
│ OPTIONAL TRIP #3                                            │
├─────────────────────────────────────────────────────────────┤
│ title: "Mount Sinai & St. Catherine Monastery"             │
│ description: "Overnight spiritual journey to Mount..."      │
│ pricePerPerson: 1200                                        │
│ currency: "EGP"                                             │
└─────────────────────────────────────────────────────────────┘
```

**Nested Component: `trip-inclusion`** (6 instances)

- `item`: "Overnight air-conditioned bus"
- `item`: "Expert tour guide"
- `item`: "Breakfast boxes"
- `item`: "Monastery entrance fee"
- `item`: "Bedouin guide for mountain climb (optional)"
- `item`: "All transfers"

---

#### Optional Trip #4

```
┌─────────────────────────────────────────────────────────────┐
│ OPTIONAL TRIP #4                                            │
├─────────────────────────────────────────────────────────────┤
│ title: "Glass Boat Red Sea Coral Viewing"                  │
│ description: "Family-friendly glass boat tour to view..."   │
│ pricePerPerson: 400                                         │
│ currency: "EGP"                                             │
└─────────────────────────────────────────────────────────────┘
```

**Nested Component: `trip-inclusion`** (4 instances)

- `item`: "Hotel pickup and return"
- `item`: "2-hour glass boat cruise"
- `item`: "Refreshments on board"
- `item`: "Marine life guide"

---

#### Optional Trip #5

```
┌─────────────────────────────────────────────────────────────┐
│ OPTIONAL TRIP #5                                            │
├─────────────────────────────────────────────────────────────┤
│ title: "Colored Canyon Jeep Safari"                        │
│ description: "Full-day 4x4 adventure to the spectacular..." │
│ pricePerPerson: 950                                         │
│ currency: "EGP"                                             │
└─────────────────────────────────────────────────────────────┘
```

**Nested Component: `trip-inclusion`** (6 instances)

- `item`: "4x4 jeep transportation"
- `item`: "Professional driver and guide"
- `item`: "Lunch in Bedouin tent"
- `item`: "Traditional Bedouin tea"
- `item`: "Canyon entrance fee"
- `item`: "All permits and fees"

---

#### Optional Trip #6

```
┌─────────────────────────────────────────────────────────────┐
│ OPTIONAL TRIP #6                                            │
├─────────────────────────────────────────────────────────────┤
│ title: "Dinner Cruise - Sunset Experience"                 │
│ description: "Romantic evening cruise along the Red Sea..." │
│ pricePerPerson: 550                                         │
│ currency: "EGP"                                             │
└─────────────────────────────────────────────────────────────┘
```

**Nested Component: `trip-inclusion`** (5 instances)

- `item`: "Hotel transfers"
- `item`: "2-hour cruise"
- `item`: "International buffet dinner"
- `item`: "Live music and entertainment"
- `item`: "Soft drinks included"

---

## Summary of Content Structure

```
OFFER (1 instance)
├── Basic Fields (title, slug, destination, month, year, pdfFile, coverImage, published)
├── hotelOptions (3 instances)
│   ├── Hotel #1
│   │   ├── roomPricing (3 instances)
│   │   └── kidsPricing (4 instances)
│   ├── Hotel #2
│   │   ├── roomPricing (3 instances)
│   │   └── kidsPricing (2 instances)
│   └── Hotel #3
│       ├── roomPricing (2 instances)
│       └── kidsPricing (2 instances)
├── inclusions (7 instances)
├── exclusions (8 instances)
├── policies (Rich Text Field)
└── optionalTrips (6 instances)
    ├── Trip #1 → trip-inclusions (7 instances)
    ├── Trip #2 → trip-inclusions (6 instances)
    ├── Trip #3 → trip-inclusions (6 instances)
    ├── Trip #4 → trip-inclusions (4 instances)
    ├── Trip #5 → trip-inclusions (6 instances)
    └── Trip #6 → trip-inclusions (5 instances)
```

**Total Components:**

- 1 Offer Content Type
- 3 Hotel Options (with nested components)
- 8 Room Pricing components
- 8 Kids Pricing components
- 7 Inclusions
- 8 Exclusions
- 1 Policies field
- 6 Optional Trips
- 34 Trip Inclusions
