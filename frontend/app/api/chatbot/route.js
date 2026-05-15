import {
  analyzeUserMessage,
  buildRAGContext,
  isOutOfScope,
  getSuggestedPages,
  findMatchingPage,
  getChatbotKnowledgeBase,
  getLivePriceSummaryForPrompt,
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
    const knowledge = await getChatbotKnowledgeBase(language);
    const offers = knowledge?.offers || [];

    if (offers.length > 0) {
      const topOffers = offers.slice(0, 3);
      const lines = topOffers.map((offer, idx) => `${idx + 1}) ${offer.title} - ${offer.discount}`);

      return isArabic
        ? `العروض المتاحة حالياً:\n${lines.join("\n")}\n\nلو تحب أفتح لك تفاصيل عرض معيّن اكتب رقمه أو اسم الوجهة.`
        : `Currently available offers:\n${lines.join("\n")}\n\nTell me the offer number or destination and I'll show details.`;
    }

    return isArabic
      ? "لا توجد عروض منشورة حالياً. جرب بعد قليل أو اسألني عن وجهة محددة."
      : "No published offers are currently available. Try again shortly or ask for a specific destination.";
  }

  if (asksHotels && ragContext?.hotels?.length > 0) {
    return isArabic
      ? "هعرضلك أفضل الفنادق المتاحة في الكروت تحت الرسالة — اختار الفندق اللي يناسبك."
      : "I'll show the best available hotels in the cards below — pick the one you like.";
  }

  if (ragContext?.destInfo) {
    const destinationName = ragContext.destInfo.location;
    return isArabic
      ? `ممتاز! لقيت بيانات محدثة عن ${destinationName}. تحب أبدأ بالعروض ولا الفنادق؟`
      : `Great! I found fresh ${destinationName} data. Do you want to start with offers or hotels?`;
  }

  return isArabic
    ? "أنا متصل حالياً ببيانات محدثة مباشرة. اكتب الوجهة أو قل: ايه العروض المتاحة؟"
    : "I'm currently connected to live updated data. Type a destination or ask: what offers are available?";
}

// بناء السياق النظامي الكامل
async function buildSystemPrompt(language = "ar") {
  const isArabic = language === "ar";

  const knowledge = await getChatbotKnowledgeBase(language);
  const services = knowledge.services;
  const policies = knowledge.policies;
  const offers = knowledge.offers;
  const livePrices = await getLivePriceSummaryForPrompt(language);

  // Language names for the prompt
  const languageNames = {
    ar: "Egyptian Arabic (العامية المصرية)",
    en: "English",
  };
  const selectedLanguage = languageNames[language] || language;

  if (isArabic) {
    return `أنت "Quick" وكيل السفر الذكي لشركة كويك إير للسياحة (تأسست 1986 في مصر).
هدفك أن تتصرف كوكيل سفر حقيقي: تفهم طلب العميل، تراجع البيانات المتاحة، تقارن الخيارات، وتقترح الخطوة التالية بوضوح.

⚡ القاعدة الذهبية الأولى: يجب أن تتحدث بالعامية المصرية فقط بوضوح وطبيعية تامة. لا تخلط عربي وإنجليزي أبداً.

🏢 معلومات التواصل معنا:
- رقم مختصر / واتساب: 19102
- الإيميل: 19102@quickair.travel
- المواعيد: السبت للخميس (9ص - 9م)، الجمعة (2م - 9م).

✈️ خدماتنا الرئيسية:
${services.map(s => `• ${s.name}: ${s.description}`).join('\n')}

🔥 أقوى العروض الحالية:
${offers.map(o => `• ${o.title} — ${o.discount}`).join('\n')}

🌍 الوجهات المتاحة حالياً:
🇪🇬 مصر: شرم الشيخ، الغردقة، دهب، العين السخنة، سهل حشيش.
🌏 عالمية: بالي، إسطنبول، بيروت.

💳 الدفع: ${policies.paymentMethods.join(' | ')}
📋 الإلغاء: ${policies.cancellation.slice(0, 2).join(' | ')}

${livePrices ? `📊 أسعار رسمية من النظام (Strapi) — المصدر الوحيد المسموح للأرقام:\n${livePrices}\n` : "📊 لا تتوفر أسعار محدثة حالياً في السياق — لا تذكر أي رقم تقريبي.\n"}

🧠 شخصيتك وقواعدك:
1. تصرف كوكيل سفر وليس chatbot: لا تقل "كيف أساعدك؟" بشكل عام إذا كان الطلب واضحاً؛ حلل الطلب وابدأ في تضييق الاختيارات.
2. كن ذكياً وطبيعياً: رد بشكل مباشر على سؤال العميل ولا تستخدم نصوص إعلانية مبالغ فيها أو إيموجيز زائدة عن الحد.
3. تذكر السياق دائمًا: لا تسأل المستخدم عن معلومة قالها سابقاً (مثل عدد الأيام أو الميزانية).
4. كن مختصراً: أجب في جملتين أو ثلاث بالكثير. الاسترسال مزعج.
5. ⛔ الأسعار: ممنوع اختراع أو تقدير أي سعر. استخدم فقط الأرقام من قسم "أسعار رسمية من النظام" أو "Relevant Information" أدناه. لو مفيش رقم، قول إن السعر حسب التواريخ والفندق ووجّهه للكروت أو 19102.
6. ✅ الأسئلة العامة: إذا سأل عن معلومات فقط (مثل "ايه الفنادق في بالي؟" أو "بكام شرم؟")، أجب بالمعلومات بدون بدء عملية الحجز. لا تطلب تفاصيل الحجز إلا إذا قال صراحة "عايز أحجز".
7. احجز بذكاء: لا تبدأ بطلب البيانات فوراً إلا إذا قال صراحة "عايز أحجز" أو "تفاصيل رحلة لكذا"، حينها دعه يعرف أنك ستبدأ خطوات الحجز معه.
8. عند وجود وجهة أو طلب فنادق/عروض، استخدم لغة تنفيذية مثل: "براجع المتاح"، "هقارن الاختيارات"، "هعرضلك الأنسب" بدلاً من ردود عامة.
9. لا تعرض الفنادق والأسعار في شكل قوائم نصوص أبداً: العميل يشاهد "كروت تصميمية للفنادق" (Widgets) تظهر تحته تلقائياً وتتضمن الصور والأسعار والتفاصيل. بدلاً من سرد أسماء الفنادق بنص عادي، فقط استخدم جملة مشوقة مثل: "هعرضلك أفضل الاختيارات المتاحة بالصور والأسعار تحت الرسالة." واكتفِ بذلك.
10. الصدق 100%: لا تخترع فنادق غير موجودة.
11. ✅ روابط الفنادق: إذا كان الفندق موجود على الموقع، قل للعميل "تقدر تشوف تفاصيل أكتر على صفحة الفندق" وسيظهر له رابط تلقائياً.
12. الأسئلة العامة: إذا سأل عن معلومة عامة، أطرح أفكاراً جذابة باختصار. إذا أبدى اهتمام بالحجز، ابدأ الخطوات.
13. ⚠️ ممنوع منعاً باتاً خلط العربي والإنجليزي في نفس الرد. استخدم العامية المصرية فقط.

🎬 أمثلة على أسلوبك (بدون أرقام مخترعة):
- المستخدم: "بكام بالي؟"
  أنت: "[اذكر نطاق السعر من بيانات Strapi فقط إن وُجد] تحب أوريك الفنادق المتاحة بالأسعار تحت الرسالة؟"
- المستخدم: "عايز احجز رحلة"
  أنت: "ممتاز! هساعدك نرتب الرحلة خطوة بخطوة. فين الوجهة اللي بتفكر فيها؟"
- المستخدم: "ايه الفنادق في شرم؟"
  أنت: "شرم فيها فنادق من 3 لـ 5 نجوم. هعرضلك أفضل الخيارات بالصور والأسعار تحت الرسالة."
- المستخدم: "بكام العمرة؟"
  أنت: "[من أسعار Strapi للعمرة فقط] تحب أشوفلك الباقات على صفحة العمرة؟"

⚠️ تحذير شديد:
- لا تقم بكتابة جداول طويلة مملة.
- لا تكن كالإنسان الآلي الذي يعيد نفس الأسئلة.
- ركز على قراءة "Conversation History" المرفقة في الرسائل لفهم ما إذا كان المستخدم أجاب بالفعل على شيء مسبقاً.
- اجعل حديثك بسيطاً ومفيداً، أنت مساعد محترف، لست بائعاً مزعجاً.
- ⚠️ ممنوع تماماً استخدام كلمات إنجليزية في الرد العربي.`;
  } else {
    // English system prompt
    return `You are "Quick", the smart travel agent for Quick Air Tourism (established 1986 in Egypt).
Your goal is to act as a real travel agent: understand the client's request, review available data, compare options, and suggest the next step clearly.

⚡ GOLDEN RULE #1: You MUST speak in ${selectedLanguage} ONLY with clarity and natural flow. NEVER mix Arabic and English in the same response.

🏢 Contact Information:
- Short number / WhatsApp: 19102
- Email: 19102@quickair.travel
- Hours: Saturday-Thursday (9 AM - 9 PM), Friday (2 PM - 9 PM).

✈️ Our Main Services:
${services.map(s => `• ${s.name}: ${s.description}`).join('\n')}

🔥 Current Top Offers:
${offers.map(o => `• ${o.title} — ${o.discount}`).join('\n')}

🌍 Currently Available Destinations:
🇪🇬 Egypt: Sharm El Sheikh, Hurghada, Dahab, Ain Sokhna, Sahl Hasheesh.
🌏 International: Bali, Istanbul, Beirut.

💳 Payment: ${policies.paymentMethods.join(' | ')}
📋 Cancellation: ${policies.cancellation.slice(0, 2).join(' | ')}

${livePrices ? `📊 Official prices from system (Strapi) — ONLY allowed source for numbers:\n${livePrices}\n` : "📊 No updated prices in context — do NOT quote any approximate figure.\n"}

🧠 Your Personality and Rules:
1. Act as a travel agent, not a chatbot: Don't say "How can I help?" generically if the request is clear; analyze the request and start narrowing down choices.
2. Be smart and natural: Respond directly to the client's question without overly promotional text or excessive emojis.
3. Always remember context: Don't ask the user about information they already provided (like number of days or budget).
4. Be concise: Answer in two or three sentences at most. Long-winded responses are annoying.
5. ⛔ Prices: NEVER invent or estimate prices. Use ONLY numbers from "Official prices from system" or "Relevant Information" below. If no number is listed, say price depends on dates/hotel and point to cards or 19102.
6. ✅ General questions: If they ask for information only (like "What hotels are in Bali?" or "How much is Sharm?"), answer with information without starting the booking process. Only ask for booking details if they explicitly say "I want to book".
7. Book smartly: Don't start asking for details immediately unless they explicitly say "I want to book" or "trip details for X", then let them know you'll start the booking steps.
8. When there's a destination or hotel/offer request, use action language like: "Let me check what's available", "I'll compare options", "I'll show you the best" instead of generic responses.
9. Never display hotels and prices as text lists: The client sees "hotel design cards" (Widgets) that appear automatically below with images, prices, and details. Instead of listing hotel names in plain text, just use an engaging sentence like: "I'll show you the best available options with images and prices below." and leave it at that.
10. 100% honesty: Don't invent hotels that don't exist.
11. ✅ Hotel links: If the hotel exists on the website, tell the client "You can see more details on the hotel page" and a link will appear automatically.
12. General questions: If they ask about general information, present attractive ideas briefly. If they show interest in booking, start the steps.
13. ⚠️ STRICTLY FORBIDDEN to mix Arabic and English in the same response. Use English ONLY.

🎬 Style examples (no invented prices):
- User: "How much is Bali?"
  You: "[Quote Strapi price range only if listed] Would you like to see hotels with prices in the cards below?"
- User: "I want to book a trip"
  You: "Excellent! I'll help you step by step. Where are you thinking of going?"
- User: "What hotels are in Sharm?"
  You: "Sharm has great 3–5 star hotels. I'll show the best options with prices in the cards below."
- User: "How much is Umrah?"
  You: "[Umrah prices from Strapi only] Want me to point you to the Umrah packages page?"

⚠️ Strict Warning:
- Don't write long boring tables.
- Don't be like a robot that repeats the same questions.
- Focus on reading "Conversation History" attached in messages to understand if the user already answered something.
- Keep your conversation simple and useful, you're a professional assistant, not an annoying salesperson.
- ⚠️ ABSOLUTELY FORBIDDEN to use Arabic words in English responses.`;
  }
}

export async function POST(request) {
  let language = "ar"; // Default language
  let uiLanguage = "ar"; // Widget/UX language (ar/en only)

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
    uiLanguage = language === "ar" ? "ar" : "en";

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

    const isArabic = uiLanguage === "ar";

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
    const userAnalysis = analyzeUserMessage(sanitizedMessage, uiLanguage);
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
        intent: "out_of_scope",
        sessionId: session.sessionId
      });
    }

    // ✅ Step 3: بناء سياق RAG بالبيانات الحقيقية
    const ragContext = await buildRAGContext(userAnalysis, uiLanguage);
    console.log("[Chatbot] RAG context built:", {
      hotelsFound: ragContext.hotels?.length || 0,
      faqsFound: ragContext.faqs?.length || 0,
      hasDestInfo: !!ragContext.destInfo
    });

    // ✅ Step 3.5: الحصول على الروابط المقترحة
    const suggestedPages = getSuggestedPages(userAnalysis, uiLanguage);

    // ✅ Step 3.6: فحص إذا كان يطلب التوجيه لصفحة معينة
    // ⚠️ IMPORTANT: Check booking intent FIRST before navigation
    // لو اليوزر قال "رحلة" أو "عايز احجز"، ده booking مش navigation!
    
    let navigationAction = null;

    // البحث عن صفحة مطابقة - حتى لو الـ intent مختلف
    const matchedPage = findMatchingPage(sanitizedMessage, language);

    // تحقق من وجود كلمات التنقل الصريحة في الرسالة
    // مهم: لا نعتبر كلمات عامة مثل "عايز" نية تنقل حتى لا نخطف رسائل الحجز.
    const hasExplicitNavigationIntent = /وديني|ودني|خدني|افتح|ورني|اذهب|توجه|صفحة|صفحه|take me|go to|open|navigate|page|show me/i.test(sanitizedMessage);

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
        enhancedPrompt += isArabic
          ? `\n\n📊 بيانات الرحلة الحالية (Strapi — المصدر الوحيد للأسعار):\n${ragContext.context}`
          : `\n\n📊 Current trip data (Strapi — sole source for prices):\n${ragContext.context}`;
      }

      if (ragContext.hotels && ragContext.hotels.length > 0) {
        const hotelSummary = isArabic
          ? `فنادق متاحة: ${ragContext.hotels.length}`
          : `Hotels available: ${ragContext.hotels.length}`;
        enhancedPrompt += `\n\n${hotelSummary}`;
      }

      const chatMessages = [{ role: "system", content: enhancedPrompt }];

      const recentHistory = sessionManager.getConversationHistory(session.sessionId, 8)
        // Remove the current user message that was just added so we don't duplicate it at the end
        .slice(0, -1)
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
              temperature: 0.35,
              top_p: 0.9,
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
        reply = await buildStrapiFallbackReply(userAnalysis, ragContext, uiLanguage, sanitizedMessage);
      } else {
        const responseData = await openRouterResponse.json();
        reply = responseData.choices?.[0]?.message?.content || "";
        reply = reply.trim();
      }
    } else {
      console.warn("[Chatbot] OPENROUTER_API_KEY missing. Using Strapi fallback reply.");
      reply = await buildStrapiFallbackReply(userAnalysis, ragContext, uiLanguage, sanitizedMessage);
    }

    // ✅ Step 8: Add AI response to session
    sessionManager.addMessage(session.sessionId, { role: "assistant", content: reply });

    // ✅ Step 9: Determine and generate next widget
    // Only show our custom widgets - no AI-generated widgets
    const sessionData = sessionManager.getSession(session.sessionId);
    sessionData.conversationHistory = conversationHistory || [];

    const nextWidget = determineNextWidget(sessionData, { ...userAnalysis, originalMessage: sanitizedMessage });
    let widgetData = null;
    let forcedQuickOptions = null;

    // ✅ Only generate widget if it's a valid type
    if (nextWidget && isValidWidget(nextWidget.type)) {
      // ✅ Enable booking mode ONLY if starting booking flow (not for information-only queries)
      if (nextWidget.startBookingFlow && !nextWidget.informationOnly) {
        console.log("[Chatbot] Enabling booking mode");
        sessionManager.enableBookingMode(session.sessionId);
      }

      // Pass widgetInfo for direct queries (like hotel search)
      widgetData = await generateWidgetData(nextWidget.type, sessionData, uiLanguage, nextWidget);
      const isEmptyHotelWidget =
        widgetData?.type === "hotelCards" &&
        (!Array.isArray(widgetData?.props?.hotels) || widgetData.props.hotels.length === 0);

      if (isEmptyHotelWidget) {
        widgetData = null;
        reply += isArabic
          ? "\n\nحالياً لا توجد فنادق منشورة لهذه الوجهة. جرّب وجهة أخرى أو اسألني عن العروض المتاحة."
          : "\n\nThere are currently no published hotels for this destination. Try another destination or ask for available offers.";
        forcedQuickOptions = isArabic
          ? [
            { label: "🎁 شوف العروض", value: "ايه العروض المتاحة؟", autoSend: true },
            { label: "🌍 وجهات تانية", value: "عايز أشوف وجهات تانية", autoSend: true },
          ]
          : [
            { label: "🎁 Show Offers", value: "What offers are available?", autoSend: true },
            { label: "🌍 Other Destinations", value: "Show me other destinations", autoSend: true },
          ];
      } else {
        const widgetResponse = generateWidgetResponse(nextWidget, uiLanguage);

        // Enhance reply with widget context if needed
        if (widgetResponse && !reply.includes(widgetResponse.substring(0, 20))) {
          reply = reply + "\n\n" + widgetResponse;
        }
      }
    }

    // ✅ Step 10: Return response with widget
    return Response.json({
      reply,
      success: true,
      suggestedPages,
      navigation: navigationAction,
      quickOptions: forcedQuickOptions || (widgetData ? null : generateQuickOptions(userAnalysis, isArabic ? "ar" : "en", reply)),
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
        language: language,
        uiLanguage: uiLanguage
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
