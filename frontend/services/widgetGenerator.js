/**
 * Widget Generator Service
 * يولد الـ widgets المناسبة بناءً على السياق والخطوة الحالية
 * Generates appropriate widgets based on context and current step
 * 
 * ✅ Smart Intent Detection - يفهم نية اليوزر بذكاء
 * ✅ Only our custom widgets - no AI-generated widgets
 */

import { searchHotels } from "./ragService";

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
 * يفهم السياق والنية - يبدأ الـ flow لأي سؤال عن رحلات أو فنادق
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
  
  // 2. ✅ أي سؤال عن رحلات أو فنادق يبدأ الـ flow مباشرة
  const travelRelatedPatterns = [
    // رحلات وسفر - بأي صيغة
    /رحل/i, /سفر/i, /trip/i, /travel/i, /vacation/i, /holiday/i,
    /جول[ةه]/i, /tour/i, /journey/i,
    
    // فنادق وإقامة - بأي صيغة  
    /فندق/i, /فنادق/i, /hotel/i, /hotels/i,
    /إقام/i, /اقام/i, /accommodat/i, /stay/i, /room/i,
    /منتجع/i, /resort/i,
    
    // حجز - بأي صيغة
    /حج[زو]/i, /احج[زو]/i, /book/i, /reserv/i,
    
    // عروض وباقات
    /عرض/i, /عروض/i, /offer/i, /deal/i, /باق[ةه]/i, /package/i,
    /برنامج/i, /program/i,
    
    // أسعار وتكلفة
    /سعر/i, /اسعار/i, /price/i, /cost/i, /كام/i, /how much/i,
    /تكلف/i, /ميزاني/i, /budget/i, /cheap/i, /رخيص/i,
    
    // وجهات ومدن
    /وجه[ةه]/i, /destination/i, /مكان/i, /place/i,
    /بالي/i, /bali/i, /شرم/i, /sharm/i, /الغردق/i, /hurghada/i,
    /دهب/i, /dahab/i, /إسطنبول/i, /اسطنبول/i, /istanbul/i,
    /بيروت/i, /beirut/i, /لبنان/i, /lebanon/i,
    /تركيا/i, /turkey/i, /السخن/i, /sokhna/i,
    /دبي/i, /dubai/i, /المالديف/i, /maldives/i,
    /مصر/i, /egypt/i, /البحر/i, /sea/i, /beach/i, /شاطئ/i,
    
    // نية السفر العامة
    /عايز اروح/i, /عايز أروح/i, /أريد أذهب/i, /want to go/i,
    /نفسي اسافر/i, /أبي أسافر/i, /ابغى اسافر/i,
    /فين اروح/i, /وين أروح/i, /where.*go/i,
    /اقترح/i, /suggest/i, /recommend/i, /توصي/i,
    
    // أسئلة عامة عن السياحة
    /سياح/i, /tourism/i, /tourist/i,
    /اجاز[ةه]/i, /إجاز/i, /شهر عسل/i, /honeymoon/i,
    /عائل/i, /family/i, /أصحاب/i, /friends/i,
    
    // ردود إيجابية
    /^(اه|أه|آه|ايوه|نعم|اوك|تمام|ماشي|يلا|طيب|حاضر|موافق|اكيد)$/i,
    /^(yes|yeah|yep|ok|okay|sure|alright|go|let'?s)$/i,
  ];
  
  // ✅ لو أي pattern اتطابق، ابدأ الـ flow
  for (const pattern of travelRelatedPatterns) {
    if (pattern.test(msgLower)) {
      return {
        wantsToBook: true,
        confidence: 1.0,
        reason: "travel_related_query",
        matchedPattern: pattern.source
      };
    }
  }
  
  // 3. تحليل السياق من المحادثة السابقة
  const recentMessages = conversationHistory?.slice(-3) || [];
  const botAskedAboutBooking = recentMessages.some(m => 
    m.role === "assistant" && 
    (m.content?.includes("رحلة") || m.content?.includes("حجز") || 
     m.content?.includes("trip") || m.content?.includes("book") ||
     m.content?.includes("وجهة") || m.content?.includes("destination"))
  );
  
  if (botAskedAboutBooking && msgLower.length < 30) {
    return {
      wantsToBook: true,
      confidence: 0.8,
      reason: "responding_to_bot"
    };
  }
  
  return {
    wantsToBook: false,
    confidence: 0,
    reason: "no_travel_intent"
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
  if (/سعر|اسعار|كام|price|cost|how much|تكلف/i.test(msgLower)) {
    return "prices";
  }
  
  // سؤال عن وجهات
  if (/وجه|وين|فين|اروح|destination|where|go to/i.test(msgLower)) {
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
 * Determine next appropriate widget
 */
export function determineNextWidget(sessionData, userAnalysis) {
  if (!sessionData) {
    return null;
  }
  
  const { tripData, contextMemory, conversationHistory } = sessionData;
  const { intent, destination, originalMessage } = userAnalysis || {};
  
  // ✅ تحليل نوع السؤال أولاً
  const questionType = analyzeQuestionType(originalMessage);
  const mentionedDestination = extractDestinationFromMessage(originalMessage);
  
  // ✅ إذا سأل عن فنادق في وجهة معينة - اعرض الفنادق مباشرة
  if (questionType === "hotels" && mentionedDestination) {
    return {
      type: "hotelCards",
      reason: "direct_hotel_query",
      data: { destination: mentionedDestination },
      skipFlow: true
    };
  }
  
  // ✅ إذا سأل عن وجهات - اعرض الوجهات
  if (questionType === "destinations") {
    return {
      type: "destinations",
      reason: "destination_query",
      startBookingFlow: true
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
  
  // ✅ User wants to book - show appropriate widget based on flow
  
  // 1. الوجهة
  if (!tripData?.destination && !destination && !mentionedDestination) {
    return {
      type: "destinations",
      reason: "destination_selection",
      startBookingFlow: true
    };
  }

  // 2. التاريخ
  if ((tripData?.destination || destination || mentionedDestination) && !tripData?.dates) {
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
      data: { destination: tripData.destination?.id || tripData.destination || destination }
    };
  }

  return null;
}

/**
 * توليد بيانات الـ widget - فقط الـ widgets المسموح بها
 * Generate widget data - only allowed widgets
 */
export function generateWidgetData(widgetType, sessionData, language = "ar", widgetInfo = null) {
  // ✅ تأكد إن الـ widget من القائمة المسموح بها
  if (!widgetType || !ALLOWED_WIDGET_TYPES.includes(widgetType)) {
    return null;
  }
  
  const tripData = sessionData?.tripData || {};

  switch (widgetType) {
    case "destinations":
      return {
        type: "destinations",
        component: "DestinationsWidget",
        props: { language }
      };

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
      const destId = widgetInfo?.data?.destination || tripData.destination?.id || tripData.destination;
      console.log("[HotelCards] destId:", destId, "widgetInfo:", widgetInfo);
      
      if (!destId) {
        console.log("[HotelCards] No destination found!");
        return {
          type: "hotelCards",
          component: "HotelCardsWidget",
          props: { hotels: [], language }
        };
      }
      
      const hotels = searchHotels({
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
 * توليد رد نصي مناسب مع الـ widget
 */
export function generateWidgetResponse(widgetInfo, language = "ar") {
  if (!widgetInfo) return "";
  
  const isArabic = language === "ar";
  const { type } = widgetInfo;

  const responses = {
    destinations: {
      ar: "اختر وجهتك:",
      en: "Choose destination:"
    },
    dateRange: {
      ar: "متى تريد السفر؟ 🗓️",
      en: "When to travel? 🗓️"
    },
    travelers: {
      ar: "كم عدد المسافرين؟",
      en: "How many travelers?"
    },
    budget: {
      ar: "ما ميزانيتك؟",
      en: "Your budget?"
    },
    hotelCards: {
      ar: "اختر فندقك:",
      en: "Choose hotel:"
    },
    mealPlan: {
      ar: "نظام الوجبات:",
      en: "Meal plan:"
    },
    roomType: {
      ar: "نوع الغرفة:",
      en: "Room type:"
    },
    bookingSummary: {
      ar: "ملخص الحجز:",
      en: "Booking summary:"
    }
  };

  return responses[type]?.[isArabic ? "ar" : "en"] || "";
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
