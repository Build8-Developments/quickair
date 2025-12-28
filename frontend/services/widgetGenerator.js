/**
 * Widget Generator Service
 * يولد الـ widgets المناسبة بناءً على السياق والخطوة الحالية
 * Generates appropriate widgets based on context and current step
 * 
 * ✅ Updated: Widgets only show when user explicitly wants to book/plan a trip
 */

import { searchHotels } from "./ragService";

/**
 * التحقق إذا كان اليوزر يريد حجز أو تخطيط رحلة
 * Check if user wants to book or plan a trip
 */
function isBookingIntent(intent, message = "") {
  const bookingIntents = [
    "book_hotel",
    "book_trip",
    "search_hotels",
    "recommendation_request",
    "budget_query",
    "general_inquiry"
  ];
  
  const bookingKeywords = [
    // Arabic - booking
    "حجز", "احجز", "عايز أحجز", "أريد حجز", "أبغى حجز",
    "رحلة", "عايز رحلة", "أريد رحلة", "خطط رحلة",
    "سافر", "عايز أسافر", "أريد السفر",
    "فندق", "عايز فندق", "أريد فندق",
    "باكج", "باقة", "عرض",
    // Arabic - positive responses (to continue booking flow)
    "اه", "أه", "آه", "ايوه", "أيوه", "نعم", "اوك", "أوك", "تمام", "ماشي", "يلا", "طيب", "حاضر",
    "موافق", "اكيد", "أكيد", "بالتأكيد", "يب", "يس",
    // English
    "book", "booking", "reserve", "reservation",
    "trip", "plan trip", "plan a trip",
    "travel", "want to travel",
    "hotel", "find hotel",
    "package", "deal",
    // English - positive responses
    "yes", "yeah", "yep", "ok", "okay", "sure", "alright", "let's go", "go ahead"
  ];
  
  // Check intent
  if (bookingIntents.includes(intent)) {
    return true;
  }
  
  // Check message keywords
  const msgLower = message.toLowerCase().trim();
  return bookingKeywords.some(keyword => msgLower.includes(keyword) || msgLower === keyword);
}

/**
 * تحديد الـ widget التالي المناسب
 * Determine next appropriate widget
 * 
 * ✅ Now only shows widgets when:
 * 1. User explicitly wants to book/plan a trip
 * 2. User is already in booking flow (has tripData)
 * 3. User responds positively to booking questions
 */
export function determineNextWidget(sessionData, userAnalysis) {
  if (!sessionData) {
    return null; // No widget for new sessions - let them chat first
  }
  
  const { tripData, contextMemory } = sessionData;
  const { intent, destination, travelers, budget, hotelNames, originalMessage } = userAnalysis || {};
  
  // Check if user is in booking mode
  const isInBookingFlow = contextMemory?.bookingMode === true;
  const wantsToBook = isBookingIntent(intent, originalMessage);
  const hasStartedBooking = tripData?.destination || tripData?.selectedHotel;
  
  // ✅ If user is already in booking flow, continue showing widgets
  if (isInBookingFlow || hasStartedBooking) {
    // Continue with booking flow
  }
  // ✅ If user wants to book, start the flow
  else if (wantsToBook) {
    // Start booking flow
  }
  // ❌ Otherwise, don't show widgets - let them chat
  else {
    return null;
  }
  
  // ✅ User wants to book or is in booking flow - show appropriate widget
  
  // 1. إذا لم تُحدد الوجهة بعد - Show destinations
  if (!tripData?.destination && !destination) {
    return {
      type: "destinations",
      reason: "destination_selection",
      startBookingFlow: true
    };
  }

  // 2. إذا حُددت الوجهة لكن لا توجد تواريخ
  if ((tripData?.destination || destination) && !tripData?.dates) {
    return {
      type: "dateRange",
      reason: "date_selection"
    };
  }

  // 3. إذا حُددت التواريخ لكن لا يوجد عدد مسافرين
  if (tripData?.dates && !tripData?.travelers) {
    return {
      type: "travelers",
      reason: "travelers_count"
    };
  }

  // 4. إذا حُدد عدد المسافرين لكن لا توجد ميزانية
  if (tripData?.travelers && !tripData?.budget) {
    return {
      type: "budget",
      reason: "budget_selection"
    };
  }

  // 5. إذا حُددت الميزانية - Show hotels
  if (tripData?.budget && !tripData?.selectedHotel) {
    return {
      type: "hotelCards",
      reason: "hotel_selection",
      data: { destination: tripData.destination?.id || tripData.destination || destination }
    };
  }

  // 6. إذا حُدد الفندق لكن لا يوجد نظام وجبات
  if (tripData?.selectedHotel && !tripData?.mealPlan) {
    return {
      type: "mealPlan",
      reason: "meal_plan_selection"
    };
  }

  // 7. إذا حُدد نظام الوجبات لكن لا يوجد نوع غرفة
  if (tripData?.mealPlan && !tripData?.roomType) {
    return {
      type: "roomType",
      reason: "room_type_selection"
    };
  }

  // 8. إذا اكتملت كل البيانات - Show summary
  if (tripData?.roomType) {
    return {
      type: "bookingSummary",
      reason: "booking_complete"
    };
  }

  // افتراضي: لا حاجة لـ widget - continue chatting
  return null;
}

/**
 * توليد بيانات الـ widget
 * Generate widget data
 */
export function generateWidgetData(widgetType, sessionData, language = "ar") {
  if (!widgetType) return null;
  
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
      const destId = tripData.destination?.id || tripData.destination;
      const hotels = searchHotels({
        destination: destId,
        budget: tripData.budget?.maxEGP,
        language,
        maxResults: 5
      });
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
 * Generate appropriate text response with widget
 */
export function generateWidgetResponse(widgetInfo, language = "ar") {
  if (!widgetInfo) return "";
  
  const isArabic = language === "ar";
  const { type, reason } = widgetInfo;

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
 * Check if we should show widget based on conversation context
 */
export function shouldShowWidget(sessionData, userAnalysis) {
  const widget = determineNextWidget(sessionData, userAnalysis);
  return widget !== null;
}
