// Service to provide intelligent context to the AI assistant
import { destinations } from "@/data/destinations";
import { tourData, tourDataTwo, tourDataThree } from "@/data/tours";
import { faqCategories } from "@/data/faqData";

/**
 * Get comprehensive travel data context for AI
 */
export function getComprehensiveTravelContext(language = "en") {
  const isArabic = language === "ar";

  // Process destinations data
  const destinationsList = destinations
    .slice(0, 12)
    .map((d) => `- ${d.name} (${d.tourCount} tours available)`)
    .join("\n");

  // Process tours data
  const allTours = [...tourData, ...tourDataTwo, ...tourDataThree];
  const toursByLocation = {};
  allTours.forEach((tour) => {
    if (!toursByLocation[tour.location]) {
      toursByLocation[tour.location] = [];
    }
    toursByLocation[tour.location].push({
      title: tour.title,
      duration: tour.duration,
      price: tour.price,
      rating: tour.rating,
    });
  });

  // Get FAQ data in appropriate language
  const faqs = faqCategories[isArabic ? "ar" : "en"];
  const faqSummary = faqs
    .map((category) => {
      const questions = category.questions
        .slice(0, 3)
        .map((q) => `  - ${q.question}`)
        .join("\n");
      return `**${category.name}**:\n${questions}`;
    })
    .join("\n\n");

  return {
    destinations: destinationsList,
    tourLocations: Object.keys(toursByLocation),
    tourCount: allTours.length,
    faqSummary,
    allTours: allTours.slice(0, 20), // First 20 tours for reference
  };
}

/**
 * Build intelligent prompt for Gemini
 */
export function buildIntelligentPrompt(message, language = "en", context = null) {
  const isArabic = language === "ar";
  const travelData = context || getComprehensiveTravelContext(language);

  const systemPrompt = isArabic
    ? `أنت مساعد سفر ذكي لمنصة QuickAir. مهمتك مساعدة العملاء في:

## خدمات QuickAir:
✈️ **حجز الطيران** - رحلات محلية ودولية مع ضمان أفضل سعر
🏨 **حجز الفنادق** - فنادق موثوقة ومناسبة للعائلات
🕌 **الحج والعمرة** - برامج كاملة مع الإقامة والمرشدين والتأشيرات
📋 **التأشيرات** - سياحية وتجارية وعائلية مع معالجة عاجلة
✋ **خدمة Meet & Assist** - مساعدة VIP في المطار
🚌 **النقل البري** - رحلات للنويبع والعقبة والأردن والسعودية
🚐 **النقل الداخلي** - ميكروباصات وهاي إيس وأتوبيسات

## الوجهات المتاحة (${travelData.tourCount}+ جولة):
${travelData.destinations}

## أنواع الجولات:
- جولات المدن
- الجولات الثقافية
- جولات الشواطئ
- جولات الطعام
- جولات المغامرة
- جولات المتاحف
- الرحلات البحرية اليومية
- جولات المشي

## معلومات مهمة:
- إلغاء مجاني على حجوزات مختارة
- ضمان أفضل سعر
- دعم عملاء على مدار الساعة
- خصومات الحجز المبكر متاحة
- خصومات الحجز الجماعي

## الأسئلة الشائعة:
${travelData.faqSummary}

كن ودوداً ومحترفاً ومتحمساً للسفر. اطرح أسئلة توضيحية لفهم احتياجات العميل بشكل أفضل.`
    : `You are an intelligent travel assistant for QuickAir. Your mission is to help customers with:

## QuickAir Services:
✈️ **Flight Bookings** - Domestic and international with best price guarantee
🏨 **Hotel Reservations** - Verified, family-friendly accommodations
🕌 **Hajj & Umrah** - Complete packages with guides and visa assistance
📋 **Visa Services** - Tourist, business, family visas with urgent processing
✋ **Meet & Assist** - VIP airport assistance service
🚌 **Land Transport** - Trips to Nuweiba, Aqaba, Jordan, Saudi Arabia
🚐 **Internal Transport** - Minibuses, Hiace vans, and buses

## Available Destinations (${travelData.tourCount}+ tours):
${travelData.destinations}

## Tour Categories:
- City Tours
- Cultural Tours
- Beach Tours
- Food Tours
- Adventure Tours
- Museum Tours
- Day Cruises
- Hiking Tours

## Key Features:
- Free cancellation on select bookings
- Best price guarantee
- 24/7 customer support
- Early booking discounts available
- Group booking discounts

## Frequently Asked Questions:
${travelData.faqSummary}

Be friendly, professional, and enthusiastic about travel. Ask clarifying questions to understand the customer's needs better.`;

  return {
    systemPrompt,
    userMessage: message,
  };
}

/**
 * Search for relevant tours based on user query
 */
export function searchRelevantTours(query, limit = 5) {
  const allTours = [...tourData, ...tourDataTwo, ...tourDataThree];
  const queryLower = query.toLowerCase();

  // Simple relevance scoring
  const scoredTours = allTours.map((tour) => {
    let score = 0;

    if (tour.location?.toLowerCase().includes(queryLower)) score += 3;
    if (tour.title?.toLowerCase().includes(queryLower)) score += 2;
    if (tour.feature?.toLowerCase().includes(queryLower)) score += 1;

    return { tour, score };
  });

  return scoredTours
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.tour);
}

/**
 * Search for relevant FAQs based on user query
 */
export function searchRelevantFAQs(query, language = "en", limit = 3) {
  const isArabic = language === "ar";
  const faqs = faqCategories[isArabic ? "ar" : "en"];
  const queryLower = query.toLowerCase();

  const relevantFAQs = [];

  faqs.forEach((category) => {
    category.questions.forEach((q) => {
      if (
        q.question.toLowerCase().includes(queryLower) ||
        q.answer.toLowerCase().includes(queryLower)
      ) {
        relevantFAQs.push({
          category: category.name,
          question: q.question,
          answer: q.answer,
        });
      }
    });
  });

  return relevantFAQs.slice(0, limit);
}

/**
 * Get destination suggestions based on budget and preferences
 */
export function getDestinationSuggestions(budget, preferences = {}) {
  const allTours = [...tourData, ...tourDataTwo, ...tourDataThree];

  let filtered = allTours.filter((tour) => {
    if (budget && tour.price > budget) return false;
    if (preferences.feature && tour.feature !== preferences.feature) return false;
    return true;
  });

  // Group by location
  const byLocation = {};
  filtered.forEach((tour) => {
    if (!byLocation[tour.location]) {
      byLocation[tour.location] = {
        location: tour.location,
        tours: [],
        avgPrice: 0,
        minPrice: Infinity,
      };
    }
    byLocation[tour.location].tours.push(tour);
    byLocation[tour.location].minPrice = Math.min(
      byLocation[tour.location].minPrice,
      tour.price
    );
  });

  // Calculate averages and format
  return Object.values(byLocation)
    .map((loc) => {
      loc.avgPrice =
        loc.tours.reduce((sum, t) => sum + t.price, 0) / loc.tours.length;
      return loc;
    })
    .sort((a, b) => a.avgPrice - b.avgPrice)
    .slice(0, 5);
}
