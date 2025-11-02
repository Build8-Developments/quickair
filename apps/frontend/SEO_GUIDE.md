# Centralized SEO System

A comprehensive SEO management system for QuickAir that supports bilingual content (English/Arabic) with automatic language switching.

## 📁 File Structure

```
apps/frontend/
├── data/
│   └── seo.js                  # SEO configuration for all pages
├── utils/
│   └── seo.js                  # Helper functions for metadata generation
└── components/
    └── common/
        └── SEO.jsx             # Client-side SEO component
```

## 🚀 How to Use

### For Page Components (Recommended)

Add the `<SEO>` component to any page:

```jsx
import SEO from "@/components/common/SEO";

export default function HomePage() {
  return (
    <>
      <SEO page="home" />
      {/* Your page content */}
    </>
  );
}
```

### Available Page Keys

- `home` - Homepage
- `tourList` - Tour listing pages
- `tourSingle` - Individual tour details
- `destinations` - Destinations page
- `about` - About page
- `contact` - Contact page
- `blog` - Blog/articles page
- `helpCenter` - Help center
- `dashboard` - User dashboard

### Custom SEO Values

You can override the default SEO values:

```jsx
<SEO
  page="tourSingle"
  customTitle="Explore Dubai Desert Safari | QuickAir"
  customDescription="Experience the thrill of dune bashing and camel riding in Dubai's stunning desert."
/>
```

### For Dynamic Pages

For tour details or blog posts with dynamic content:

```jsx
export default function TourDetailPage({ tour }) {
  return (
    <>
      <SEO
        page="tourSingle"
        customTitle={`${tour.title} | QuickAir`}
        customDescription={tour.description}
      />
      {/* Your page content */}
    </>
  );
}
```

## 🌐 Language Support

The SEO system automatically detects the current language from `LanguageContext` and serves the appropriate content:

- **English**: Uses `en` metadata
- **Arabic**: Uses `ar` metadata

When users switch languages, the SEO metadata updates automatically including:

- Page title
- Meta description
- Meta keywords
- OG tags (language and locale)

## ✏️ Adding New Pages

To add SEO for a new page:

1. Open `data/seo.js`
2. Add your page configuration:

```javascript
export const seoConfig = {
  // ... existing pages ...

  newPage: {
    en: {
      title: "Your Page Title",
      description: "Your page description",
      keywords: "keyword1, keyword2, keyword3",
      ogImage: "/img/seo/new-page-og.jpg",
    },
    ar: {
      title: "عنوان صفحتك",
      description: "وصف صفحتك",
      keywords: "كلمة1, كلمة2, كلمة3",
      ogImage: "/img/seo/new-page-og-ar.jpg",
    },
  },
};
```

3. Use it in your page:

```jsx
<SEO page="newPage" />
```

## 📊 What's Included

Each page's SEO includes:

- **Title**: Browser tab title and search result title
- **Description**: Meta description for search engines
- **Keywords**: SEO keywords
- **OG Image**: Social media preview image
- **Open Graph Tags**: Facebook, LinkedIn sharing
- **Twitter Card**: Twitter sharing
- **Locale**: Proper language and region settings
- **Robots**: Search engine indexing instructions

## 🎨 Social Media Images

Place your OG images in: `public/img/seo/`

Recommended dimensions:

- **1200 x 630 pixels** (Facebook/Twitter)
- **PNG or JPG format**
- **File size**: Under 1MB

## 🔧 Configuration

Update site information in `data/seo.js`:

```javascript
export const siteInfo = {
  siteName: "QuickAir",
  siteUrl: "https://quickair.com", // Your actual domain
  twitterHandle: "@quickair",
  facebookUrl: "https://facebook.com/quickair",
  instagramUrl: "https://instagram.com/quickair",
};
```

## 📱 Example Usage

### Homepage

```jsx
<SEO page="home" />
```

### Tour Listing

```jsx
<SEO page="tourList" />
```

### About Page

```jsx
<SEO page="about" />
```

### Dynamic Tour Page

```jsx
<SEO
  page="tourSingle"
  customTitle={`${tourData.name} Tour`}
  customDescription={tourData.shortDescription}
/>
```

## ✅ Benefits

- ✨ **Centralized Management**: All SEO in one place
- 🌍 **Bilingual Support**: English and Arabic out of the box
- 🔄 **Auto Language Detection**: Updates based on user's language choice
- 🎯 **SEO Best Practices**: Includes all important meta tags
- 📱 **Social Media Ready**: OG and Twitter Card support
- 🚀 **Easy to Maintain**: Simple configuration file
- ♿ **Accessibility**: Proper language attributes

## 🐛 Troubleshooting

**SEO not updating?**

- Ensure `LanguageProvider` is wrapping your app in `layout.js`
- Check that the page key exists in `seoConfig`

**Language not switching?**

- The SEO component uses the `useLanguage` hook from `LanguageContext`
- Make sure language switching is working first

**Custom values not working?**

- Check that you're passing the correct prop names: `customTitle`, `customDescription`
