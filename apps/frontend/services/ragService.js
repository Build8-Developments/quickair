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
 * خريطة صفحات الموقع
 * Site Pages Map
 */
const SITE_PAGES = {
  home: "/",
  tours: "/tours-list",
  hotels: "/hotels",
  offers: "/offers",
  createTrip: "/create-trip",
  contact: "/contact",
  about: "/about",
  faq: "/faq",
  terms: "/terms",
  
  // صفحات الوجهات
  destinations: {
    bali: "/tours/1", // مثال - يمكن تعديل الـ ID حسب البيانات الفعلية
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
 * 1️⃣ فهم اللغة الطبيعية - Extract Intent and Entities
 */
export function analyzeUserMessage(message, language = "ar") {
  const msg = message.toLowerCase();
  const isArabic = language === "ar";
  
  // تحليل النية (Intent)
  let intent = "general";
  
  if (
    msg.includes("حجز") || msg.includes("book") ||
    msg.includes("أريد") || msg.includes("want") ||
    msg.includes("عايز") || msg.includes("need")
  ) {
    intent = "booking";
  } else if (
    msg.includes("سعر") || msg.includes("price") ||
    msg.includes("كام") || msg.includes("cost") ||
    msg.includes("ميزانية") || msg.includes("budget")
  ) {
    intent = "pricing";
  } else if (
    msg.includes("فندق") || msg.includes("hotel") ||
    msg.includes("إقامة") || msg.includes("accommodation")
  ) {
    intent = "hotels";
  } else if (
    msg.includes("تأشيرة") || msg.includes("visa") ||
    msg.includes("فيزا")
  ) {
    intent = "visa";
  } else if (
    msg.includes("رحلة") || msg.includes("trip") ||
    msg.includes("جولة") || msg.includes("tour") ||
    msg.includes("سفر") || msg.includes("travel")
  ) {
    intent = "travel";
  } else if (
    msg.includes("مساعدة") || msg.includes("help") ||
    msg.includes("دعم") || msg.includes("support") ||
    msg.includes("مشكلة") || msg.includes("problem")
  ) {
    intent = "support";
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

  // استخراج الميزانية
  let budget = null;
  const budgetMatch = msg.match(/(\d+)\s*(دولار|dollar|جنيه|egp|usd)/i);
  if (budgetMatch) {
    budget = parseInt(budgetMatch[1]);
  }

  // استخراج عدد المسافرين
  let travelers = 1;
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

  return {
    intent,
    destination,
    budget,
    travelers,
    nights,
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
    maxResults = 5
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
  const travelKeywords = [
    "سفر", "رحلة", "فندق", "حجز", "طيران", "تأشيرة",
    "travel", "trip", "hotel", "booking", "flight", "visa",
    "بالي", "إسطنبول", "شرم", "الغردقة", "دهب", "بيروت",
    "bali", "istanbul", "sharm", "hurghada", "dahab", "beirut",
    "سعر", "price", "عرض", "offer"
  ];

  const hasKeyword = travelKeywords.some(keyword =>
    message.toLowerCase().includes(keyword)
  );

  return !hasKeyword;
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
 * 1️⃣1️⃣ معلومات التأشيرة
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
 * 1️⃣2️⃣ بناء السياق الكامل للـ AI
 */
export function buildRAGContext(userAnalysis, language = "ar") {
  const { intent, destination, budget, travelers } = userAnalysis;
  
  let context = "";
  const isArabic = language === "ar";

  // معلومات الوجهة
  if (destination) {
    const destInfo = getDestinationInfo(destination, language);
    if (destInfo) {
      context += isArabic 
        ? `\n📍 معلومات ${destInfo.location}:\n`
        : `\n📍 ${destInfo.location} Information:\n`;
      context += isArabic
        ? `- عدد الفنادق المتاحة: ${destInfo.hotels_count}\n`
        : `- Available hotels: ${destInfo.hotels_count}\n`;
      context += isArabic
        ? `- نطاق الأسعار: ${destInfo.price_range.min_usd}-${destInfo.price_range.max_usd} دولار\n`
        : `- Price range: $${destInfo.price_range.min_usd}-${destInfo.price_range.max_usd}\n`;
    }
  }

  // الفنادق المطابقة
  const hotels = searchHotels({ destination, budget, language, maxResults: 5 });
  if (hotels.length > 0) {
    context += isArabic 
      ? `\n🏨 الفنادق المتاحة:\n`
      : `\n🏨 Available Hotels:\n`;
    
    hotels.forEach((hotel, index) => {
      const formatted = formatHotelForDisplay(hotel, language);
      context += `${index + 1}. ${formatted.name} ${formatted.stars}\n`;
      context += `   ${formatted.room_type}\n`;
      context += `   ${formatted.price_egp} جنيه / $${formatted.price_usd}\n`;
    });
  }

  // FAQs ذات الصلة
  const faqs = searchFAQs(userAnalysis.originalMessage, language);
  if (faqs.length > 0) {
    context += isArabic
      ? `\n❓ أسئلة شائعة ذات صلة:\n`
      : `\n❓ Related FAQs:\n`;
    
    faqs.forEach((faq, index) => {
      context += `${index + 1}. ${faq.question}\n   ${faq.answer}\n\n`;
    });
  }

  return {
    context,
    hotels,
    destInfo: destination ? getDestinationInfo(destination, language) : null,
    faqs
  };
}

/**
 * الحصول على روابط مناسبة حسب النية
 * Get relevant page links based on intent
 */
export function getSuggestedPages(userAnalysis, language = "ar") {
  const { intent, destination } = userAnalysis;
  const isArabic = language === "ar";
  const links = [];

  // حسب النية
  if (intent === "search_hotels" || intent === "book_hotel") {
    links.push({
      url: SITE_PAGES.hotels,
      text: isArabic ? "تصفح جميع الفنادق" : "Browse All Hotels",
      icon: "🏨"
    });
  }

  if (intent === "search_destination" || intent === "get_info") {
    links.push({
      url: SITE_PAGES.tours,
      text: isArabic ? "استكشف جميع الوجهات" : "Explore All Destinations",
      icon: "🌍"
    });
  }

  if (intent === "book_trip" || intent === "request_quote") {
    links.push({
      url: SITE_PAGES.createTrip,
      text: isArabic ? "خطط رحلتك الآن" : "Plan Your Trip Now",
      icon: "✈️"
    });
  }

  if (intent === "check_offers") {
    links.push({
      url: SITE_PAGES.offers,
      text: isArabic ? "شاهد جميع العروض" : "View All Offers",
      icon: "🎁"
    });
  }

  if (intent === "contact" || intent === "support") {
    links.push({
      url: SITE_PAGES.contact,
      text: isArabic ? "تواصل معنا" : "Contact Us",
      icon: "📞"
    });
  }

  // إضافة رابط الوجهة إذا كانت محددة
  if (destination && SITE_PAGES.destinations[destination]) {
    links.push({
      url: SITE_PAGES.destinations[destination],
      text: isArabic ? `تفاصيل ${destination}` : `${destination} Details`,
      icon: "📍"
    });
  }

  // روابط عامة دائمًا
  links.push({
    url: SITE_PAGES.faq,
    text: isArabic ? "الأسئلة الشائعة" : "FAQs",
    icon: "❓"
  });

  return links;
}

export { SITE_PAGES };
