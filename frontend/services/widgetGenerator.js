/**
 * Widget Generator Service
 * يولد الـ widgets المناسبة بناءً على السياق والخطوة الحالية
 * Generates appropriate widgets based on context and current step
 * 
 * ✅ Smart Intent Detection - يفهم نية اليوزر بذكاء
 * ✅ Only our custom widgets - no AI-generated widgets
 */

import { searchHotels } from "./ragService";
import { getAllLocations } from "@/lib/api/services/location";

function getFlagCodeFromCountry(country) {
  if (!country) return "eg"; // default to Egypt
  const c = country.toLowerCase();
  if (c.includes("مصر") || c.includes("egypt")) return "eg";
  if (c.includes("اندونيسيا") || c.includes("indonesia") || c.includes("بالي") || c.includes("bali")) return "id";
  if (c.includes("تركيا") || c.includes("turkey") || c.includes("إسطنبول") || c.includes("istanbul")) return "tr";
  if (c.includes("لبنان") || c.includes("lebanon") || c.includes("بيروت") || c.includes("beirut")) return "lb";
  if (c.includes("امارات") || c.includes("uae") || c.includes("dubai")) return "ae";
  if (c.includes("سعودية") || c.includes("saudi")) return "sa";
  if (c.includes("مالديف") || c.includes("maldives")) return "mv";
  if (c.includes("يونان") || c.includes("greece")) return "gr";
  if (c.includes("اسبانيا") || c.includes("spain") || c.includes("سبانيا")) return "es";
  if (c.includes("ايطاليا") || c.includes("italy")) return "it";
  if (c.includes("فرنسا") || c.includes("france")) return "fr";
  return "eg";
}

function normalizeDestinationId(value) {
  if (!value) return null;

  const raw = String(value).toLowerCase().trim();
  const normalized = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0600-\u06ff\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const map = {
    sharm: "sharm",
    "sharm el sheikh": "sharm",
    "sharm el-sheikh": "sharm",
    "شرم": "sharm",
    "شرم الشيخ": "sharm",
    hurghada: "hurghada",
    "الغردقة": "hurghada",
    "غردقة": "hurghada",
    dahab: "dahab",
    "دهب": "dahab",
    bali: "bali",
    "بالي": "bali",
    istanbul: "istanbul",
    "اسطنبول": "istanbul",
    "إسطنبول": "istanbul",
    "استانبول": "istanbul",
    beirut: "beirut",
    "بيروت": "beirut",
    ainsokhna: "ainsokhna",
    "ain sokhna": "ainsokhna",
    "عين السخنة": "ainsokhna",
    "العين السخنة": "ainsokhna",
    sokhna: "ainsokhna",
    sahlhashish: "sahlhashish",
    "sahl hasheesh": "sahlhashish",
    "سهل حشيش": "sahlhashish",
  };

  return map[normalized] || raw;
}

// قائمة الـ widgets المسموح بها فقط
const ALLOWED_WIDGET_TYPES = [
  "destinations",
  "dateRange",
  "travelers",
  "budget",
  "hotelCards",
  "mealPlan",
  "roomType",
  "bookingSummary"
];

/**
 * تحليل ذكي لنية اليوزر - Smart Intent Analysis
 * يفهم السياق والنية - بس يبدأ الـ flow لما اليوزر يكون جاهز فعلاً
 */
function analyzeBookingIntent(message = "", conversationContext = {}) {
  const msgLower = message.toLowerCase().trim();
  const { tripData, contextMemory, conversationHistory } = conversationContext;

  // 1. إذا اليوزر في وسط flow الحجز، أي رد إيجابي يكمل
  const isInBookingFlow = contextMemory?.bookingMode === true;
  const hasStartedBooking = tripData?.destination || tripData?.dates || tripData?.travelers;

  if (isInBookingFlow || hasStartedBooking) {
    // أي رد قصير أو إيجابي يعني موافقة
    if (msgLower.length < 20) {
      // ردود سلبية فقط توقف الـ flow
      const negativePatterns = [
        /^لا\b/, /^لأ/, /^مش عايز/, /^no\b/, /^nope/, /^cancel/, /^stop/,
        /الغ/, /وقف/, /خلاص/, /مش دلوقتي/, /بعدين/
      ];

      const isNegative = negativePatterns.some(p => p.test(msgLower));
      if (!isNegative) {
        return { wantsToBook: true, confidence: 0.9, reason: "continuing_flow" };
      }
    }
    return { wantsToBook: true, confidence: 0.8, reason: "in_booking_flow" };
  }

  // 2. ✅ نية حجز واضحة وصريحة فقط - مش أي سؤال عام
  const explicitBookingPatterns = [
    // حجز صريح
    /عايز احجز/i, /عاوز احجز/i, /ابغى احجز/i, /أبي احجز/i,
    /نفسي احجز/i, /محتاج احجز/i, /اريد احجز/i, /أريد أن أحجز/i,
    /want to book/i, /wanna book/i, /need to book/i, /i want book/i,
    /book.*trip/i, /book.*hotel/i, /make.*reservation/i,

    // بدء رحلة صريح
    /ابدأ.*رحل/i, /ابدا.*رحل/i, /start.*trip/i, /plan.*trip/i,
    /خطط.*رحل/i, /نظم.*رحل/i, /organize.*trip/i,

    // جاهز للحجز
    /جاهز.*احجز/i, /مستعد.*احجز/i, /ready.*book/i,
    /يلا.*نحجز/i, /هيا.*نحجز/i, /let'?s book/i,

    // ردود إيجابية بعد سؤال البوت مباشرة
    /^(اه|أه|آه|ايوه|نعم|اوك|تمام|ماشي|يلا|طيب|حاضر|موافق|اكيد)$/i,
    /^(yes|yeah|yep|ok|okay|sure|alright|go|let'?s)$/i,
  ];

  // ✅ لو في نية حجز صريحة، ابدأ الـ flow
  for (const pattern of explicitBookingPatterns) {
    if (pattern.test(msgLower)) {
      return {
        wantsToBook: true,
        confidence: 1.0,
        reason: "explicit_booking_intent",
        matchedPattern: pattern.source
      };
    }
  }

  // 3. تحليل السياق من المحادثة السابقة
  // لو البوت سأل سؤال مباشر عن الحجز واليوزر رد
  const recentMessages = conversationHistory?.slice(-2) || [];
  const lastBotMessage = recentMessages.find(m => m.role === "assistant");
  
  if (lastBotMessage) {
    const botAskedToBook = 
      /عايز تحجز|تبدأ.*رحل|جاهز.*تسافر|want.*book|ready.*travel|start.*journey/i.test(lastBotMessage.content);
    
    if (botAskedToBook && msgLower.length < 30) {
      // رد قصير بعد سؤال مباشر = موافقة
      const negativePatterns = [
        /^لا\b/, /^لأ/, /^مش/, /^no\b/, /^nope/, /بعدين/, /مش دلوقتي/
      ];
      
      const isNegative = negativePatterns.some(p => p.test(msgLower));
      if (!isNegative) {
        return {
          wantsToBook: true,
          confidence: 0.85,
          reason: "responding_to_booking_question"
        };
      }
    }
  }

  // 4. أسئلة عامة عن السفر = مش حجز، خليه يتكلم
  return {
    wantsToBook: false,
    confidence: 0,
    reason: "general_inquiry_let_bot_talk"
  };
}

/**
 * تحليل نوع السؤال - ما الذي يريده اليوزر بالضبط
 */
function analyzeQuestionType(message = "") {
  const msgLower = message.toLowerCase();

  // سؤال عن فنادق
  if (/فندق|فنادق|hotel|hotels|إقام|accommodat|احسن فندق|best hotel/i.test(msgLower)) {
    return "hotels";
  }

  // سؤال عن أسعار
  if (/سعر|اسعار|بك?ام|بكام|price|cost|how much|تكلف/i.test(msgLower)) {
    return "prices";
  }

  // سؤال عن العروض
  if (/عرض|عروض|خصم|تخفيض|خصومات|تخفيضات|بكدج|باكدج|باكج|offers?|deals?|discounts?/i.test(msgLower)) {
    return "offers";
  }

  // سؤال عن وجهات
  if (/وجه|وين|فين|أروح|اروح|أكمل|اكمل|مكان|أماكن|امكن|destination|where|go\s?to/i.test(msgLower)) {
    return "destinations";
  }

  return "general";
}

/**
 * استخراج الوجهة من الرسالة
 */
function extractDestinationFromMessage(message = "") {
  const msgLower = message.toLowerCase();

  const destinations = {
    // Bali
    "بالي": "bali",
    "bali": "bali",
    "اندونيسيا": "bali",
    "indonesia": "bali",

    // Sharm
    "شرم": "sharm",
    "sharm": "sharm",
    "شرم الشيخ": "sharm",

    // Hurghada
    "الغردق": "hurghada",
    "غردق": "hurghada",
    "hurghada": "hurghada",

    // Dahab
    "دهب": "dahab",
    "dahab": "dahab",

    // Istanbul
    "إسطنبول": "istanbul",
    "اسطنبول": "istanbul",
    "استانبول": "istanbul",
    "تركيا": "istanbul",
    "istanbul": "istanbul",
    "turkey": "istanbul",

    // Beirut / Lebanon
    "بيروت": "beirut",
    "beirut": "beirut",
    "لبنان": "beirut",
    "lebanon": "beirut",

    // Ain Sokhna
    "السخن": "ainsokhna",
    "العين السخنة": "ainsokhna",
    "عين السخنة": "ainsokhna",
    "سخنة": "ainsokhna",
    "sokhna": "ainsokhna",
    "ain sokhna": "ainsokhna",

    // Sahl Hasheesh
    "سهل حشيش": "sahlhashish",
    "حشيش": "sahlhashish",
    "hasheesh": "sahlhashish",
    "sahl": "sahlhashish"
  };

  for (const [keyword, id] of Object.entries(destinations)) {
    if (msgLower.includes(keyword.toLowerCase())) {
      return id;
    }
  }

  return null;
}

/**
 * تحديد الـ widget التالي المناسب
 * Smart widget flow that adapts to user behavior
 */
export function determineNextWidget(sessionData, userAnalysis) {
  if (!sessionData) {
    console.log("[WidgetGenerator] No session data");
    return null;
  }

  const { tripData, contextMemory, conversationHistory } = sessionData;
  const { intent, destination, originalMessage } = userAnalysis || {};

  console.log("[WidgetGenerator] Determining widget:", {
    tripData: Object.keys(tripData || {}).filter(k => tripData[k]),
    intent,
    destination,
    bookingMode: contextMemory?.bookingMode
  });

  // ✅ تحليل نوع السؤال أولاً
  const questionType = analyzeQuestionType(originalMessage);
  const mentionedDestination = extractDestinationFromMessage(originalMessage);

  // ✅ إذا سأل عن فنادق في وجهة معينة - اعرض الفنادق مباشرة (skip flow)
  if (questionType === "hotels" && mentionedDestination) {
    return {
      type: "hotelCards",
      reason: "direct_hotel_query",
      data: { destination: mentionedDestination },
      skipFlow: true
    };
  }

  // ✅ إذا سأل عن فنادق بدون تحديد وجهة - ابدأ باختيار الوجهة
  if (questionType === "hotels" && !mentionedDestination && !tripData?.destination) {
    return {
      type: "destinations",
      reason: "hotel_query_without_destination",
      startBookingFlow: true
    };
  }

  // ✅ إذا سأل عن أسعار في وجهة معينة - اعرض الفنادق (الأسعار في البطاقات)
  if (questionType === "prices" && mentionedDestination) {
    return {
      type: "hotelCards",
      reason: "price_query_with_destination",
      data: { destination: mentionedDestination },
      skipFlow: true
    };
  }

  // ✅ إذا سأل عن أسعار بدون وجهة - نبدأ بالوجهة أولاً
  if (questionType === "prices" && !mentionedDestination && !tripData?.destination) {
    return {
      type: "destinations",
      reason: "price_query_without_destination",
      startBookingFlow: true
    };
  }

  // ✅ إذا سأل عن وجهات واسعة (بدون تحديد) - اعرض ديسكفري
  if (questionType === "destinations" && !tripData?.destination && !mentionedDestination) {
    return {
      type: "destinations",
      reason: "destination_query",
      startBookingFlow: true
    };
  }

  // ✅ إذا ذكر وجهة وسأل عن الفنادق أو الأسعار أو قال "عايز فنادق"
  if ((questionType === "hotels" || questionType === "prices") || (intent === "search_hotel" || intent === "hotel_query") && mentionedDestination) {
    return {
      type: "hotelCards",
      reason: "hotel_query_with_destination",
      data: { destination: mentionedDestination },
      skipFlow: true
    };
  }

  // ✅ إذا اليوزر اختار فندق (من direct query أو من flow)، كمل من هناك
  if (tripData?.selectedHotel) {
    // 6. نظام الوجبات
    if (!tripData?.mealPlan) {
      return {
        type: "mealPlan",
        reason: "meal_plan_selection"
      };
    }

    // 7. نوع الغرفة
    if (!tripData?.roomType) {
      return {
        type: "roomType",
        reason: "room_type_selection"
      };
    }

    // 8. الملخص
    return {
      type: "bookingSummary",
      reason: "booking_complete"
    };
  }

  // تحليل ذكي للنية
  const intentAnalysis = analyzeBookingIntent(originalMessage, {
    tripData,
    contextMemory,
    conversationHistory
  });

  // إذا اليوزر مش عايز يحجز، مفيش widget
  if (!intentAnalysis.wantsToBook) {
    return null;
  }

  // ✅ User wants to book - smart flow based on what we already know

  // 1. الوجهة - skip if destination already mentioned
  const effectiveDestination = tripData?.destination || destination || mentionedDestination;
  if (!effectiveDestination) {
    return {
      type: "destinations",
      reason: "destination_selection",
      startBookingFlow: true
    };
  }

  // 2. التاريخ
  if (effectiveDestination && !tripData?.dates) {
    return {
      type: "dateRange",
      reason: "date_selection"
    };
  }

  // 3. عدد المسافرين
  if (tripData?.dates && !tripData?.travelers) {
    return {
      type: "travelers",
      reason: "travelers_count"
    };
  }

  // 4. الميزانية
  if (tripData?.travelers && !tripData?.budget) {
    return {
      type: "budget",
      reason: "budget_selection"
    };
  }

  // 5. الفنادق
  if (tripData?.budget && !tripData?.selectedHotel) {
    return {
      type: "hotelCards",
      reason: "hotel_selection",
      data: { destination: tripData.destination?.id || tripData.destination || destination || mentionedDestination }
    };
  }

  return null;
}

/**
 * توليد بيانات الـ widget - فقط الـ widgets المسموح بها
 * Generate widget data - only allowed widgets
 */
export async function generateWidgetData(widgetType, sessionData, language = "ar", widgetInfo = null) {
  // ✅ تأكد إن الـ widget من القائمة المسموح بها
  if (!widgetType || !ALLOWED_WIDGET_TYPES.includes(widgetType)) {
    return null;
  }

  const tripData = sessionData?.tripData || {};

  switch (widgetType) {
    case "destinations": {
      const isArabic = language === "ar";
      const locations = await getAllLocations({ locale: isArabic ? "ar" : "en", limit: 50 });
      
      const dynamicDestinations = locations.map(loc => {
        const country = loc.country?.toLowerCase() || "";
        const isDomestic = typeof country === "string" && (country.includes("مصر") || country.includes("egypt"));
        
        return {
          id: loc.slug,
          name: loc.name,
          category: isDomestic ? "domestic" : "international",
          flagCode: getFlagCodeFromCountry(country || loc.name) // fallback flag check on name
        };
      });

      return {
        type: "destinations",
        component: "DestinationsWidget",
        props: { language, dynamicDestinations }
      };
    }

    case "dateRange":
      return {
        type: "dateRange",
        component: "DateRangeWidget",
        props: { language }
      };

    case "travelers":
      return {
        type: "travelers",
        component: "TravelersWidget",
        props: { language }
      };

    case "budget":
      return {
        type: "budget",
        component: "BudgetWidget",
        props: { language }
      };

    case "hotelCards":
      // استخدم الوجهة من widgetInfo.data أو من tripData
      const rawDestId = widgetInfo?.data?.destination || tripData.destination?.id || tripData.destination;
      const destId = normalizeDestinationId(rawDestId);
      console.log("[HotelCards] destination:", { rawDestId, destId, widgetInfo });

      if (!destId) {
        console.log("[HotelCards] No destination found!");
        return {
          type: "hotelCards",
          component: "HotelCardsWidget",
          props: { hotels: [], language }
        };
      }

      const hotels = await searchHotels({
        destination: destId,
        budget: tripData.budget?.maxEGP,
        language,
        maxResults: 5
      });

      console.log("[HotelCards] Found hotels:", hotels.length);

      return {
        type: "hotelCards",
        component: "HotelCardsWidget",
        props: {
          hotels,
          language
        }
      };

    case "mealPlan":
      return {
        type: "mealPlan",
        component: "MealPlanWidget",
        props: { language }
      };

    case "roomType":
      return {
        type: "roomType",
        component: "RoomTypeWidget",
        props: { language }
      };

    case "bookingSummary":
      return {
        type: "bookingSummary",
        component: "BookingSummaryWidget",
        props: {
          bookingData: tripData,
          userInfo: sessionData?.userInfo,
          language
        }
      };

    default:
      return null;
  }
}

/**
 * توليد رد نصي مناسب مع الـ widget - ردود ملهمة وأسطورية
 */
export function generateWidgetResponse(widgetInfo, language = "ar") {
  if (!widgetInfo) return "";

  const isArabic = language === "ar";
  const { type } = widgetInfo;

  const responses = {
    destinations: {
      ar: "🌍 العالم كله قدامك! اختار وجهة أحلامك واستعد لمغامرة العمر 👇",
      en: "🌍 The world awaits! Pick your dream destination and get ready for the adventure of a lifetime 👇"
    },
    dateRange: {
      ar: "📅 امتى نبدأ المغامرة؟ اختار التواريخ المثالية لرحلتك الأسطورية ✨",
      en: "📅 When shall we begin the adventure? Choose the perfect dates for your epic journey ✨"
    },
    travelers: {
      ar: "👥 مين هيشاركك الذكريات الجميلة دي؟ حدد عدد المسافرين 🎒",
      en: "👥 Who's joining you on this beautiful journey? Tell me the number of travelers 🎒"
    },
    budget: {
      ar: "💎 كل ميزانية عندنا ليها سحرها الخاص! اختار المستوى اللي يناسبك وسيبنا نبهرك",
      en: "💎 Every budget has its own magic! Choose your level and let us amaze you"
    },
    hotelCards: {
      ar: "🏨 دول أفضل الفنادق اللي اخترناها ليك بعناية! كل واحد فيهم قصة نجاح 👇",
      en: "🏨 Here are the finest hotels we've handpicked for you! Each one is a success story 👇"
    },
    mealPlan: {
      ar: "🍽️ الأكل جزء من المتعة! اختار نظام الوجبات اللي يخليك مرتاح طول الرحلة",
      en: "🍽️ Food is part of the joy! Choose the meal plan that keeps you comfortable throughout"
    },
    roomType: {
      ar: "🛏️ راحتك أولوية! اختار نوع الغرفة اللي يناسب أحلامك",
      en: "🛏️ Your comfort is priority! Select the room type that matches your dreams"
    },
    bookingSummary: {
      ar: "🎉 تقريباً خلصنا! راجع تفاصيل رحلتك الأسطورية وأكد الحجز — المغامرة بدأت! ✨",
      en: "🎉 Almost there! Review your epic journey details and confirm — the adventure begins! ✨"
    }
  };

  // For all non-Arabic languages, use English widget response
  return responses[type]?.[language === "ar" ? "ar" : "en"] || "";
}

/**
 * التحقق من صحة الـ widget - يمنع أي widget غير مسموح به
 */
export function isValidWidget(widgetType) {
  return ALLOWED_WIDGET_TYPES.includes(widgetType);
}

/**
 * Check if we should show widget based on conversation context
 */
export function shouldShowWidget(sessionData, userAnalysis) {
  const widget = determineNextWidget(sessionData, userAnalysis);
  return widget !== null;
}
