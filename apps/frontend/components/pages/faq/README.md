# FAQ Page Documentation

## Overview
A clean, production-ready FAQ page with multi-category support, bilingual content (English/Arabic), and mobile-responsive design.

## 📂 File Structure

```
apps/frontend/
├── app/(pages)/faq/
│   └── page.jsx                    # Main FAQ page
├── components/pages/faq/
│   ├── FaqHero.jsx                 # Page header with title
│   ├── FaqContent.jsx              # Main content container with state management
│   ├── FaqCategories.jsx           # Sidebar/dropdown for category selection
│   └── FaqAccordion.jsx            # Collapsible Q&A accordion
├── data/
│   └── faqData.js                  # FAQ content (easily editable)
└── public/css/
    └── faq-page.css                # Custom styles for FAQ page
```

## 🚀 Features

✅ **Multi-Category System** - Organized by topics (Booking, Payment, Travel, etc.)  
✅ **Collapsible Accordion** - Smooth expand/collapse animations  
✅ **Bilingual Support** - Full English and Arabic content with RTL  
✅ **Mobile Responsive** - Sidebar becomes dropdown on mobile  
✅ **SEO Optimized** - Dynamic metadata for search engines  
✅ **Production Ready** - Clean, modular, reusable components  

## 📝 How to Edit FAQ Content

### Adding a New Question

Edit `apps/frontend/data/faqData.js`:

```javascript
{
  id: "booking",
  name: "Booking & Reservations",
  icon: "icon-calendar",
  questions: [
    {
      id: "booking-5",  // Unique ID
      question: "Can I book for a group?",
      answer: "Yes, we offer special group discounts for bookings of 10+ people..."
    }
    // Add more questions here
  ]
}
```

### Adding a New Category

```javascript
export const faqCategories = {
  en: [
    // ... existing categories
    {
      id: "new-category",              // Unique category ID
      name: "New Category Name",        // Display name
      icon: "icon-name",                // Icon class
      questions: [
        {
          id: "new-1",
          question: "Your question?",
          answer: "Your answer..."
        }
      ]
    }
  ],
  ar: [
    // Arabic version
    {
      id: "new-category",              // Same ID as English
      name: "اسم الفئة الجديدة",
      icon: "icon-name",
      questions: [
        {
          id: "new-1",
          question: "سؤالك؟",
          answer: "إجابتك..."
        }
      ]
    }
  ]
}
```

## 🎨 Available Icons

Use any icon from your project's icon set:
- `icon-calendar` - Calendar/booking
- `icon-wallet` - Payment/money
- `icon-destination` - Travel/location
- `icon-plane` - Flights
- `icon-bed` - Hotels
- `icon-mosque` - Hajj/Omra
- `icon-help` - Support/help

## 📱 Mobile Responsiveness

- **Desktop (lg+)**: Sidebar on left, content on right
- **Mobile (<lg)**: Sidebar becomes dropdown selector at top
- Breakpoint defined in CSS: `991px`

## 🎯 Current Categories

1. **Booking & Reservations** - How to book, modify, cancel
2. **Payment & Pricing** - Payment methods, pricing info
3. **Travel Information** - Visas, documents, insurance
4. **Flights & Airports** - Flight info, baggage, delays
5. **Hotels & Accommodation** - Hotel details, amenities
6. **Hajj & Omra** - Religious pilgrimage packages
7. **Customer Support** - Contact info, emergency help

Each category contains 4 detailed Q&A pairs in both languages.

## 🔧 Customization

### Change Colors

Edit `public/css/faq-page.css`:

```css
.faq-sidebar__item.is-active {
  background: var(--color-accent-1);  /* Change active color */
}

.accordion__item:hover {
  border-color: var(--color-accent-1);  /* Change hover color */
}
```

### Change Animation Speed

```css
.accordion__content {
  transition: max-height 0.4s ease;  /* Change from 0.4s */
}
```

### Change Accordion Height

In `FaqAccordion.jsx`:

```javascript
style={
  activeQuestion === question.id
    ? { maxHeight: "500px" }  // Adjust this value
    : {}
}
```

## 📍 Accessing the Page

Visit: `http://localhost:3000/faq`

Or add to your navigation menu in `data/menu.js`.

## 🌐 SEO Configuration

The page has dedicated SEO metadata in `data/seo.js`:

```javascript
faq: {
  en: {
    title: "Frequently Asked Questions | QuickAir",
    description: "Get answers to common questions...",
    keywords: "FAQ, frequently asked questions..."
  },
  ar: { /* Arabic SEO */ }
}
```

## 🔄 State Management

- **activeCategory**: Currently selected category ID
- **currentCategory**: Full category object with questions
- **activeQuestion**: Currently expanded question ID (accordion)

## 📦 Dependencies

No external dependencies! Uses:
- React hooks (useState, useEffect)
- Your existing i18n system (react-i18next)
- Your existing LanguageContext
- Your existing CSS utilities

## 💡 Best Practices

1. **Keep answers concise** - 2-4 sentences per answer
2. **Use consistent IDs** - Same IDs across English/Arabic
3. **Add keywords** - Include search terms in questions
4. **Update regularly** - Keep content current
5. **Test both languages** - Verify RTL layout works

## 🐛 Troubleshooting

**Categories not showing?**
- Check that category IDs match between languages
- Verify `getFaqData(language)` returns data

**Accordion not working?**
- Ensure unique question IDs
- Check CSS is imported in layout.js

**Icons not appearing?**
- Verify icon class names match your icon font
- Check icon font is loaded

## 🚀 Future Enhancements

Consider adding:
- Search functionality across all questions
- "Was this helpful?" feedback buttons
- Related questions suggestions
- Link sharing to specific questions
- Print-friendly version

---

**Need Help?** Contact the development team or refer to the main project documentation.
