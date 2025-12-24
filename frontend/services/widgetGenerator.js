/**
 * Widget Generator Service
 * يولد الـ widgets المناسبة بناءً على السياق والخطوة الحالية
 * Generates appropriate widgets based on context and current step
 */

import { searchHotels } from "./ragService";

/**
 * تحديد الـ widget التالي المناسب
 * Determine next appropriate widget
 */
export function determineNextWidget(sessionData, userAnalysis) {
  if (!sessionData || !sessionData.tripData) {
    return { type: "destinations", reason: "initial_state" };
  }
  
  const { tripData, currentStep } = sessionData;
  const { intent, destination, travelers, budget, hotelNames } = userAnalysis || {};

  // 1. إذا لم تُحدد الوجهة بعد
  if (!tripData.destination && (
    intent === "general_inquiry" ||
    intent === "greeting" ||
    !destination
  )) {
    return {
      type: "destinations",
      reason: "destination_selection"
    };
  }

  // 2. إذا حُددت الوجهة لكن لا توجد تواريخ
  if (tripData.destination && !tripData.startDate && 
      !intent.includes("price") && !intent.includes("hotel")) {
    return {
      type: "dateRange",
      reason: "date_selection"
    };
  }

  // 3. إذا حُددت التواريخ لكن لا يوجد عدد مسافرين
  if (tripData.startDate && !tripData.travelers) {
    return {
      type: "travelers",
      reason: "travelers_count"
    };
  }

  // 4. إذا حُدد عدد المسافرين لكن لا توجد ميزانية
  if (tripData.travelers && !tripData.budget && 
      intent !== "search_hotels") {
    return {
      type: "budget",
      reason: "budget_selection"
    };
  }

  // 5. إذا حُددت الميزانية أو طُلب البحث عن فنادق
  if ((tripData.budget || intent === "search_hotels") && !tripData.selectedHotel) {
    return {
      type: "hotelCards",
      reason: "hotel_selection",
      data: { destination: tripData.destination || destination }
    };
  }

  // 6. إذا حُدد الفندق لكن لا يوجد نظام وجبات
  if (tripData.selectedHotel && !tripData.mealPlan) {
    return {
      type: "mealPlan",
      reason: "meal_plan_selection"
    };
  }

  // 7. إذا حُدد نظام الوجبات لكن لا يوجد نوع غرفة
  if (tripData.mealPlan && !tripData.roomType) {
    return {
      type: "roomType",
      reason: "room_type_selection"
    };
  }

  // 8. إذا اكتملت كل البيانات
  if (tripData.roomType) {
    return {
      type: "bookingSummary",
      reason: "booking_complete"
    };
  }

  // افتراضي: لا حاجة لـ widget
  return null;
}

/**
 * توليد بيانات الـ widget
 * Generate widget data
 */
export function generateWidgetData(widgetType, sessionData, language = "ar") {
  const { tripData } = sessionData;

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
      const hotels = searchHotels({
        destination: tripData.destination,
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
          userInfo: sessionData.userInfo,
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
