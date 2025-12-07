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
  
  // صفحات الوجهات
  destinations: {
    bali: "/tours/1",
    istanbul: "/tours/2",
    sharm: "/tours/3",
    hurghada: "/tours/4",
    dahab: "/tours/5",
    beirut: "/tours/6",
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
    "بالي": "bali",
    "bali": "bali",
    "إسطنبول": "istanbul",
    "istanbul": "istanbul",
    "تركيا": "istanbul",
    "turkey": "istanbul",
    "شرم": "sharm",
    "sharm": "sharm",
    "الشيخ": "sharm",
    "sheikh": "sharm",
    "الغردقة": "hurghada",
    "hurghada": "hurghada",
    "دهب": "dahab",
    "dahab": "dahab",
    "بيروت": "beirut",
    "beirut": "beirut",
    "لبنان": "beirut",
    "lebanon": "beirut"
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
    budget,
    stars,
    language = "ar",
    maxResults = 3 // Changed from 5 to 3 for shorter responses
  } = filters;

  let results = [];

  // البحث في الوجهات
  const destData = destination ? [ALL_DESTINATIONS[destination]] : Object.values(ALL_DESTINATIONS);
  
  destData.forEach(dest => {
    if (!dest || !dest.hotels) return;

    dest.hotels.forEach(hotel => {
      // تطبيق الفلاتر
      if (budget && hotel.price_usd_reference > budget) return;
      if (stars && hotel.stars !== stars) return;

      results.push({
        ...hotel,
        destination: dest.location,
        includes: dest.includes[language],
        not_included: dest.not_included[language],
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

export { SITE_PAGES };
