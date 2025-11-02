# Dynamic SEO Integration with Strapi (GraphQL)

Complete guide for using SEO content from Strapi with GraphQL and bilingual support.

---

## 📋 Table of Contents

- [Strapi Setup](#strapi-setup)
- [Frontend Usage](#frontend-usage)
- [GraphQL Queries](#graphql-queries)
- [Examples](#examples)
- [Environment Variables](#environment-variables)

---

## 🔧 Strapi Setup

### Step 1: Create SEO Component

1. Go to **Content-Type Builder** in Strapi
2. Click **Create new component**
3. Select **Create a new component**
4. **Category**: `shared`
5. **Name**: `seo`
6. **Icon**: Choose a search/SEO icon

### Step 2: Add SEO Fields

Add these fields to the `shared.seo` component:

| Field Name          | Type                 | Settings                 |
| ------------------- | -------------------- | ------------------------ |
| **metaTitle**       | Text (Short)         | Required, Max: 60 chars  |
| **metaDescription** | Text (Long)          | Required, Max: 160 chars |
| **keywords**        | Text (Long)          | Optional, Max: 255 chars |
| **ogImage**         | Media (Single Image) | Optional, Only images    |
| **ogImageAlt**      | Text (Short)         | Optional, Max: 100 chars |

### Step 3: Add SEO to Content Types

For each content type (Offers, Tours, Destinations, Blogs):

1. Go to **Content-Type Builder**
2. Select your content type (e.g., **Offer**)
3. Click **Add another field**
4. Choose **Component** → **Use an existing component**
5. Select `shared.seo`
6. **Name**: `seo`
7. **Type**: Single component
8. **Advanced settings**: Not required (allows fallback to defaults)

### Step 4: Enable Internationalization (i18n)

For each content type:

1. Edit the content type
2. Go to **Advanced settings**
3. Enable **Internationalization**
4. Enable **Localization** for: `en` (English) and `ar` (Arabic)

### Step 5: Enable GraphQL

1. Go to **Settings** → **Plugins**
2. Enable **GraphQL**
3. Configure GraphQL settings if needed

### Step 6: Set Permissions

1. Go to **Settings** → **Roles** → **Public**
2. Enable these permissions:
   - ✅ Offers: `find`, `findOne`
   - ✅ Tours: `find`, `findOne`
   - ✅ Destinations: `find`, `findOne`
   - ✅ Blogs: `find`, `findOne`

---

## 🚀 Frontend Usage

### For Static Pages (No Changes Needed)

Continue using the existing SEO component:

```jsx
import SEO from "@/components/common/SEO";

export default function AboutPage() {
  return (
    <>
      <SEO page="about" />
      {/* Your content */}
    </>
  );
}
```

### For Dynamic Pages (Strapi Content)

Use the new `DynamicSEO` component:

```jsx
import DynamicSEO from "@/components/common/DynamicSEO";

export default function OfferPage({ params }) {
  return (
    <>
      <DynamicSEO contentType="offer" slug={params.slug} fallbackPage="home" />
      {/* Your offer content */}
    </>
  );
}
```

### Content Types Supported

- `offer` - For special offers/deals
- `tour` - For tour packages
- `destination` - For destination pages
- `blog` - For blog posts/articles

---

## 📝 Examples

### Example 1: Offer Detail Page

```jsx
"use client";
import DynamicSEO from "@/components/common/DynamicSEO";
import { useParams } from "next/navigation";

export default function OfferDetailPage() {
  const params = useParams();

  return (
    <>
      <DynamicSEO contentType="offer" slug={params.slug} fallbackPage="home" />

      <div className="offer-container">{/* Your offer content */}</div>
    </>
  );
}
```

### Example 2: Tour Detail Page

```jsx
import DynamicSEO from "@/components/common/DynamicSEO";

export default function TourPage({ params }) {
  return (
    <>
      <DynamicSEO
        contentType="tour"
        slug={params.slug}
        fallbackPage="tourSingle"
      />

      {/* Tour details */}
    </>
  );
}
```

### Example 3: With Custom SEO Override

If you need to override specific SEO fields:

```jsx
<DynamicSEO
  contentType="offer"
  slug="summer-sale-2024"
  customSEO={{
    title: "Limited Time: Summer Sale 2024 | QuickAir",
    description: "Custom description that overrides Strapi",
  }}
/>
```

### Example 4: Blog Post Page

```jsx
import DynamicSEO from "@/components/common/DynamicSEO";

export default function BlogPostPage({ params }) {
  return (
    <>
      <DynamicSEO contentType="blog" slug={params.slug} fallbackPage="blog" />

      {/* Blog content */}
    </>
  );
}
```

---

## 🌍 How Language Switching Works

The system **automatically** handles language switching:

1. User switches language using the language switcher button
2. `DynamicSEO` detects the language change via `useLanguage()` hook
3. **New GraphQL request** is made with the updated locale (`en` or `ar`)
4. SEO metadata updates instantly
5. Document title, meta tags, and OG tags all update

**No manual intervention needed!** 🎉

---

## 🔍 GraphQL Queries

The system uses these GraphQL queries (already configured):

### Offer Query

```graphql
query GetOfferSEO($slug: String!, $locale: I18NLocaleCode!) {
  offers(filters: { slug: { eq: $slug } }, locale: $locale) {
    data {
      attributes {
        title
        seo {
          metaTitle
          metaDescription
          keywords
          ogImage {
            data {
              attributes {
                url
                alternativeText
              }
            }
          }
        }
      }
    }
  }
}
```

Similar queries exist for `tours`, `destinations`, and `blogs`.

---

## ⚙️ Environment Variables

Add to your `.env.local`:

```bash
# Strapi Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# For production:
# NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com
```

---

## 🎯 Fallback System

If Strapi data is not available, the system falls back to:

1. **Custom SEO** (if provided)
2. **Default config** from `data/seo.js`
3. **Global defaults** from `defaultSEO`

This ensures SEO always works, even if:

- Strapi is down
- Content doesn't have SEO filled
- Network issues occur

---

## ✅ Checklist for Each New Offer/Tour

When creating new content in Strapi:

- [ ] Fill in **metaTitle** (60 chars max)
- [ ] Fill in **metaDescription** (160 chars max)
- [ ] Add relevant **keywords** (comma-separated)
- [ ] Upload **ogImage** (1200x630px recommended)
- [ ] Add **ogImageAlt** text
- [ ] Create both **EN** and **AR** versions
- [ ] Publish the content

---

## 🐛 Troubleshooting

**SEO not loading?**

- Check if `NEXT_PUBLIC_STRAPI_URL` is set correctly
- Verify Strapi GraphQL is enabled
- Check public permissions for the content type

**Wrong language showing?**

- Clear browser cache
- Verify i18n is enabled in Strapi
- Check if content exists for that locale

**Images not showing?**

- Ensure image URL is absolute or starts with `/`
- Check Strapi upload folder permissions
- Verify image is published in Strapi

**Fallback always used?**

- Check GraphQL query in browser network tab
- Verify slug matches exactly
- Ensure content is published

---

## 📊 What Gets Updated

When language switches, these update automatically:

✅ Page title  
✅ Meta description  
✅ Meta keywords  
✅ OG title  
✅ OG description  
✅ OG image  
✅ OG locale  
✅ Twitter card  
✅ HTML lang attribute  
✅ HTML dir attribute (RTL for Arabic)

---

## 🎨 Best Practices

### SEO Content Guidelines

**Meta Title:**

- Keep under 60 characters
- Include main keyword
- Add brand name: "Keyword | QuickAir"

**Meta Description:**

- Keep under 160 characters
- Include call-to-action
- Mention unique value proposition

**Keywords:**

- Use 5-10 relevant keywords
- Separate with commas
- Include both English and Arabic terms

**OG Image:**

- Dimensions: 1200 x 630 pixels
- Format: JPG or PNG
- File size: Under 1MB
- Include text overlay (if applicable)

---

## 🚀 Next Steps

1. ✅ Create SEO component in Strapi
2. ✅ Add to Offer content type
3. ✅ Create test offer with SEO
4. ✅ Test in frontend
5. ✅ Apply to Tours, Destinations, Blogs
6. ✅ Fill SEO for all existing content

---

Need help? Check the console for detailed error messages and fallback information!
