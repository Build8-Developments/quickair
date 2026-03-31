import {
  analyzeUserMessage,
  buildRAGContext,
  isOutOfScope,
  getSuggestedPages,
  findMatchingPage,
  getChatbotKnowledgeBase
} from "@/services/ragService";
import sessionManager from "@/services/sessionManager";
import { determineNextWidget, generateWidgetData, generateWidgetResponse, isValidWidget } from "@/services/widgetGenerator";

// OpenRouter Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * نظام محادثة ذكي مع RAG لـ QuickAir
 * Smart Chatbot with RAG for QuickAir
 * 
 * ❗ NO HALLUCINATIONS - Only real data from database
 */

// Generate smart quick options based on context and intent
function generateQuickOptions(userAnalysis, language, reply) {
  const isArabic = language === "ar";

  // For greetings - show main action buttons
  if (userAnalysis.intent === "greeting") {
    return [
      { label: isArabic ? "🚀 ابدأ مغامرتك" : "🚀 Start Your Adventure", value: isArabic ? "عايز احجز رحلة" : "I want to book a trip", autoSend: true },
      { label: isArabic ? "🔥 عروض حصرية" : "🔥 Exclusive Deals", value: isArabic ? "ايه العروض المتاحة؟" : "What offers are available?", autoSend: true },
      { label: isArabic ? "🏨 فنادق مميزة" : "🏨 Premium Hotels", value: isArabic ? "عايز اشوف الفنادق" : "Show me hotels", autoSend: true },
      { label: isArabic ? "💬 تواصل معنا" : "💬 Contact Us", value: isArabic ? "عايز اتواصل معاكم" : "I want to contact you", autoSend: true },
    ];
  }

  // If asking about destination, show popular destinations
  if (!userAnalysis.destination && (reply.includes("وجهة") || reply.includes("destination") || reply.includes("where"))) {
    return [
      { label: isArabic ? "🌴 بالي — جنة الآلهة" : "🌴 Bali — Island Paradise", value: isArabic ? "بالي" : "Bali", autoSend: true },
      { label: isArabic ? "🕌 إسطنبول — سحر الشرق" : "🕌 Istanbul — Eastern Magic", value: isArabic ? "إسطنبول" : "Istanbul", autoSend: true },
      { label: isArabic ? "🏖️ شرم — جوهرة البحر الأحمر" : "🏖️ Sharm — Red Sea Gem", value: isArabic ? "شرم الشيخ" : "Sharm El Sheikh", autoSend: true },
      { label: isArabic ? "🇱🇧 بيروت — باريس الشرق" : "🇱🇧 Beirut — Paris of East", value: isArabic ? "بيروت" : "Beirut", autoSend: true },
    ];
  }

  // If destination is set but no travelers count
  if (userAnalysis.destination && (reply.includes("مسافر") || reply.includes("traveler") || reply.includes("how many"))) {
    return [
      { label: isArabic ? "🧑 مغامر منفرد" : "🧑 Solo Adventurer", value: "1", autoSend: true },
      { label: isArabic ? "💑 ثنائي رومانسي" : "💑 Romantic Duo", value: "2", autoSend: true },
      { label: isArabic ? "👨‍👩‍👧‍👦 عائلة سعيدة" : "👨‍👩‍👧‍👦 Happy Family (4)", value: "4", autoSend: true },
      { label: isArabic ? "👥 مجموعة أصدقاء" : "👥 Friends Group (6+)", value: "6", autoSend: true },
    ];
  }

  // If asking about duration
  if (reply.includes("مدة") || reply.includes("duration") || reply.includes("how long") || reply.includes("ليال")) {
    return [
      { label: isArabic ? "⚡ 3 ليالي — سريعة" : "⚡ 3 Nights — Quick", value: isArabic ? "3 ليالي" : "3 nights", autoSend: true },
      { label: isArabic ? "✨ 5 ليالي — مثالية" : "✨ 5 Nights — Perfect", value: isArabic ? "5 ليالي" : "5 nights", autoSend: true },
      { label: isArabic ? "🌟 7 ليالي — فاخرة" : "🌟 7 Nights — Luxury", value: isArabic ? "7 ليالي" : "7 nights", autoSend: true },
      { label: isArabic ? "👑 10 ليالي — ملكية" : "👑 10 Nights — Royal", value: isArabic ? "10 ليالي" : "10 nights", autoSend: true },
    ];
  }

  // If asking about budget
  if (reply.includes("ميزانية") || reply.includes("budget") || reply.includes("بادج")) {
    return [
      { label: isArabic ? "💚 اقتصادي — قيمة ممتازة" : "💚 Budget — Great Value", value: isArabic ? "اقتصادي" : "budget friendly", autoSend: true },
      { label: isArabic ? "💙 متوسط — الأكثر شعبية" : "💙 Mid-range — Most Popular", value: isArabic ? "متوسط" : "mid-range", autoSend: true },
      { label: isArabic ? "💜 فاخر — تجربة استثنائية" : "💜 Luxury — Exceptional", value: isArabic ? "فاخر" : "luxury", autoSend: true },
    ];
  }

  // If asking about visa or nationality
  if (reply.includes("جنسية") || reply.includes("nationality") || reply.includes("تأشيرة") || reply.includes("visa")) {
    return [
      { label: isArabic ? "🇪🇬 مصري" : "🇪🇬 Egyptian", value: isArabic ? "مصري" : "Egyptian", autoSend: true },
      { label: isArabic ? "🇸🇦 سعودي" : "🇸🇦 Saudi", value: isArabic ? "سعودي" : "Saudi", autoSend: true },
      { label: isArabic ? "🇦🇪 إماراتي" : "🇦🇪 Emirati", value: isArabic ? "إماراتي" : "Emirati", autoSend: true },
    ];
  }

  // Default: General helpful options
  if (userAnalysis.intent === "general" || userAnalysis.intent === "general_inquiry") {
    return [
      { label: isArabic ? "🚀 ابدأ رحلتك" : "🚀 Start Journey", value: isArabic ? "عايز احجز رحلة" : "I want to book a trip", autoSend: true },
      { label: isArabic ? "🎁 عروض مميزة" : "🎁 Special Offers", value: isArabic ? "ايه العروض؟" : "What offers do you have?", autoSend: true },
      { label: isArabic ? "💡 اقترح لي وجهة" : "💡 Suggest Destination", value: isArabic ? "اقترحلي وجهة" : "Suggest a destination", autoSend: true },
    ];
  }

  return null;
}

async function buildStrapiFallbackReply(userAnalysis, ragContext, language = "ar", message = "") {
  const isArabic = language === "ar";
  const normalized = (message || "").toLowerCase();
  const normalizedIntent = (userAnalysis?.intent || "").toLowerCase();

  const asksOffers = /عرض|عروض|offers?|deals?|discount/.test(normalized)
    || normalizedIntent.includes("offer")
    || normalizedIntent.includes("deal")
    || normalizedIntent.includes("discount");

  const asksHotels = /فندق|فنادق|hotels?|accommodation|stay/.test(normalized)
    || normalizedIntent.includes("hotel");

  if (asksOffers) {
    const knowledge = await getChatbotKnowledgeBase(isArabic ? "ar" : "en");
    const offers = knowledge?.offers || [];

    if (offers.length > 0) {
      const topOffers = offers.slice(0, 3);
      const lines = topOffers.map((offer, idx) => `${idx + 1}) ${offer.title} - ${offer.discount}`);

      return isArabic
        ? `العروض المتاحة حالياً من سترابي:\n${lines.join("\n")}\n\nلو تحب أفتح لك تفاصيل عرض معيّن اكتب رقمه أو اسم الوجهة.`
        : `Current available offers from Strapi:\n${lines.join("\n")}\n\nTell me the offer number or destination and I'll show details.`;
    }

    return isArabic
      ? "لا توجد عروض منشورة حالياً. جرب بعد قليل أو اسألني عن وجهة محددة."
      : "No published offers are currently available. Try again shortly or ask for a specific destination.";
  }

  if (asksHotels && ragContext?.hotels?.length > 0) {
    const topHotels = ragContext.hotels.slice(0, 3);
    const lines = topHotels.map((hotel, idx) => `${idx + 1}) ${hotel.name} - ${hotel.price_egp?.toLocaleString()} EGP`);

    return isArabic
      ? `دي أفضل الفنادق المتاحة الآن:\n${lines.join("\n")}\n\nاختار رقم الفندق اللي عايز تفاصيله.`
      : `Here are the best currently available hotels:\n${lines.join("\n")}\n\nChoose a hotel number to see more details.`;
  }

  if (ragContext?.destInfo) {
    const destinationName = ragContext.destInfo.location;
    return isArabic
      ? `ممتاز! لقيت بيانات محدثة عن ${destinationName} من سترابي. تحب أبدأ بالعروض ولا الفنادق؟`
      : `Great! I found fresh ${destinationName} data from Strapi. Do you want to start with offers or hotels?`;
  }

  return isArabic
    ? "أنا متصل حالياً ببيانات سترابي مباشرة. اكتب الوجهة أو قل: ايه العروض المتاحة؟"
    : "I'm currently connected to Strapi data directly. Type a destination or ask: what offers are available?";
}

// بناء السياق النظامي الكامل - Premium Travel Concierge Prompt
async function buildSystemPrompt(language = "ar") {
  const isArabic = language === "ar";

  const knowledge = await getChatbotKnowledgeBase(isArabic ? "ar" : "en");
  const services = knowledge.services;
  const policies = knowledge.policies;
  const offers = knowledge.offers;

  // Language names for the prompt
  const languageNames = {
    ar: "Arabic (العربية)",
    en: "English",
    fr: "French (Français)",
    de: "German (Deutsch)",
    es: "Spanish (Español)",
    it: "Italian (Italiano)",
    ru: "Russian (Русский)",
    zh: "Chinese (中文)",
    ja: "Japanese (日本語)",
    ko: "Korean (한국어)",
    pt: "Portuguese (Português)",
    tr: "Turkish (Türkçe)",
    hi: "Hindi (हिन्दी)",
    nl: "Dutch (Nederlands)",
    pl: "Polish (Polski)",
    th: "Thai (ไทย)",
  };

  const selectedLanguage = languageNames[language] || language;

  return `أنت "Quick" ✨ — مستشار السفر الأسطوري في كويك إير للسياحة. أنت مش مجرد بوت، أنت صديق المسافر وملهمه وحارس أحلامه. كل رحلة عندك هي قصة ملحمية جديدة.

⚡ اللغة: رد فقط بـ ${selectedLanguage}. كن طبيعي وسلس — لا تخلط اللغات أبداً.

🏢 من نحن:
كويك إير للسياحة — وكالة السفر الأعرق في مصر منذ 1986. 40 سنة من صناعة الذكريات الخالدة.
📞 اتصل/واتساب: 19102 | ✉️ 19102@quickair.travel
🕐 السبت-الخميس 9ص-9م، الجمعة 2م-9م | 📍 القاهرة، مصر

✈️ خدماتنا الأسطورية:
${services.map(s => `• ${s.name}: ${s.description}`).join('\n')}

🔥 عروض حصرية الآن:
${offers.map(o => `• ${o.title} — ${o.discount}`).join('\n')}

🌍 وجهاتنا السحرية:
🇪🇬 مصر: شرم الشيخ، الغردقة، دهب، العين السخنة، سهل حشيش
🌏 عالمية: بالي 🌴، إسطنبول 🕌، بيروت 🇱🇧، دبي 🏙️

💳 الدفع: ${policies.paymentMethods.join(' | ')}
📋 الإلغاء: ${policies.cancellation.slice(0, 2).join(' | ')}

🎭 شخصيتك الأسطورية:

1. 🔥 كن ملهماً ومبهراً — أنت تبيع أحلام، مش مجرد تذاكر!
   - استخدم لغة حية وصور شاعرية
   - "تخيل نفسك على شاطئ بالي والشمس بتغرب قدامك..."
   - "استيقظ على صوت الأمواج في شرم الشيخ..."
   - "اكتشف سحر إسطنبول بين التاريخ والحداثة..."

2. 💎 كن ذكياً وناصحاً — أنت خبير السفر الموثوق
   - اقرأ ما بين السطور وافهم احتياجات العميل الحقيقية
   - اقترح الوجهة المثالية بناءً على شخصيته وميزانيته
   - "لو بتدور على الهدوء والاسترخاء، دهب هي جنتك"
   - "عائلة؟ الغردقة فيها كل حاجة للكبار والصغار"

3. 💬 كن محاوراً طبيعياً — اتكلم واسأل قبل ما تبدأ الحجز
   - لو اليوزر سأل سؤال عام، رد عليه بشكل طبيعي
   - اسأل أسئلة ذكية عشان تفهم احتياجاته
   - "إيه نوع الإجازة اللي بتحلم بيها؟ استرخاء ولا مغامرة؟"
   - "بتفضل البحر ولا الجبال؟ الهدوء ولا الحركة؟"
   - "ميزانيتك تقريباً كام عشان أرشحلك الأنسب؟"
   - متبدأش الحجز إلا لما اليوزر يقول صراحة "عايز احجز" أو "يلا نبدأ"

4. ✨ كن مختصراً وقوياً — كل كلمة ليها وزن
   - رد في 2-3 جمل قصيرة ومؤثرة
   - كل جملة تحمل قيمة وإلهام
   - لا تكرر نفسك أو تطول

5. 🎯 كن استراتيجياً — وجه العميل بذكاء
   - اسأل سؤال واحد ذكي يقربك من فهم احتياجاته
   - لو سألك عن وجهة، اقترح ووضح ليه
   - لو سألك عن أسعار، اديله فكرة عامة واسأله عن تفاصيل أكتر

6. 🌟 كن أصيلاً ومميزاً — شخصيتك فريدة
   - استخدم 1-2 إيموجي بذكاء (مش كتير)
   - تكلم زي صاحب العميل المقرب
   - اضحك معاه، احلم معاه، خطط معاه

7. 💰 كن شفافاً — الأسعار بالجنيه والدولار
   - دايماً اعرض السعرين: EGP و USD
   - وضح القيمة مش السعر بس
   - "من 15,000 جنيه (480$) — 5 ليالي في جنة بالي مع إفطار يومي"

8. 🧠 كن واعياً — تذكر السياق
   - لا تسأل عن حاجة اتقالت قبل كده
   - ابني على المحادثة السابقة
   - كل رد يكمل اللي قبله

9. 🎨 كن مرناً — اتكيف مع العميل
   - رسمي لو هو رسمي، ودود لو هو ودود
   - شبابي لو شاب، محترم لو كبير
   - اقرأ الطاقة وطابقها

10. 🏆 كن صادقاً — الثقة أهم من البيع
    - لو مش عارف حاجة، قول بصراحة
    - "دي تفصيلة محتاج أتأكد منها، كلم 19102 هيفيدوك فوراً"
    - لا تخترع معلومات أبداً

11. 🚀 كن طموحاً — كل محادثة فرصة لتغيير حياة
    - أنت مش بتبيع رحلة، أنت بتصنع ذكرى
    - "الرحلة دي هتفضل معاك طول العمر"
    - "استثمر في نفسك، السفر أجمل استثمار"

🎬 أمثلة على ردودك الأسطورية:

❌ رد عادي: "عندنا فنادق كتير في شرم الشيخ"
✅ رد أسطوري: "شرم الشيخ؟ 🌊 جنة البحر الأحمر بتناديك! عندي ليك فنادق 5 نجوم على البحر مباشرة — استيقظ على الشعاب المرجانية كل يوم. ميزانيتك تقريباً كام؟"

❌ رد عادي: "ممكن تحجز رحلة لبالي"
✅ رد أسطوري: "بالي؟ 🌴 اختيار أسطوري! جزيرة الآلهة بتستناك — شواطئ فيروزية، معابد سحرية، وغروب يخطف الأنفاس. بتدور على استرخاء ولا مغامرة؟"

❌ رد عادي: "السعر 15000 جنيه"
✅ رد أسطوري: "من 15,000 جنيه (480$) — 5 ليالي في الجنة 🏝️ فندق 5 نجوم، إفطار يومي، وذكريات تدوم للأبد. عايز تشوف الفنادق المتاحة؟"

💬 أمثلة على المحادثة الطبيعية (قبل الحجز):

مثال 1 - سؤال عام:
👤 "عايز اروح مكان حلو"
🤖 "أهلاً بيك! 🌍 بتدور على إيه بالضبط؟ استرخاء على البحر، مغامرة في الجبال، ولا ثقافة وتاريخ؟ قولي وأنا هرشحلك الأنسب!"

مثال 2 - سؤال عن وجهة:
👤 "ايه رأيك في بالي؟"
🤖 "بالي؟ 🌴 واحدة من أجمل الوجهات في العالم! شواطئ خيالية، ثقافة غنية، وأكل أسطوري. مناسبة للعرسان، العائلات، والمغامرين. عايز تعرف الأسعار ولا عايز تحجز دلوقتي؟"

مثال 3 - سؤال عن أسعار:
👤 "كام رحلة شرم الشيخ؟"
🤖 "شرم الشيخ 🏖️ الأسعار بتبدأ من 8,000 جنيه (255$) لـ 3 ليالي في فندق 4 نجوم، وتوصل لـ 20,000 جنيه (640$) لـ 5 ليالي في منتجع 5 نجوم فاخر. كام شخص هتسافروا؟"

مثال 4 - جاهز للحجز:
👤 "عايز احجز رحلة"
🤖 "يلا بينا! 🚀 هبدأ معاك خطوة بخطوة ونظم رحلتك الأسطورية. أول حاجة، فين عايز تروح؟"
[هنا يبدأ الـ widget flow]

🚫 ممنوع منعاً باتاً:
- تخترع أسعار أو فنادق أو وجهات مش موجودة
- تكتب فقرات طويلة أو قوائم كتير
- ترد على أسئلة مالهاش علاقة بالسفر
- تكرر أسئلة اتسألت قبل كده
- تبقى زي البوتات العادية — كن أسطورياً!
- تبدأ الحجز (الـ widgets) إلا لما اليوزر يقول صراحة "عايز احجز" أو "يلا نبدأ"

⚠️ مهم جداً:
- لو اليوزر سأل سؤال عام عن السفر أو الوجهات أو الأسعار → رد عليه بشكل طبيعي واسأله أسئلة ذكية
- لو اليوزر قال صراحة "عايز احجز" أو "ابدأ الحجز" → هنا بس ابدأ الـ booking flow
- خليك محاور طبيعي، مش آلة حجز!

🎯 هدفك النهائي:
كل عميل يكلمك لازم يحس إنه:
1. اكتشف صديق جديد بيفهمه
2. لقى الخبير اللي كان بيدور عليه
3. حلمه بقى قريب وممكن
4. محظوظ إنه كلم كويك إير

أنت مش مجرد chatbot — أنت Quick، أسطورة السفر! 🚀✨`;
}

export async function POST(request) {
  let language = "ar"; // Default language

  try {
    const {
      message,
      language: userLanguage,
      conversationHistory,
      userInfo,
      tripData: clientTripData,
      sessionId,
      widgetSelection
    } = await request.json();
    language = userLanguage || "ar";

    // Handle message validation - message can be string or object from widget
    const messageText = typeof message === 'string' ? message : (message?.message || JSON.stringify(message));

    // Input validation
    if (!messageText || messageText.trim().length === 0) {
      return Response.json(
        { error: "Message is required", success: false },
        { status: 400 }
      );
    }

    // Sanitize and limit message length
    const sanitizedMessage = messageText.trim().slice(0, 2000);
    if (sanitizedMessage.length !== messageText.trim().length) {
      console.warn("[Chatbot] Message truncated from", messageText.length, "to 2000 chars");
    }

    const isArabic = language === "ar";

    // ✅ Session Management
    let session;
    if (sessionId) {
      session = sessionManager.getSession(sessionId) || sessionManager.createSession(sessionId, userInfo || {});
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      session = sessionManager.createSession(newSessionId, userInfo || {});
    }

    // Sync client-side tripData to server session
    if (clientTripData) {
      sessionManager.updateTripData(session.sessionId, clientTripData);
    }

    // Update session with widget selection
    if (widgetSelection) {
      sessionManager.updateTripData(session.sessionId, widgetSelection);
    }

    // Add message to session history
    sessionManager.addMessage(session.sessionId, { role: "user", content: sanitizedMessage });

    // ✅ Step 1: تحليل رسالة المستخدم
    const userAnalysis = analyzeUserMessage(sanitizedMessage, language);
    console.log("[Chatbot] User analysis:", {
      intent: userAnalysis.intent,
      destination: userAnalysis.destination,
      confidence: userAnalysis.confidence
    });

    // ✅ Step 2: فحص إذا كان السؤال خارج النطاق
    if (isOutOfScope(sanitizedMessage)) {
      const outOfScopeMessage = isArabic
        ? "أنا Quick ✨ — خبير السفر والمغامرات! أساعدك في حجز رحلات أسطورية، فنادق فاخرة، وتأشيرات سريعة.\n\n🌍 جاهز تبدأ مغامرتك؟"
        : "I'm Quick ✨ — your travel & adventure expert! I help with epic trips, luxury hotels, and fast visas.\n\n🌍 Ready to start your adventure?";

      return Response.json({
        reply: outOfScopeMessage,
        success: true,
        intent: "out_of_scope"
      });
    }

    // ✅ Step 3: بناء سياق RAG بالبيانات الحقيقية
    const ragContext = await buildRAGContext(userAnalysis, language);
    console.log("[Chatbot] RAG context built:", {
      hotelsFound: ragContext.hotels?.length || 0,
      faqsFound: ragContext.faqs?.length || 0,
      hasDestInfo: !!ragContext.destInfo
    });

    // ✅ Step 3.5: الحصول على الروابط المقترحة
    const suggestedPages = getSuggestedPages(userAnalysis, language);

    // ✅ Step 3.6: فحص إذا كان يطلب التوجيه لصفحة معينة
    // ⚠️ IMPORTANT: Check booking intent FIRST before navigation
    // لو اليوزر قال "رحلة" أو "عايز احجز"، ده booking مش navigation!
    
    let navigationAction = null;

    // البحث عن صفحة مطابقة - حتى لو الـ intent مختلف
    const matchedPage = findMatchingPage(sanitizedMessage, language);

    // تحقق من وجود كلمات التنقل الصريحة في الرسالة
    const hasExplicitNavigationIntent = /وديني|ودني|خدني|روح|افتح|ورني|اذهب|توجه|صفحة|صفحه|لا صفح|لا الصفح|take me|go to|open|navigate|page/i.test(sanitizedMessage);

    console.log("🔍 Navigation check:", { 
      sanitizedMessage, 
      matchedPage: matchedPage?.page, 
      hasExplicitNavigationIntent, 
      intent: userAnalysis.intent 
    });

    // ✅ إذا طلب صفحة معينة بشكل صريح (مش مجرد كلمة "رحلة")
    // Only navigate if user explicitly asks for navigation AND it's not a booking intent
    if (matchedPage && hasExplicitNavigationIntent) {
      // رد مع زرار للصفحة
      const navReply = isArabic
        ? `تفضل 👇`
        : `Here you go 👇`;

      // Add to session
      sessionManager.addMessage(session.sessionId, { role: "assistant", content: navReply });

      return Response.json({
        reply: navReply,
        success: true,
        navigation: null,
        suggestedPages: [{
          url: matchedPage.url,
          text: isArabic ? `اذهب لـ ${matchedPage.name}` : `Go to ${matchedPage.name}`,
          description: matchedPage.description,
          icon: "🔗",
          isPrimary: true
        }],
        widget: null,
        quickOptions: null,
        sessionId: session.sessionId,
        metadata: {
          intent: "navigate_page",
          page: matchedPage.page
        }
      });
    }

    let reply = "";

    // ✅ Step 4-7: LLM response if available, else deterministic Strapi fallback
    if (OPENROUTER_API_KEY) {
      const systemPrompt = await buildSystemPrompt(language);
      let enhancedPrompt = systemPrompt;

      if (ragContext.context && ragContext.context.trim()) {
        enhancedPrompt += `\n\n📊 Relevant Information:\n${ragContext.context}`;
      }

      if (ragContext.hotels && ragContext.hotels.length > 0) {
        const hotelSummary = isArabic
          ? `فنادق متاحة: ${ragContext.hotels.length}`
          : `Hotels available: ${ragContext.hotels.length}`;
        enhancedPrompt += `\n\n${hotelSummary}`;
      }

      const chatMessages = [{ role: "system", content: enhancedPrompt }];

      const recentHistory = (conversationHistory || [])
        .slice(-6)
        .filter((msg) => msg.role && msg.content);

      for (const msg of recentHistory) {
        const content = typeof msg.content === 'string'
          ? msg.content
          : (msg.content?.message || JSON.stringify(msg.content));

        chatMessages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: content
        });
      }

      chatMessages.push({ role: "user", content: sanitizedMessage });

      const MAX_RETRIES = 3;
      let openRouterResponse;
      let lastError;

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          openRouterResponse = await fetch(OPENROUTER_BASE_URL, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
              "HTTP-Referer": "https://quickair.com",
              "X-Title": "QuickAir Travel Assistant",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001",
              messages: chatMessages,
              max_tokens: 400,
              temperature: 0.7,
              top_p: 0.95,
            })
          });

          if (openRouterResponse.ok) {
            break;
          }

          lastError = `API error: ${openRouterResponse.status}`;
          console.warn(`[Chatbot] Attempt ${attempt} failed: ${lastError}`);

          if (attempt < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        } catch (fetchError) {
          lastError = fetchError.message;
          console.warn(`[Chatbot] Attempt ${attempt} fetch error: ${lastError}`);

          if (attempt < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }

      if (!openRouterResponse || !openRouterResponse.ok) {
        const errorData = openRouterResponse ? await openRouterResponse.text() : lastError;
        console.error("OpenRouter API error after retries:", errorData);
        reply = await buildStrapiFallbackReply(userAnalysis, ragContext, language, sanitizedMessage);
      } else {
        const responseData = await openRouterResponse.json();
        reply = responseData.choices?.[0]?.message?.content || "";
        reply = reply.trim();
      }
    } else {
      console.warn("[Chatbot] OPENROUTER_API_KEY missing. Using Strapi fallback reply.");
      reply = await buildStrapiFallbackReply(userAnalysis, ragContext, language, sanitizedMessage);
    }

    // ✅ Step 8: Add AI response to session
    sessionManager.addMessage(session.sessionId, { role: "assistant", content: reply });

    // ✅ Step 9: Determine and generate next widget
    // Only show our custom widgets - no AI-generated widgets
    const sessionData = sessionManager.getSession(session.sessionId);
    sessionData.conversationHistory = conversationHistory; // Pass conversation history for smart analysis

    const nextWidget = determineNextWidget(sessionData, { ...userAnalysis, originalMessage: sanitizedMessage });
    let widgetData = null;

    // ✅ Only generate widget if it's a valid type
    if (nextWidget && isValidWidget(nextWidget.type)) {
      // Enable booking mode if starting booking flow
      if (nextWidget.startBookingFlow) {
        sessionManager.enableBookingMode(session.sessionId);
      }

      // Pass widgetInfo for direct queries (like hotel search)
      widgetData = await generateWidgetData(nextWidget.type, sessionData, language, nextWidget);
      const widgetResponse = generateWidgetResponse(nextWidget, language);

      // Enhance reply with widget context if needed
      if (widgetResponse && !reply.includes(widgetResponse.substring(0, 20))) {
        reply = reply + "\n\n" + widgetResponse;
      }
    }

    // ✅ Step 10: Return response with widget
    return Response.json({
      reply,
      success: true,
      suggestedPages,
      navigation: navigationAction,
      quickOptions: widgetData ? null : generateQuickOptions(userAnalysis, language, reply),
      widget: widgetData, // Will be null if user is just chatting
      sessionId: session.sessionId,
      tripUpdate: widgetSelection || null,
      metadata: {
        intent: userAnalysis.intent,
        destination: userAnalysis.destination,
        hotels_found: ragContext.hotels?.length || 0,
        faqs_found: ragContext.faqs?.length || 0,
        links_suggested: suggestedPages.length,
        widget_type: nextWidget?.type || null,
        session_step: sessionData?.step,
        bookingMode: sessionData?.contextMemory?.bookingMode || false,
      },
    });
  } catch (error) {
    console.error("[Chatbot] API error:", error.message);
    console.error("[Chatbot] Error stack:", error.stack);

    const isArabic = language === "ar";

    // Provide more specific error messages
    let fallbackMessage;
    if (error.message?.includes("API")) {
      fallbackMessage = isArabic
        ? "⚡ لحظة واحدة! النظام بيعيد تنظيم نفسه... جرب تاني بعد ثانية 🚀"
        : "⚡ One moment! System is reorganizing... Try again in a second 🚀";
    } else {
      fallbackMessage = isArabic
        ? "🌟 حصل شيء غير متوقع، لكن ما تقلقش! جرب تاني وهنكمل المغامرة"
        : "🌟 Something unexpected happened, but don't worry! Try again and we'll continue the adventure";
    }

    return Response.json(
      {
        reply: fallbackMessage,
        success: true,
        error: error.message || "AI processing error",
        widget: null,
        quickOptions: null,
        suggestedPages: [],
      },
      { status: 200 }
    );
  }
}
