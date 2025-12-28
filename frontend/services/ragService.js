/**
 * RAG Service - Retrieval-Augmented Generation for QuickAir
 * نظام استرجاع وتوليد محتوى ذكي لـ QuickAir
 * 
 * ❗ CRITICAL: NO HALLUCINATIONS - Only real data from database
 */

import baliData from "@/data/tours/bali.json";
import istanbulData from "@/data/tours/Istanbul.json";
import sharmData from "@/data/tours/sharm_el_sheikh.json";
import hurghadaData from "@/data/tours/hurghada.json";
import dahabData from "@/data/tours/dahab.json";
import beirutData from "@/data/tours/Beirut.json";
import ainSokhnaData from "@/data/tours/ain_sokhna.json";
import sahlHashishData from "@/data/tours/sahl_hashish.json";

// FAQs
import arAviationFAQ from "@/data/faq_output/ar_قسم_الطيران.json";
import enAviationFAQ from "@/data/faq_output/en_Aviation.json";
import arHotelsFAQ from "@/data/faq_output/ar_قسم_الفنادق.json";
import enHotelsFAQ from "@/data/faq_output/en_Hotels.json";
import arHajjFAQ from "@/data/faq_output/ar_قسم_الحج_والعمرة.json";
import enHajjFAQ from "@/data/faq_output/en_Hajj_and_Umrah.json";
import arVisasFAQ from "@/data/faq_output/ar_قسم_التأشيرات.json";
import enVisasFAQ from "@/data/faq_output/en_Visas.json";

/**
 * ===================================
 * معلومات الشركة الكاملة - Company Information
 * ===================================
 */
const COMPANY_INFO = {
  name: {
    ar: "كويك إير للسياحة",
    en: "Quick Air Travel"
  },
  established: 1986,
  description: {
    ar: "وكالة سفر مصرية رائدة تأسست عام 1986، متخصصة في تنظيم الرحلات السياحية وحجوزات الطيران والفنادق والتأشيرات",
    en: "A leading Egyptian travel agency established in 1986, specializing in organizing tours, flight bookings, hotels, and visas"
  },
  contact: {
    phone: ["+20 123 456 7890", "+20 111 222 3333"],
    email: "info@quickair.com",
    whatsapp: "+20 123 456 7890",
    address: {
      ar: "القاهرة، مصر",
      en: "Cairo, Egypt"
    }
  },
  workingHours: {
    ar: "السبت - الخميس: 9 صباحاً - 9 مساءً | الجمعة: 2 مساءً - 9 مساءً",
    en: "Saturday - Thursday: 9 AM - 9 PM | Friday: 2 PM - 9 PM"
  },
  socialMedia: {
    facebook: "https://facebook.com/quickair",
    instagram: "https://instagram.com/quickair",
    twitter: "https://twitter.com/quickair"
  }
};

/**
 * ===================================
 * الخدمات المتاحة - Available Services
 * ===================================
 */
const SERVICES = {
  flights: {
    name: { ar: "حجز الطيران", en: "Flight Booking" },
    description: {
      ar: "حجز تذاكر طيران داخلية ودولية على جميع شركات الطيران",
      en: "Domestic and international flight bookings on all airlines"
    },
    features: {
      ar: ["أسعار تنافسية", "حجز فوري", "جميع شركات الطيران", "رحلات ذهاب وعودة أو اتجاه واحد"],
      en: ["Competitive prices", "Instant booking", "All airlines", "Round-trip or one-way flights"]
    }
  },
  hotels: {
    name: { ar: "حجز الفنادق", en: "Hotel Booking" },
    description: {
      ar: "حجز فنادق في جميع أنحاء العالم من 3 إلى 5 نجوم",
      en: "Hotel bookings worldwide from 3 to 5 stars"
    },
    features: {
      ar: ["فنادق معتمدة", "أفضل الأسعار", "إلغاء مجاني (حسب السياسة)", "خيارات متنوعة"],
      en: ["Verified hotels", "Best prices", "Free cancellation (policy dependent)", "Various options"]
    }
  },
  tours: {
    name: { ar: "الرحلات السياحية", en: "Tours" },
    description: {
      ar: "رحلات سياحية منظمة داخل مصر وخارجها",
      en: "Organized tours inside and outside Egypt"
    },
    destinations: {
      domestic: {
        ar: ["شرم الشيخ", "الغردقة", "دهب", "العين السخنة", "الأقصر وأسوان", "الساحل الشمالي"],
        en: ["Sharm El Sheikh", "Hurghada", "Dahab", "Ain Sokhna", "Luxor & Aswan", "North Coast"]
      },
      international: {
        ar: ["تركيا (إسطنبول)", "بالي - إندونيسيا", "دبي", "لبنان (بيروت)", "اليونان", "المالديف"],
        en: ["Turkey (Istanbul)", "Bali - Indonesia", "Dubai", "Lebanon (Beirut)", "Greece", "Maldives"]
      }
    }
  },
  hajjUmrah: {
    name: { ar: "الحج والعمرة", en: "Hajj & Umrah" },
    description: {
      ar: "برامج حج وعمرة متكاملة مع إقامة قريبة من الحرم",
      en: "Complete Hajj and Umrah programs with accommodation near the Haram"
    },
    features: {
      ar: ["إقامة قريبة من الحرم", "مرشدين دينيين", "وجبات يومية", "نقل مريح"],
      en: ["Accommodation near Haram", "Religious guides", "Daily meals", "Comfortable transportation"]
    }
  },
  visas: {
    name: { ar: "التأشيرات", en: "Visas" },
    description: {
      ar: "استخراج تأشيرات سياحية لجميع الدول",
      en: "Tourist visa processing for all countries"
    },
    countries: {
      ar: ["تركيا", "دول شنغن", "أمريكا", "بريطانيا", "الإمارات", "السعودية"],
      en: ["Turkey", "Schengen countries", "USA", "UK", "UAE", "Saudi Arabia"]
    }
  },
  transportation: {
    name: { ar: "النقل والتوصيل", en: "Transportation" },
    description: {
      ar: "خدمات نقل من وإلى المطار وتأجير سيارات",
      en: "Airport transfers and car rental services"
    },
    types: {
      ar: ["نقل من/إلى المطار", "تأجير سيارات مع سائق", "حافلات سياحية", "ليموزين VIP"],
      en: ["Airport transfers", "Car rental with driver", "Tourist buses", "VIP limousine"]
    }
  }
};

/**
 * ===================================
 * سياسات الحجز والإلغاء - Booking Policies
 * ===================================
 */
const POLICIES = {
  booking: {
    ar: [
      "يتم تأكيد الحجز بعد دفع 50% من إجمالي المبلغ",
      "يجب دفع المبلغ المتبقي قبل 7 أيام من موعد السفر",
      "الأسعار قابلة للتغيير حسب سعر الصرف وتوفر الغرف"
    ],
    en: [
      "Booking is confirmed after paying 50% of the total amount",
      "Remaining amount must be paid 7 days before travel date",
      "Prices are subject to change based on exchange rate and room availability"
    ]
  },
  cancellation: {
    ar: [
      "إلغاء قبل 30 يوم: استرداد 90% من المبلغ",
      "إلغاء قبل 15 يوم: استرداد 50% من المبلغ",
      "إلغاء قبل 7 أيام: لا يوجد استرداد",
      "حالات القوة القاهرة: يتم التعامل معها بشكل فردي"
    ],
    en: [
      "Cancellation 30+ days before: 90% refund",
      "Cancellation 15+ days before: 50% refund",
      "Cancellation within 7 days: No refund",
      "Force majeure cases: Handled individually"
    ]
  },
  payment: {
    methods: {
      ar: ["بطاقات الائتمان (Visa, MasterCard)", "التحويل البنكي", "فودافون كاش", "الدفع النقدي في المكتب"],
      en: ["Credit cards (Visa, MasterCard)", "Bank transfer", "Vodafone Cash", "Cash payment at office"]
    }
  }
};

/**
 * ===================================
 * العروض الحالية - Current Offers
 * ===================================
 */
const CURRENT_OFFERS = {
  ar: [
    { title: "عرض شهر العسل في بالي", discount: "15%", validUntil: "نهاية ديسمبر 2024" },
    { title: "رحلات شرم الشيخ", discount: "خصم 500 جنيه للحجز المبكر", validUntil: "متاح الآن" },
    { title: "عمرة رمضان", discount: "أسعار خاصة", validUntil: "احجز الآن" }
  ],
  en: [
    { title: "Bali Honeymoon Offer", discount: "15%", validUntil: "End of December 2024" },
    { title: "Sharm El Sheikh Trips", discount: "500 EGP off for early booking", validUntil: "Available now" },
    { title: "Ramadan Umrah", discount: "Special prices", validUntil: "Book now" }
  ]
};

/**
 * خريطة صفحات الموقع الكاملة مع الوصف
 * Complete Site Pages Map with Descriptions
 */
const SITE_PAGES = {
  home: {
    url: "/",
    name_ar: "الرئيسية",
    name_en: "Home",
    desc_ar: "الصفحة الرئيسية - عروض، وجهات، وكل خدماتنا",
    desc_en: "Home page - offers, destinations, and all our services",
    keywords_ar: ["رئيسية", "البداية", "الصفحة الأولى", "home"],
    keywords_en: ["home", "main", "homepage", "start"]
  },
  tours: {
    url: "/tours-list",
    name_ar: "الرحلات",
    name_en: "Tours",
    desc_ar: "جميع الرحلات والوجهات السياحية المتاحة",
    desc_en: "All available tours and destinations",
    keywords_ar: ["رحلات", "جولات", "وجهات", "سياحة", "tours"],
    keywords_en: ["tours", "trips", "destinations", "travel"]
  },
  hotels: {
    url: "/hotels",
    name_ar: "الفنادق",
    name_en: "Hotels",
    desc_ar: "حجز الفنادق في جميع الوجهات",
    desc_en: "Book hotels in all destinations",
    keywords_ar: ["فنادق", "فندق", "إقامة", "حجز فندق", "hotels"],
    keywords_en: ["hotels", "hotel", "accommodation", "booking"]
  },
  offers: {
    url: "/offers",
    name_ar: "العروض",
    name_en: "Offers",
    desc_ar: "أحدث العروض والخصومات الخاصة",
    desc_en: "Latest offers and special discounts",
    keywords_ar: ["عروض", "خصومات", "تخفيضات", "offers"],
    keywords_en: ["offers", "deals", "discounts", "promotions"]
  },
  createTrip: {
    url: "/create-trip",
    name_ar: "خطط رحلتك",
    name_en: "Plan Your Trip",
    desc_ar: "صمم رحلتك الخاصة حسب احتياجاتك",
    desc_en: "Design your custom trip",
    keywords_ar: ["تخطيط", "رحلة مخصصة", "خطط", "plan"],
    keywords_en: ["plan", "create", "custom trip", "design"]
  },
  contact: {
    url: "/contact",
    name_ar: "اتصل بنا",
    name_en: "Contact Us",
    desc_ar: "تواصل معنا - خدمة عملاء 24/7",
    desc_en: "Contact us - 24/7 customer service",
    keywords_ar: ["اتصال", "تواصل", "خدمة عملاء", "مساعدة", "contact"],
    keywords_en: ["contact", "support", "help", "customer service"]
  },
  about: {
    url: "/about",
    name_ar: "من نحن",
    name_en: "About Us",
    desc_ar: "تعرف على شركة Quick Air وخدماتنا",
    desc_en: "Learn about Quick Air and our services",
    keywords_ar: ["من نحن", "عن الشركة", "about"],
    keywords_en: ["about", "company", "who we are"]
  },
  faq: {
    url: "/faq",
    name_ar: "الأسئلة الشائعة",
    name_en: "FAQs",
    desc_ar: "أسئلة وأجوبة حول خدماتنا",
    desc_en: "Questions and answers about our services",
    keywords_ar: ["أسئلة", "استفسارات", "faq", "مساعدة"],
    keywords_en: ["faq", "questions", "help", "answers"]
  },
  terms: {
    url: "/terms",
    name_ar: "الشروط والأحكام",
    name_en: "Terms & Conditions",
    desc_ar: "شروط الاستخدام وسياسة الخصوصية",
    desc_en: "Terms of use and privacy policy",
    keywords_ar: ["شروط", "أحكام", "سياسة", "terms"],
    keywords_en: ["terms", "conditions", "policy", "privacy"]
  },
  hajj: {
    url: "/haj",
    name_ar: "الحج",
    name_en: "Hajj",
    desc_ar: "برامج الحج المتكاملة",
    desc_en: "Complete Hajj programs",
    keywords_ar: ["حج", "مكة", "الحرم", "hajj"],
    keywords_en: ["hajj", "mecca", "pilgrimage"]
  },
  umrah: {
    url: "/omra",
    name_ar: "العمرة",
    name_en: "Umrah",
    desc_ar: "برامج العمرة على مدار العام",
    desc_en: "Year-round Umrah programs",
    keywords_ar: ["عمرة", "umrah", "مكة", "المدينة"],
    keywords_en: ["umrah", "mecca", "medina"]
  },
  
  // صفحات الوجهات - توجيه لصفحة العروض
  destinations: {
    bali: "/offers",
    istanbul: "/offers",
    sharm: "/offers",
    hurghada: "/offers",
    dahab: "/offers",
    beirut: "/offers",
    ainsokhna: "/offers",
    sahlhashish: "/offers",
  }
};

/**
 * جميع البيانات الحقيقية
 */
const ALL_DESTINATIONS = {
  bali: baliData,
  istanbul: istanbulData,
  sharm: sharmData,
  hurghada: hurghadaData,
  dahab: dahabData,
  beirut: beirutData,
  ainsokhna: ainSokhnaData,
  sahlhashish: sahlHashishData
};

const ALL_FAQS = {
  ar: {
    aviation: arAviationFAQ,
    hotels: arHotelsFAQ,
    hajj: arHajjFAQ,
    visas: arVisasFAQ
  },
  en: {
    aviation: enAviationFAQ,
    hotels: enHotelsFAQ,
    hajj: enHajjFAQ,
    visas: enVisasFAQ
  }
};

/**
 * 1️⃣ فهم اللغة الطبيعية - Extract Intent and Entities (12 Intent Types)
 */
export function analyzeUserMessage(message, language = "ar") {
  const msg = message.toLowerCase();
  const isArabic = language === "ar";
  
  // تحليل النية (Intent) - 12 نوع
  let intent = "general";
  let confidence = 0.5;
  
  // 1. التحية - Greeting
  if (
    msg.match(/^(مرحب|سلام|هلا|hello|hi|hey|good morning|good evening)/i)
  ) {
    intent = "greeting";
    confidence = 1.0;
  }
  // 2. البحث عن فنادق - Hotel Search
  else if (
    msg.includes("فندق") || msg.includes("hotel") ||
    msg.includes("إقامة") || msg.includes("accommodation") ||
    msg.includes("مكان") || msg.includes("place to stay")
  ) {
    intent = "search_hotels";
    confidence = 0.9;
  }
  // 3. السؤال عن السعر - Price Inquiry
  else if (
    msg.includes("سعر") || msg.includes("price") ||
    msg.includes("كام") || msg.includes("how much") ||
    msg.includes("تكلفة") || msg.includes("cost")
  ) {
    intent = "price_inquiry";
    confidence = 0.9;
  }
  // 4. مقارنة الفنادق - Hotel Comparison
  else if (
    msg.includes("قارن") || msg.includes("compare") ||
    msg.includes("الفرق") || msg.includes("difference") ||
    msg.includes("أيهما") || msg.includes("which")
  ) {
    intent = "compare_hotels";
    confidence = 0.85;
  }
  // 5. طلب حجز - Booking Request
  else if (
    msg.includes("حجز") || msg.includes("book") ||
    msg.includes("احجز") || msg.includes("reserve")
  ) {
    intent = "book_hotel";
    confidence = 0.9;
  }
  // 6. السؤال عن الموقع - Location Query
  else if (
    msg.includes("فين") || msg.includes("where") ||
    msg.includes("موقع") || msg.includes("location") ||
    msg.includes("مكان") || msg.includes("place")
  ) {
    intent = "location_query";
    confidence = 0.8;
  }
  // 7. السؤال عن المرافق - Amenities Query
  else if (
    msg.includes("مرافق") || msg.includes("amenities") ||
    msg.includes("مميزات") || msg.includes("features") ||
    msg.includes("فيه") || msg.includes("have") ||
    msg.includes("يوجد") || msg.includes("available")
  ) {
    intent = "amenities_query";
    confidence = 0.8;
  }
  // 8. طلب مساعدة - Help Request
  else if (
    msg.includes("مساعدة") || msg.includes("help") ||
    msg.includes("دعم") || msg.includes("support") ||
    msg.includes("مشكلة") || msg.includes("problem")
  ) {
    intent = "help_request";
    confidence = 0.9;
  }
  // 9. السؤال عن صفحة معينة - Page Navigation
  else if (
    msg.includes("صفحة") || msg.includes("page") ||
    msg.includes("أين") || msg.includes("where") ||
    msg.includes("كيف أذهب") || msg.includes("how to go") ||
    msg.includes("وديني") || msg.includes("take me")
  ) {
    intent = "navigate_page";
    confidence = 0.85;
  }
  // 10. تغيير التاريخ - Date Change
  else if (
    msg.includes("تغيير") || msg.includes("change") ||
    msg.includes("تعديل") || msg.includes("modify") ||
    (msg.includes("تاريخ") || msg.includes("date"))
  ) {
    intent = "change_date";
    confidence = 0.7;
  }
  // 10. السؤال عن الميزانية - Budget Query
  else if (
    msg.includes("ميزانية") || msg.includes("budget") ||
    msg.includes("رخيص") || msg.includes("cheap") ||
    msg.includes("غالي") || msg.includes("expensive")
  ) {
    intent = "budget_query";
    confidence = 0.85;
  }
  // 11. طلب توصية - Recommendation Request
  else if (
    msg.includes("اقترح") || msg.includes("suggest") ||
    msg.includes("توصية") || msg.includes("recommend") ||
    msg.includes("أفضل") || msg.includes("best")
  ) {
    intent = "recommendation_request";
    confidence = 0.8;
  }
  // 12. التأشيرة - Visa Inquiry
  else if (
    msg.includes("تأشيرة") || msg.includes("visa") ||
    msg.includes("فيزا")
  ) {
    intent = "visa_inquiry";
    confidence = 0.9;
  }
  // 13. السؤال عن الشركة - Company Info
  else if (
    msg.includes("من أنتم") || msg.includes("who are you") ||
    msg.includes("عن الشركة") || msg.includes("about company") ||
    msg.includes("من نحن") || msg.includes("about us") ||
    msg.includes("تأسست") || msg.includes("established") ||
    msg.includes("كويك إير") || msg.includes("quick air")
  ) {
    intent = "company_info";
    confidence = 0.9;
  }
  // 14. السؤال عن الخدمات - Services Inquiry
  else if (
    msg.includes("خدمات") || msg.includes("services") ||
    msg.includes("بتقدموا") || msg.includes("you offer") ||
    msg.includes("ماذا تقدمون") || msg.includes("what do you") ||
    msg.includes("إيه اللي") || msg.includes("what can")
  ) {
    intent = "services_inquiry";
    confidence = 0.9;
  }
  // 15. السؤال عن التواصل - Contact Info
  else if (
    msg.includes("رقم") || msg.includes("number") ||
    msg.includes("تليفون") || msg.includes("phone") ||
    msg.includes("واتساب") || msg.includes("whatsapp") ||
    msg.includes("إيميل") || msg.includes("email") ||
    msg.includes("عنوان") || msg.includes("address") ||
    msg.includes("أتواصل") || msg.includes("contact")
  ) {
    intent = "contact_info";
    confidence = 0.9;
  }
  // 16. السؤال عن سياسة الإلغاء - Cancellation Policy
  else if (
    msg.includes("إلغاء") || msg.includes("cancel") ||
    msg.includes("استرداد") || msg.includes("refund") ||
    msg.includes("سياسة") || msg.includes("policy")
  ) {
    intent = "cancellation_policy";
    confidence = 0.9;
  }
  // 17. السؤال عن طرق الدفع - Payment Methods
  else if (
    msg.includes("دفع") || msg.includes("pay") ||
    msg.includes("فيزا كارد") || msg.includes("credit card") ||
    msg.includes("تحويل") || msg.includes("transfer") ||
    msg.includes("كاش") || msg.includes("cash")
  ) {
    intent = "payment_methods";
    confidence = 0.85;
  }
  // 18. السؤال عن العروض - Offers Inquiry
  else if (
    msg.includes("عرض") || msg.includes("offer") ||
    msg.includes("خصم") || msg.includes("discount") ||
    msg.includes("تخفيض") || msg.includes("promotion")
  ) {
    intent = "offers_inquiry";
    confidence = 0.9;
  }
  // 19. الحج والعمرة - Hajj & Umrah
  else if (
    msg.includes("حج") || msg.includes("hajj") ||
    msg.includes("عمرة") || msg.includes("umrah") ||
    msg.includes("مكة") || msg.includes("mecca") ||
    msg.includes("المدينة") || msg.includes("medina")
  ) {
    intent = "hajj_umrah";
    confidence = 0.95;
  }
  // 20. ساعات العمل - Working Hours
  else if (
    msg.includes("مواعيد") || msg.includes("hours") ||
    msg.includes("فتح") || msg.includes("open") ||
    msg.includes("شغالين") || msg.includes("working")
  ) {
    intent = "working_hours";
    confidence = 0.85;
  }
  // Generic booking/travel
  else if (
    msg.includes("أريد") || msg.includes("want") ||
    msg.includes("عايز") || msg.includes("need") ||
    msg.includes("رحلة") || msg.includes("trip") ||
    msg.includes("سفر") || msg.includes("travel")
  ) {
    intent = "general_inquiry";
    confidence = 0.6;
  }

  // استخراج الوجهة
  let destination = null;
  const destinationMap = {
    // بالي
    "بالي": "bali",
    "bali": "bali",
    "إندونيسيا": "bali",
    "indonesia": "bali",
    // إسطنبول
    "إسطنبول": "istanbul",
    "اسطنبول": "istanbul",
    "istanbul": "istanbul",
    "تركيا": "istanbul",
    "turkey": "istanbul",
    // شرم الشيخ
    "شرم": "sharm",
    "sharm": "sharm",
    "الشيخ": "sharm",
    "sheikh": "sharm",
    "شرم الشيخ": "sharm",
    // الغردقة
    "الغردقة": "hurghada",
    "غردقة": "hurghada",
    "hurghada": "hurghada",
    // دهب
    "دهب": "dahab",
    "dahab": "dahab",
    // بيروت
    "بيروت": "beirut",
    "beirut": "beirut",
    "لبنان": "beirut",
    "lebanon": "beirut",
    // العين السخنة
    "السخنة": "ainsokhna",
    "العين السخنة": "ainsokhna",
    "عين السخنة": "ainsokhna",
    "ain sokhna": "ainsokhna",
    "sokhna": "ainsokhna",
    // سهل حشيش
    "سهل حشيش": "sahlhashish",
    "حشيش": "sahlhashish",
    "sahl hasheesh": "sahlhashish",
    "hasheesh": "sahlhashish"
  };

  for (const [key, value] of Object.entries(destinationMap)) {
    if (msg.includes(key)) {
      destination = value;
      break;
    }
  }

  // استخراج أسماء الفنادق المذكورة
  const hotelNames = [];
  const allHotels = [];
  Object.values(ALL_DESTINATIONS).forEach(dest => {
    if (dest.hotels) {
      allHotels.push(...dest.hotels);
    }
  });
  
  allHotels.forEach(hotel => {
    const nameAr = hotel.hotel_name_ar?.toLowerCase() || "";
    const nameEn = hotel.hotel_name_en?.toLowerCase() || "";
    if (nameAr && msg.includes(nameAr)) {
      hotelNames.push(hotel.hotel_name_ar);
    } else if (nameEn && msg.includes(nameEn)) {
      hotelNames.push(hotel.hotel_name_en);
    }
  });

  // استخراج الميزانية
  let budget = null;
  const budgetMatch = msg.match(/(\d+)\s*(دولار|dollar|جنيه|egp|usd)/i);
  if (budgetMatch) {
    budget = parseInt(budgetMatch[1]);
  }

  // استخراج عدد المسافرين
  let travelers = null;
  const travelersMatch = msg.match(/(\d+)\s*(شخص|person|people|أشخاص|فرد)/i);
  if (travelersMatch) {
    travelers = parseInt(travelersMatch[1]);
  }

  // استخراج عدد الليالي
  let nights = null;
  const nightsMatch = msg.match(/(\d+)\s*(ليلة|night|أيام|days)/i);
  if (nightsMatch) {
    nights = parseInt(nightsMatch[1]);
  }

  // استخراج التقييم (عدد النجوم)
  let stars = null;
  const starsMatch = msg.match(/(\d+)\s*(نجم|نجوم|star)/i);
  if (starsMatch) {
    stars = parseInt(starsMatch[1]);
  }

  return {
    intent,
    confidence,
    destination,
    hotelNames,
    budget,
    travelers,
    nights,
    stars,
    originalMessage: message,
    language
  };
}

/**
 * 2️⃣ RAG - البحث في البيانات الحقيقية فقط
 */
export function searchHotels(filters = {}) {
  const {
    destination,
    budget, // This is maxEGP from BudgetWidget
    stars,
    language = "ar",
    maxResults = 5
  } = filters;

  let results = [];

  // البحث في الوجهات
  const destData = destination ? [ALL_DESTINATIONS[destination]] : Object.values(ALL_DESTINATIONS);
  
  destData.forEach(dest => {
    if (!dest || !dest.hotels) return;

    dest.hotels.forEach(hotel => {
      // تطبيق الفلاتر - budget is in EGP
      if (budget && hotel.price_egp > budget) return;
      if (stars && hotel.stars !== stars) return;

      results.push({
        ...hotel,
        destination: dest.location,
        includes: dest.includes?.[language] || [],
        not_included: dest.not_included?.[language] || [],
        optional_tours: dest.optional_tours || []
      });
    });
  });

  // ترتيب حسب السعر
  results.sort((a, b) => a.price_egp - b.price_egp);

  return results.slice(0, maxResults);
}

/**
 * 3️⃣ الحصول على معلومات وجهة محددة
 */
export function getDestinationInfo(destination, language = "ar") {
  const destData = ALL_DESTINATIONS[destination];
  if (!destData) return null;

  const isArabic = language === "ar";

  return {
    location: destData.location,
    hotels_count: destData.hotels?.length || 0,
    price_range: {
      min: Math.min(...(destData.hotels || []).map(h => h.price_egp)),
      max: Math.max(...(destData.hotels || []).map(h => h.price_egp)),
      min_usd: Math.min(...(destData.hotels || []).map(h => h.price_usd_reference)),
      max_usd: Math.max(...(destData.hotels || []).map(h => h.price_usd_reference))
    },
    includes: destData.includes[language],
    not_included: destData.not_included[language],
    optional_tours: destData.optional_tours || [],
    notes: destData.notes?.[language] || null
  };
}

/**
 * 4️⃣ البحث في الأسئلة الشائعة
 */
export function searchFAQs(query, language = "ar") {
  const faqs = ALL_FAQS[language];
  if (!faqs) return [];

  const queryLower = query.toLowerCase();
  let results = [];

  Object.values(faqs).forEach(category => {
    if (!category.faqs) return;

    category.faqs.forEach(faq => {
      const question = language === "ar" ? faq["السؤال"] : faq.question;
      const answer = language === "ar" ? faq["الإجابة"] : faq.answer;

      if (
        question?.toLowerCase().includes(queryLower) ||
        answer?.toLowerCase().includes(queryLower)
      ) {
        results.push({ question, answer, category: category.category });
      }
    });
  });

  return results.slice(0, 3);
}

/**
 * 5️⃣ حساب السعر النهائي بدقة 100%
 */
export function calculateTotalPrice(hotel, travelers = 1, nights = 3) {
  if (!hotel) return null;

  const pricePerPerson = hotel.prices_egp?.double || hotel.price_egp;
  const totalEGP = pricePerPerson * travelers;
  const totalUSD = hotel.price_usd_reference * travelers;

  return {
    price_per_person_egp: pricePerPerson,
    price_per_person_usd: hotel.price_usd_reference,
    total_egp: totalEGP,
    total_usd: totalUSD,
    travelers,
    nights,
    hotel_name: hotel.hotel_name_ar || hotel.hotel_name_en
  };
}

/**
 * 6️⃣ تنسيق نتائج البحث للعرض
 */
export function formatHotelForDisplay(hotel, language = "ar") {
  const isArabic = language === "ar";

  return {
    name: isArabic ? hotel.hotel_name_ar : hotel.hotel_name_en,
    stars: "⭐".repeat(hotel.stars),
    area: hotel.area,
    room_type: isArabic ? hotel.room_type_ar : hotel.room_type_en,
    price_egp: hotel.price_egp?.toLocaleString("ar-EG"),
    price_usd: hotel.price_usd_reference,
    destination: hotel.destination,
    includes: hotel.includes,
    not_included: hotel.not_included
  };
}

/**
 * 7️⃣ الحصول على جميع الوجهات المتاحة
 */
export function getAllDestinations() {
  return Object.keys(ALL_DESTINATIONS).map(key => ({
    id: key,
    name: ALL_DESTINATIONS[key].location,
    hotels_count: ALL_DESTINATIONS[key].hotels?.length || 0
  }));
}

/**
 * 8️⃣ اقتراح وجهات بناءً على الميزانية
 */
export function suggestDestinationsByBudget(budget, language = "ar") {
  const suggestions = [];

  Object.entries(ALL_DESTINATIONS).forEach(([key, dest]) => {
    if (!dest.hotels) return;

    const affordableHotels = dest.hotels.filter(
      h => h.price_usd_reference <= budget
    );

    if (affordableHotels.length > 0) {
      const cheapest = Math.min(...affordableHotels.map(h => h.price_usd_reference));
      suggestions.push({
        destination: dest.location,
        key,
        hotels_count: affordableHotels.length,
        starting_from_usd: cheapest,
        starting_from_egp: cheapest * 50
      });
    }
  });

  return suggestions.sort((a, b) => a.starting_from_usd - b.starting_from_usd);
}

/**
 * 9️⃣ فحص ما إذا كان السؤال خارج النطاق
 */
export function isOutOfScope(message) {
  const msg = message.toLowerCase().trim();
  
  // Always return false - let intent detection handle it
  // The widget system and session manager will guide the conversation
  return false;
}

/**
 * 🔟 الحصول على الجولات الاختيارية
 */
export function getOptionalTours(destination, language = "ar") {
  const destData = ALL_DESTINATIONS[destination];
  if (!destData || !destData.optional_tours) return [];

  const isArabic = language === "ar";

  return destData.optional_tours.map(tour => ({
    name: isArabic ? tour.tour_name_ar : tour.tour_name_en,
    price_usd: tour.price_usd,
    details: isArabic ? tour.details_ar : tour.details_en
  }));
}

/**
 * 1️⃣1️⃣ مقارنة الفنادق - Hotel Comparison
 */
export function compareHotels(hotel1Name, hotel2Name, language = "ar") {
  const isArabic = language === "ar";
  
  // البحث عن الفنادق
  const allHotels = [];
  Object.values(ALL_DESTINATIONS).forEach(dest => {
    if (dest.hotels) {
      allHotels.push(...dest.hotels.map(h => ({...h, destination: dest.location})));
    }
  });

  const hotel1 = allHotels.find(h => 
    h.hotel_name_ar?.toLowerCase().includes(hotel1Name.toLowerCase()) ||
    h.hotel_name_en?.toLowerCase().includes(hotel1Name.toLowerCase())
  );

  const hotel2 = allHotels.find(h => 
    h.hotel_name_ar?.toLowerCase().includes(hotel2Name.toLowerCase()) ||
    h.hotel_name_en?.toLowerCase().includes(hotel2Name.toLowerCase())
  );

  if (!hotel1 || !hotel2) {
    return null;
  }

  // المقارنة
  const comparison = {
    hotel1: {
      name: isArabic ? hotel1.hotel_name_ar : hotel1.hotel_name_en,
      stars: hotel1.stars,
      price_egp: hotel1.price_egp,
      price_usd: hotel1.price_usd_reference,
      area: hotel1.area,
      room_type: isArabic ? hotel1.room_type_ar : hotel1.room_type_en,
      destination: hotel1.destination,
    },
    hotel2: {
      name: isArabic ? hotel2.hotel_name_ar : hotel2.hotel_name_en,
      stars: hotel2.stars,
      price_egp: hotel2.price_egp,
      price_usd: hotel2.price_usd_reference,
      area: hotel2.area,
      room_type: isArabic ? hotel2.room_type_ar : hotel2.room_type_en,
      destination: hotel2.destination,
    },
    differences: {
      price_diff_egp: Math.abs(hotel1.price_egp - hotel2.price_egp),
      price_diff_usd: Math.abs(hotel1.price_usd_reference - hotel2.price_usd_reference),
      stars_diff: hotel1.stars - hotel2.stars,
      cheaper: hotel1.price_egp < hotel2.price_egp ? "hotel1" : "hotel2",
      better_rating: hotel1.stars > hotel2.stars ? "hotel1" : (hotel2.stars > hotel1.stars ? "hotel2" : "equal"),
    }
  };

  return comparison;
}

/**
 * 1️⃣2️⃣ توصيات ذكية بناءً على التفضيلات - Smart Recommendations
 */
export function getSmartRecommendations(filters = {}) {
  const {
    destination,
    budget,
    stars,
    tripType = "family", // family, couple, solo, group
    language = "ar",
    maxResults = 3
  } = filters;

  let results = [];

  // البحث في الوجهات
  const destData = destination ? [ALL_DESTINATIONS[destination]] : Object.values(ALL_DESTINATIONS);
  
  destData.forEach(dest => {
    if (!dest || !dest.hotels) return;

    dest.hotels.forEach(hotel => {
      // تطبيق الفلاتر الأساسية
      if (budget && hotel.price_usd_reference > budget) return;
      if (stars && hotel.stars < stars) return;

      // حساب نقاط التوصية
      let score = 0;

      // التقييم (النجوم)
      score += hotel.stars * 20;

      // نوع الرحلة
      if (tripType === "family" && hotel.stars >= 4) score += 15;
      if (tripType === "couple" && hotel.stars === 5) score += 20;
      if (tripType === "solo" && hotel.stars >= 3) score += 10;
      if (tripType === "group" && hotel.stars >= 3) score += 10;

      // السعر (الأرخص يحصل على نقاط أعلى)
      if (hotel.price_usd_reference < 200) score += 15;
      else if (hotel.price_usd_reference < 400) score += 10;
      else score += 5;

      results.push({
        ...hotel,
        destination: dest.location,
        recommendationScore: score,
      });
    });
  });

  // ترتيب حسب نقاط التوصية
  results.sort((a, b) => b.recommendationScore - a.recommendationScore);

  return results.slice(0, maxResults);
}

/**
 * 1️⃣3️⃣ فلترة متقدمة للفنادق - Advanced Hotel Filtering
 */
export function filterHotelsAdvanced(filters = {}) {
  const {
    destination,
    minBudget,
    maxBudget,
    stars = [],
    areas = [],
    amenities = [],
    mealPlans = [],
    language = "ar",
    maxResults = 5
  } = filters;

  let results = [];

  // البحث في الوجهات
  const destData = destination ? [ALL_DESTINATIONS[destination]] : Object.values(ALL_DESTINATIONS);
  
  destData.forEach(dest => {
    if (!dest || !dest.hotels) return;

    dest.hotels.forEach(hotel => {
      // فلتر الميزانية
      if (minBudget && hotel.price_egp < minBudget) return;
      if (maxBudget && hotel.price_egp > maxBudget) return;

      // فلتر النجوم
      if (stars.length > 0 && !stars.includes(hotel.stars)) return;

      // فلتر المناطق
      if (areas.length > 0 && !areas.includes(hotel.area)) return;

      // فلتر المرافق (إذا كانت متوفرة في البيانات)
      if (amenities.length > 0 && hotel.amenities) {
        const hasAllAmenities = amenities.every(amenity => 
          hotel.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return;
      }

      results.push({
        ...hotel,
        destination: dest.location,
      });
    });
  });

  // ترتيب حسب السعر
  results.sort((a, b) => a.price_egp - b.price_egp);

  return results.slice(0, maxResults);
}

/**
 * 1️⃣4️⃣ معلومات التأشيرة
 */
export function getVisaInfo(destination, language = "ar") {
  const isArabic = language === "ar";
  
  const visaInfo = {
    bali: {
      ar: "تأشيرة عند الوصول - تُدفع في مطار بالي",
      en: "Visa on arrival - paid at Bali airport",
      required: true
    },
    istanbul: {
      ar: "تأشيرة إلكترونية - 208 دولار للفرد (عبر VoyaVisa)",
      en: "E-visa required - $208 per person (via VoyaVisa)",
      required: true,
      cost_usd: 208
    },
    sharm: {
      ar: "لا تحتاج تأشيرة للمصريين",
      en: "No visa required for Egyptians",
      required: false
    },
    hurghada: {
      ar: "لا تحتاج تأشيرة للمصريين",
      en: "No visa required for Egyptians",
      required: false
    },
    dahab: {
      ar: "لا تحتاج تأشيرة للمصريين",
      en: "No visa required for Egyptians",
      required: false
    },
    beirut: {
      ar: "تأشيرة عند الوصول - 25 دولار (يجب إحضار 2000 دولار)",
      en: "Visa on arrival - $25 (must hold $2000 cash)",
      required: true,
      cost_usd: 25
    }
  };

  const info = visaInfo[destination];
  if (!info) return null;

  return isArabic ? info.ar : info.en;
}

/**
 * 1️⃣5️⃣ بناء السياق الكامل للـ AI
 */
export function buildRAGContext(userAnalysis, language = "ar") {
  const { intent, destination, budget, travelers, hotelNames } = userAnalysis;
  
  let context = "";
  const isArabic = language === "ar";

  // معلومات الوجهة الشاملة
  if (destination) {
    const destInfo = getDestinationInfo(destination, language);
    const destData = ALL_DESTINATIONS[destination];
    
    if (destInfo && destData) {
      context += isArabic 
        ? `\n📍 معلومات تفصيلية عن ${destInfo.location}:\n`
        : `\n📍 Detailed ${destInfo.location} Information:\n`;
      
      context += isArabic
        ? `- عدد الفنادق المتاحة: ${destInfo.hotels_count} فندق\n`
        : `- Available hotels: ${destInfo.hotels_count} hotels\n`;
      
      context += isArabic
        ? `- نطاق الأسعار: ${destInfo.price_range.min_egp?.toLocaleString()}-${destInfo.price_range.max_egp?.toLocaleString()} جنيه (${destInfo.price_range.min_usd}-${destInfo.price_range.max_usd} دولار)\n`
        : `- Price range: ${destInfo.price_range.min_egp?.toLocaleString()}-${destInfo.price_range.max_egp?.toLocaleString()} EGP ($${destInfo.price_range.min_usd}-${destInfo.price_range.max_usd})\n`;
      
      // الشهور المتاحة للعرض
      if (destData.valid_months && destData.valid_months.length > 0) {
        context += isArabic
          ? `- الشهور المتاحة: ${destData.valid_months.join(', ')}\n`
          : `- Available months: ${destData.valid_months.join(', ')}\n`;
      }
      
      // ما يشمله العرض
      if (destInfo.includes && destInfo.includes.length > 0) {
        context += isArabic ? "\n✅ العرض يشمل:\n" : "\n✅ Package Includes:\n";
        destInfo.includes.forEach(item => {
          context += `   • ${item}\n`;
        });
      }
      
      // ما لا يشمله العرض
      if (destInfo.not_included && destInfo.not_included.length > 0) {
        context += isArabic ? "\n❌ لا يشمل:\n" : "\n❌ Not Included:\n";
        destInfo.not_included.forEach(item => {
          context += `   • ${item}\n`;
        });
      }
      
      // الجولات الاختيارية
      if (destInfo.optional_tours && destInfo.optional_tours.length > 0) {
        context += isArabic ? "\n🎯 جولات اختيارية متاحة:\n" : "\n🎯 Optional Tours Available:\n";
        destInfo.optional_tours.slice(0, 3).forEach((tour, i) => {
          const tourName = isArabic ? tour.tour_name_ar : tour.tour_name_en;
          const tourDetails = isArabic ? tour.details_ar : tour.details_en;
          context += `   ${i + 1}. ${tourName} - $${tour.price_usd}\n`;
          if (tourDetails) context += `      ${tourDetails}\n`;
        });
      }
      
      // ملاحظات مهمة
      if (destInfo.notes) {
        context += isArabic ? "\n📝 ملاحظات مهمة:\n" : "\n📝 Important Notes:\n";
        if (Array.isArray(destInfo.notes)) {
          destInfo.notes.forEach(note => context += `   • ${note}\n`);
        } else {
          context += `   ${destInfo.notes}\n`;
        }
      }
    }
  }

  // مقارنة الفنادق إذا ذكر فندقين
  if (intent === "compare_hotels" && hotelNames && hotelNames.length >= 2) {
    const comparison = compareHotels(hotelNames[0], hotelNames[1], language);
    if (comparison) {
      context += isArabic ? "\n🔄 مقارنة تفصيلية بين الفنادق:\n" : "\n🔄 Detailed Hotel Comparison:\n";
      context += `\n1️⃣ ${comparison.hotel1.name}:\n`;
      context += `   ⭐ ${comparison.hotel1.stars} نجوم\n`;
      context += `   📍 ${comparison.hotel1.area}\n`;
      context += `   🛏️ ${comparison.hotel1.room_type}\n`;
      context += `   💰 ${comparison.hotel1.price_egp?.toLocaleString()} جنيه ($${comparison.hotel1.price_usd})\n`;
      
      context += `\n2️⃣ ${comparison.hotel2.name}:\n`;
      context += `   ⭐ ${comparison.hotel2.stars} نجوم\n`;
      context += `   📍 ${comparison.hotel2.area}\n`;
      context += `   🛏️ ${comparison.hotel2.room_type}\n`;
      context += `   💰 ${comparison.hotel2.price_egp?.toLocaleString()} جنيه ($${comparison.hotel2.price_usd})\n`;
      
      const cheaper = comparison.differences.cheaper === "hotel1" ? comparison.hotel1.name : comparison.hotel2.name;
      context += isArabic
        ? `\n💡 الأرخص: ${cheaper} (فرق ${comparison.differences.price_diff_egp?.toLocaleString()} جنيه)\n`
        : `\n💡 Cheaper: ${cheaper} (diff ${comparison.differences.price_diff_egp?.toLocaleString()} EGP)\n`;
    }
  }

  // الفنادق المطابقة مع تفاصيل كاملة
  const hotels = searchHotels({ destination, budget, language, maxResults: 2 });
  if (hotels.length > 0) {
    context += isArabic 
      ? `\n🏨 الفنادق المتاحة مع التفاصيل:\n`
      : `\n🏨 Available Hotels with Details:\n`;
    
    hotels.forEach((hotel, index) => {
      const formatted = formatHotelForDisplay(hotel, language);
      context += `\n${index + 1}. ${formatted.name} ${"⭐".repeat(hotel.stars)}\n`;
      context += `   📍 المنطقة: ${hotel.area}\n`;
      context += `   🛏️ ${formatted.room_type}\n`;
      context += `   💰 ${formatted.price_egp} جنيه / $${formatted.price_usd}\n`;
      
      // معلومات إضافية إن وجدت
      if (hotel.valid_from && hotel.valid_to) {
        context += `   📅 متاح من ${hotel.valid_from} إلى ${hotel.valid_to}\n`;
      }
      
      if (hotel.prices_egp) {
        context += isArabic ? `   💳 الأسعار:\n` : `   💳 Prices:\n`;
        if (hotel.prices_egp.single) context += `      • فردي: ${hotel.prices_egp.single?.toLocaleString()} جنيه\n`;
        if (hotel.prices_egp.double) context += `      • مزدوج: ${hotel.prices_egp.double?.toLocaleString()} جنيه\n`;
        if (hotel.prices_egp.triple) context += `      • ثلاثي: ${hotel.prices_egp.triple?.toLocaleString()} جنيه\n`;
      }
    });
  }

  // FAQs ذات الصلة
  const faqs = searchFAQs(userAnalysis.originalMessage, language);
  if (faqs.length > 0) {
    context += isArabic
      ? `\n❓ أسئلة شائعة مفيدة:\n`
      : `\n❓ Helpful FAQs:\n`;
    
    faqs.slice(0, 2).forEach((faq, index) => {
      context += `\n${index + 1}. ${faq.question}\n   ✔️ ${faq.answer}\n`;
    });
  }

  return {
    context,
    hotels,
    destInfo: destination ? getDestinationInfo(destination, language) : null,
    faqs,
    comparison: (intent === "compare_hotels" && hotelNames && hotelNames.length >= 2) 
      ? compareHotels(hotelNames[0], hotelNames[1], language) 
      : null
  };
}

/**
 * البحث عن صفحة مناسبة بناءً على الرسالة
 * Find appropriate page based on message
 */
export function findMatchingPage(message, language = "ar") {
  const msg = message.toLowerCase();
  const isArabic = language === "ar";
  
  // البحث في كل صفحة
  for (const [key, pageInfo] of Object.entries(SITE_PAGES)) {
    if (key === "destinations") continue; // تخطي الوجهات
    
    const keywords = isArabic ? pageInfo.keywords_ar : pageInfo.keywords_en;
    const name = isArabic ? pageInfo.name_ar : pageInfo.name_en;
    
    // تحقق من الكلمات المفتاحية
    for (const keyword of keywords) {
      if (msg.includes(keyword.toLowerCase())) {
        return {
          page: key,
          url: pageInfo.url,
          name: name,
          description: isArabic ? pageInfo.desc_ar : pageInfo.desc_en,
          confidence: 0.9
        };
      }
    }
  }
  
  return null;
}

/**
 * الحصول على جميع الصفحات المتاحة
 * Get all available pages
 */
export function getAllPages(language = "ar") {
  const isArabic = language === "ar";
  const pages = [];
  
  for (const [key, pageInfo] of Object.entries(SITE_PAGES)) {
    if (key === "destinations") continue;
    
    pages.push({
      key,
      url: pageInfo.url,
      name: isArabic ? pageInfo.name_ar : pageInfo.name_en,
      description: isArabic ? pageInfo.desc_ar : pageInfo.desc_en
    });
  }
  
  return pages;
}

/**
 * الحصول على روابط مناسبة حسب النية
 * Get relevant page links based on intent
 */
export function getSuggestedPages(userAnalysis, language = "ar") {
  const { intent, destination, originalMessage } = userAnalysis;
  const isArabic = language === "ar";
  const links = [];

  // إذا كان يبحث عن صفحة معينة
  if (intent === "navigate_page") {
    const matchedPage = findMatchingPage(originalMessage, language);
    if (matchedPage) {
      links.push({
        url: matchedPage.url,
        text: matchedPage.name,
        description: matchedPage.description,
        icon: "🔗",
        isPrimary: true
      });
      return links; // رجع الصفحة المطلوبة فقط
    }
  }

  // حسب النية
  if (intent === "search_hotels" || intent === "book_hotel") {
    links.push({
      url: SITE_PAGES.hotels.url,
      text: SITE_PAGES.hotels[isArabic ? "name_ar" : "name_en"],
      description: SITE_PAGES.hotels[isArabic ? "desc_ar" : "desc_en"],
      icon: "🏨"
    });
  }

  if (intent === "search_destination" || intent === "get_info" || intent === "general_inquiry") {
    links.push({
      url: SITE_PAGES.tours.url,
      text: SITE_PAGES.tours[isArabic ? "name_ar" : "name_en"],
      description: SITE_PAGES.tours[isArabic ? "desc_ar" : "desc_en"],
      icon: "🌍"
    });
  }

  if (intent === "book_trip" || intent === "request_quote" || intent === "recommendation_request") {
    links.push({
      url: SITE_PAGES.createTrip.url,
      text: SITE_PAGES.createTrip[isArabic ? "name_ar" : "name_en"],
      description: SITE_PAGES.createTrip[isArabic ? "desc_ar" : "desc_en"],
      icon: "✈️"
    });
  }

  if (intent === "price_inquiry" || intent === "budget_query") {
    links.push({
      url: SITE_PAGES.offers.url,
      text: SITE_PAGES.offers[isArabic ? "name_ar" : "name_en"],
      description: SITE_PAGES.offers[isArabic ? "desc_ar" : "desc_en"],
      icon: "🎁"
    });
  }

  if (intent === "help_request") {
    links.push({
      url: SITE_PAGES.contact.url,
      text: SITE_PAGES.contact[isArabic ? "name_ar" : "name_en"],
      description: SITE_PAGES.contact[isArabic ? "desc_ar" : "desc_en"],
      icon: "📞"
    });
    links.push({
      url: SITE_PAGES.faq.url,
      text: SITE_PAGES.faq[isArabic ? "name_ar" : "name_en"],
      description: SITE_PAGES.faq[isArabic ? "desc_ar" : "desc_en"],
      icon: "❓"
    });
  }

  // إضافة رابط الوجهة إذا كانت محددة
  if (destination && SITE_PAGES.destinations[destination]) {
    const destName = ALL_DESTINATIONS[destination]?.location || destination;
    links.push({
      url: SITE_PAGES.destinations[destination],
      text: isArabic ? `رحلات ${destName}` : `${destName} Tours`,
      description: isArabic ? `تفاصيل الرحلات إلى ${destName}` : `Trip details to ${destName}`,
      icon: "📍"
    });
  }

  return links.slice(0, 3); // أقصى 3 روابط
}

/**
 * ===================================
 * دوال جديدة للمعلومات الشاملة
 * New functions for comprehensive information
 * ===================================
 */

/**
 * الحصول على معلومات الشركة
 * Get company information
 */
export function getCompanyInfo(language = "ar") {
  const isArabic = language === "ar";
  return {
    name: COMPANY_INFO.name[language],
    established: COMPANY_INFO.established,
    description: COMPANY_INFO.description[language],
    contact: COMPANY_INFO.contact,
    workingHours: COMPANY_INFO.workingHours[language],
    socialMedia: COMPANY_INFO.socialMedia
  };
}

/**
 * الحصول على جميع الخدمات
 * Get all services
 */
export function getAllServices(language = "ar") {
  const isArabic = language === "ar";
  const services = [];
  
  for (const [key, service] of Object.entries(SERVICES)) {
    services.push({
      id: key,
      name: service.name[language],
      description: service.description[language],
      features: service.features?.[language] || [],
      destinations: service.destinations || null,
      countries: service.countries?.[language] || null,
      types: service.types?.[language] || null
    });
  }
  
  return services;
}

/**
 * الحصول على خدمة معينة
 * Get specific service
 */
export function getServiceInfo(serviceKey, language = "ar") {
  const service = SERVICES[serviceKey];
  if (!service) return null;
  
  return {
    name: service.name[language],
    description: service.description[language],
    features: service.features?.[language] || [],
    destinations: service.destinations || null,
    countries: service.countries?.[language] || null,
    types: service.types?.[language] || null
  };
}

/**
 * الحصول على سياسات الحجز والإلغاء
 * Get booking and cancellation policies
 */
export function getPolicies(language = "ar") {
  return {
    booking: POLICIES.booking[language],
    cancellation: POLICIES.cancellation[language],
    paymentMethods: POLICIES.payment.methods[language]
  };
}

/**
 * الحصول على العروض الحالية
 * Get current offers
 */
export function getCurrentOffers(language = "ar") {
  return CURRENT_OFFERS[language];
}

/**
 * البحث الشامل في كل البيانات
 * Comprehensive search across all data
 */
export function comprehensiveSearch(query, language = "ar") {
  const isArabic = language === "ar";
  const results = {
    hotels: [],
    destinations: [],
    services: [],
    faqs: [],
    pages: []
  };
  
  const queryLower = query.toLowerCase();
  
  // البحث في الفنادق
  results.hotels = searchHotels({ language, maxResults: 5 }).filter(hotel => {
    const name = isArabic ? hotel.hotel_name_ar : hotel.hotel_name_en;
    return name?.toLowerCase().includes(queryLower) || 
           hotel.area?.toLowerCase().includes(queryLower);
  });
  
  // البحث في الوجهات
  results.destinations = getAllDestinations().filter(dest => 
    dest.name?.toLowerCase().includes(queryLower)
  );
  
  // البحث في الخدمات
  results.services = getAllServices(language).filter(service =>
    service.name?.toLowerCase().includes(queryLower) ||
    service.description?.toLowerCase().includes(queryLower)
  );
  
  // البحث في الأسئلة الشائعة
  results.faqs = searchFAQs(query, language);
  
  // البحث في الصفحات
  const matchedPage = findMatchingPage(query, language);
  if (matchedPage) {
    results.pages.push(matchedPage);
  }
  
  return results;
}

/**
 * الحصول على معلومات شاملة للبوت
 * Get comprehensive info for chatbot context
 */
export function getChatbotKnowledgeBase(language = "ar") {
  const isArabic = language === "ar";
  
  return {
    company: getCompanyInfo(language),
    services: getAllServices(language),
    destinations: getAllDestinations(),
    policies: getPolicies(language),
    offers: getCurrentOffers(language),
    pages: getAllPages(language),
    totalHotels: Object.values(ALL_DESTINATIONS).reduce((sum, dest) => sum + (dest.hotels?.length || 0), 0),
    supportedLanguages: ["ar", "en"]
  };
}

export { SITE_PAGES, COMPANY_INFO, SERVICES, POLICIES, CURRENT_OFFERS };
