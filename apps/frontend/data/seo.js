// Centralized SEO configuration for all pages
// Each page can have separate metadata for English and Arabic

export const seoConfig = {
  // Default/Home page
  home: {
    en: {
      title: "QuickAir - Your Adventure Travel Experts",
      description:
        "Discover 300,000+ unforgettable travel experiences worldwide. Book your next adventure with QuickAir, your trusted travel experts.",
      keywords:
        "travel, tours, adventures, destinations, vacation, holiday, booking",
      ogImage: "/img/seo/home-og.jpg",
    },
    ar: {
      title: "QuickAir - خبراء السفر والمغامرات",
      description:
        "اكتشف أكثر من 300,000 تجربة سفر لا تُنسى حول العالم. احجز مغامرتك القادمة مع QuickAir، خبراء السفر الموثوق بهم.",
      keywords: "سفر, جولات, مغامرات, وجهات, عطلة, حجز",
      ogImage: "/img/seo/home-og-ar.jpg",
    },
  },

  // Tour List pages
  tourList: {
    en: {
      title: "Explore Amazing Tours & Destinations | QuickAir",
      description:
        "Browse through our curated collection of tours and destinations. Find the perfect adventure for your next trip.",
      keywords:
        "tours, destinations, travel packages, adventure tours, city tours",
      ogImage: "/img/seo/tours-og.jpg",
    },
    ar: {
      title: "استكشف الجولات والوجهات المذهلة | QuickAir",
      description:
        "تصفح مجموعتنا المختارة من الجولات والوجهات. اعثر على المغامرة المثالية لرحلتك القادمة.",
      keywords: "جولات, وجهات, باقات سفر, جولات مغامرات, جولات المدن",
      ogImage: "/img/seo/tours-og-ar.jpg",
    },
  },

  // Tour Single/Details pages
  tourSingle: {
    en: {
      title: "Tour Details | QuickAir",
      description:
        "Explore detailed information about this amazing tour experience. Check availability, pricing, and book your adventure today.",
      keywords: "tour details, book tour, tour information, travel experience",
      ogImage: "/img/seo/tour-detail-og.jpg",
    },
    ar: {
      title: "تفاصيل الجولة | QuickAir",
      description:
        "استكشف معلومات تفصيلية حول تجربة الجولة المذهلة هذه. تحقق من التوفر والأسعار واحجز مغامرتك اليوم.",
      keywords: "تفاصيل الجولة, حجز جولة, معلومات الجولة, تجربة السفر",
      ogImage: "/img/seo/tour-detail-og-ar.jpg",
    },
  },

  // Destinations page
  destinations: {
    en: {
      title: "Travel Destinations Around the World | QuickAir",
      description:
        "Discover breathtaking destinations across the globe. Find your perfect getaway from our extensive collection of travel locations.",
      keywords:
        "travel destinations, world destinations, vacation spots, tourist destinations",
      ogImage: "/img/seo/destinations-og.jpg",
    },
    ar: {
      title: "وجهات السفر حول العالم | QuickAir",
      description:
        "اكتشف وجهات خلابة حول العالم. اعثر على ملاذك المثالي من مجموعتنا الواسعة من أماكن السفر.",
      keywords: "وجهات السفر, وجهات العالم, أماكن العطلات, الوجهات السياحية",
      ogImage: "/img/seo/destinations-og-ar.jpg",
    },
  },

  // About page
  about: {
    en: {
      title: "About QuickAir - Your Trusted Travel Partner",
      description:
        "Learn about QuickAir's mission to provide exceptional travel experiences. Discover why thousands of travelers trust us for their adventures.",
      keywords: "about QuickAir, travel company, about us, travel experts",
      ogImage: "/img/seo/about-og.jpg",
    },
    ar: {
      title: "عن QuickAir - شريك السفر الموثوق",
      description:
        "تعرف على مهمة QuickAir لتوفير تجارب سفر استثنائية. اكتشف لماذا يثق الآلاف من المسافرين بنا في مغامراتهم.",
      keywords: "عن QuickAir, شركة سفر, من نحن, خبراء السفر",
      ogImage: "/img/seo/about-og-ar.jpg",
    },
  },

  // Contact page
  contact: {
    en: {
      title: "Contact Us - QuickAir Travel Support",
      description:
        "Get in touch with QuickAir's travel experts. We're here to help you plan your perfect adventure.",
      keywords: "contact QuickAir, travel support, customer service, help",
      ogImage: "/img/seo/contact-og.jpg",
    },
    ar: {
      title: "اتصل بنا - دعم QuickAir للسفر",
      description:
        "تواصل مع خبراء السفر في QuickAir. نحن هنا لمساعدتك في التخطيط لمغامرتك المثالية.",
      keywords: "اتصل بـ QuickAir, دعم السفر, خدمة العملاء, مساعدة",
      ogImage: "/img/seo/contact-og-ar.jpg",
    },
  },

  // Blog/Articles
  blog: {
    en: {
      title: "Travel Blog & Tips | QuickAir",
      description:
        "Read the latest travel articles, tips, and destination guides from QuickAir's travel experts.",
      keywords: "travel blog, travel tips, travel guides, destination guides",
      ogImage: "/img/seo/blog-og.jpg",
    },
    ar: {
      title: "مدونة ونصائح السفر | QuickAir",
      description:
        "اقرأ أحدث المقالات السياحية والنصائح وأدلة الوجهات من خبراء السفر في QuickAir.",
      keywords: "مدونة السفر, نصائح السفر, أدلة السفر, أدلة الوجهات",
      ogImage: "/img/seo/blog-og-ar.jpg",
    },
  },

  // Help Center
  helpCenter: {
    en: {
      title: "Help Center - QuickAir Travel Support",
      description:
        "Find answers to frequently asked questions and get help with your travel bookings.",
      keywords: "help center, FAQ, support, travel help, booking help",
      ogImage: "/img/seo/help-og.jpg",
    },
    ar: {
      title: "مركز المساعدة - دعم QuickAir للسفر",
      description:
        "اعثر على إجابات للأسئلة المتكررة واحصل على المساعدة في حجوزات السفر الخاصة بك.",
      keywords:
        "مركز المساعدة, الأسئلة الشائعة, الدعم, مساعدة السفر, مساعدة الحجز",
      ogImage: "/img/seo/help-og-ar.jpg",
    },
  },

  // FAQ Page
  faq: {
    en: {
      title: "Frequently Asked Questions | QuickAir",
      description:
        "Get answers to common questions about bookings, payments, travel, flights, hotels, Hajj & Omra packages, and customer support at QuickAir.",
      keywords:
        "FAQ, frequently asked questions, travel questions, booking help, customer support, travel support",
      ogImage: "/img/seo/faq-og.jpg",
    },
    ar: {
      title: "الأسئلة الشائعة | QuickAir",
      description:
        "احصل على إجابات للأسئلة الشائعة حول الحجوزات والدفع والسفر والرحلات الجوية والفنادق وباقات الحج والعمرة ودعم العملاء في QuickAir.",
      keywords:
        "الأسئلة الشائعة, أسئلة متكررة, أسئلة السفر, مساعدة الحجز, دعم العملاء, دعم السفر",
      ogImage: "/img/seo/faq-og-ar.jpg",
    },
  },

  // Dashboard
  dashboard: {
    en: {
      title: "My Dashboard | QuickAir",
      description: "Manage your bookings, favorites, and profile on QuickAir.",
      keywords: "dashboard, my bookings, my account, user profile",
      ogImage: "/img/seo/dashboard-og.jpg",
    },
    ar: {
      title: "لوحة التحكم | QuickAir",
      description: "إدارة حجوزاتك ومفضلاتك وملفك الشخصي على QuickAir.",
      keywords: "لوحة التحكم, حجوزاتي, حسابي, الملف الشخصي",
      ogImage: "/img/seo/dashboard-og-ar.jpg",
    },
  },

  // Offers List
  offersList: {
    en: {
      title: "Exclusive Travel Offers & Packages | QuickAir",
      description:
        "Discover our handpicked selection of exclusive travel offers and vacation packages. Find the best deals for your next adventure.",
      keywords:
        "travel offers, vacation packages, travel deals, holiday packages, special offers",
      ogImage: "/img/seo/offers-og.jpg",
    },
    ar: {
      title: "عروض وباقات السفر الحصرية | QuickAir",
      description:
        "اكتشف مجموعتنا المختارة من عروض السفر الحصرية وباقات العطلات. اعثر على أفضل الصفقات لمغامرتك القادمة.",
      keywords:
        "عروض السفر, باقات العطلات, صفقات السفر, باقات العطلات, عروض خاصة",
      ogImage: "/img/seo/offers-og-ar.jpg",
    },
  },

  // Hotels List
  hotelsList: {
    en: {
      title: "Premium Hotels Worldwide | QuickAir",
      description:
        "Explore our curated collection of premium hotels worldwide. Find the perfect accommodation for your next trip.",
      keywords:
        "hotels, accommodation, luxury hotels, hotel booking, premium hotels",
      ogImage: "/img/seo/hotels-og.jpg",
    },
    ar: {
      title: "الفنادق الفاخرة حول العالم | QuickAir",
      description:
        "استكشف مجموعتنا المنتقاة من الفنادق الفاخرة حول العالم. اعثر على الإقامة المثالية لرحلتك القادمة.",
      keywords: "فنادق, إقامة, فنادق فاخرة, حجز فنادق, فنادق ممتازة",
      ogImage: "/img/seo/hotels-og-ar.jpg",
    },
  },

  // Terms & Conditions
  terms: {
    en: {
      title: "Terms & Conditions | QuickAir",
      description:
        "Read QuickAir's terms and conditions for using our travel services and booking platform.",
      keywords: "terms and conditions, terms of service, legal, booking terms",
      ogImage: "/img/seo/terms-og.jpg",
    },
    ar: {
      title: "الشروط والأحكام | QuickAir",
      description:
        "اقرأ شروط وأحكام QuickAir لاستخدام خدمات السفر ومنصة الحجز الخاصة بنا.",
      keywords: "الشروط والأحكام, شروط الخدمة, قانوني, شروط الحجز",
      ogImage: "/img/seo/terms-og-ar.jpg",
    },
  },

  // 404 Not Found
  notFound: {
    en: {
      title: "Page Not Found | QuickAir",
      description:
        "The page you're looking for doesn't exist. Explore our travel offers and destinations.",
      keywords: "404, not found, page not found",
      ogImage: "/img/seo/404-og.jpg",
    },
    ar: {
      title: "الصفحة غير موجودة | QuickAir",
      description:
        "الصفحة التي تبحث عنها غير موجودة. استكشف عروض السفر والوجهات لدينا.",
      keywords: "404, غير موجود, صفحة غير موجودة",
      ogImage: "/img/seo/404-og-ar.jpg",
    },
  },
};

// Default fallback metadata
export const defaultSEO = {
  en: {
    title: "QuickAir - Travel & Adventure Experts",
    description:
      "Discover amazing travel experiences with QuickAir. Book tours, explore destinations, and create unforgettable memories.",
    keywords: "travel, tours, adventures, destinations, vacation, booking",
    ogImage: "/img/seo/default-og.jpg",
  },
  ar: {
    title: "QuickAir - خبراء السفر والمغامرات",
    description:
      "اكتشف تجارب سفر مذهلة مع QuickAir. احجز الجولات، استكشف الوجهات، واصنع ذكريات لا تُنسى.",
    keywords: "سفر, جولات, مغامرات, وجهات, عطلة, حجز",
    ogImage: "/img/seo/default-og-ar.jpg",
  },
};

// Common site information
export const siteInfo = {
  siteName: "QuickAir",
  siteUrl: "https://quickair.com", // Update with your actual domain
  twitterHandle: "@quickair",
  facebookUrl: "https://facebook.com/quickair",
  instagramUrl: "https://instagram.com/quickair",
};
