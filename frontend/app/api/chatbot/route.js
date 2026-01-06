import {
  analyzeUserMessage,
  buildRAGContext,
  searchHotels,
  isOutOfScope,
  getVisaInfo,
  getOptionalTours,
  getAllDestinations,
  suggestDestinationsByBudget,
  getSuggestedPages,
  findMatchingPage,
  getAllPages,
  SITE_PAGES,
  // New imports for comprehensive knowledge
  getCompanyInfo,
  getAllServices,
  getServiceInfo,
  getPolicies,
  getCurrentOffers,
  comprehensiveSearch,
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

// Generate quick options based on context
function generateQuickOptions(userAnalysis, language, reply) {
  const isArabic = language === "ar";
  const options = [];

  // If asking about destination, show popular destinations
  if (!userAnalysis.destination && (reply.includes("وجهة") || reply.includes("destination"))) {
    return [
      { label: isArabic ? "بالي" : "Bali", value: isArabic ? "بالي" : "Bali", autoSend: true },
      { label: isArabic ? "إسطنبول" : "Istanbul", value: isArabic ? "إسطنبول" : "Istanbul", autoSend: true },
      { label: isArabic ? "شرم الشيخ" : "Sharm El Sheikh", value: isArabic ? "شرم الشيخ" : "Sharm El Sheikh", autoSend: true },
      { label: isArabic ? "دبي" : "Dubai", value: isArabic ? "دبي" : "Dubai", autoSend: true },
    ];
  }

  // If destination is set but no travelers count
  if (userAnalysis.destination && (reply.includes("مسافر") || reply.includes("traveler") || reply.includes("how many"))) {
    return [
      { label: isArabic ? "شخص واحد" : "1 Person", value: "1", autoSend: true },
      { label: isArabic ? "شخصان" : "2 People", value: "2", autoSend: true },
      { label: isArabic ? "عائلة (4)" : "Family (4)", value: "4", autoSend: true },
      { label: isArabic ? "مجموعة (6+)" : "Group (6+)", value: "6", autoSend: true },
    ];
  }

  // If asking about duration
  if (reply.includes("مدة") || reply.includes("duration") || reply.includes("how long")) {
    return [
      { label: isArabic ? "3 أيام" : "3 Days", value: isArabic ? "3 أيام" : "3 days", autoSend: true },
      { label: isArabic ? "5 أيام" : "5 Days", value: isArabic ? "5 أيام" : "5 days", autoSend: true },
      { label: isArabic ? "7 أيام" : "7 Days", value: isArabic ? "7 أيام" : "7 days", autoSend: true },
      { label: isArabic ? "10 أيام" : "10 Days", value: isArabic ? "10 أيام" : "10 days", autoSend: true },
    ];
  }

  // If asking about budget
  if (reply.includes("ميزانية") || reply.includes("budget")) {
    return [
      { label: isArabic ? "اقتصادي" : "Budget", value: isArabic ? "اقتصادي" : "budget friendly", autoSend: true },
      { label: isArabic ? "متوسط" : "Mid-range", value: isArabic ? "متوسط" : "mid-range", autoSend: true },
      { label: isArabic ? "فاخر" : "Luxury", value: isArabic ? "فاخر" : "luxury", autoSend: true },
    ];
  }

  // If asking about visa or nationality
  if (reply.includes("جنسية") || reply.includes("nationality")) {
    return [
      { label: isArabic ? "مصري" : "Egyptian", value: isArabic ? "مصري" : "Egyptian", autoSend: true },
      { label: isArabic ? "سعودي" : "Saudi", value: isArabic ? "سعودي" : "Saudi", autoSend: true },
      { label: isArabic ? "إماراتي" : "Emirati", value: isArabic ? "إماراتي" : "Emirati", autoSend: true },
    ];
  }

  return options.length > 0 ? options : null;
}

// بناء السياق النظامي الكامل
function buildSystemPrompt(language = "ar") {
  const isArabic = language === "ar";
  
  // Get comprehensive knowledge base (always in Arabic/English for data)
  const knowledge = getChatbotKnowledgeBase(isArabic ? "ar" : "en");
  const company = knowledge.company;
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
  
  // Universal multilingual prompt
  return `You are "Quick" - a smart multilingual travel assistant for Quick Air Travel (كويك إير للسياحة), an Egyptian travel agency established in 1986.

🌍 CRITICAL LANGUAGE INSTRUCTION:
You MUST respond ONLY in ${selectedLanguage}. The user has selected this language.
- ALL your responses must be in ${selectedLanguage}
- Translate all information to ${selectedLanguage}
- Use natural, fluent ${selectedLanguage}
- Keep cultural context appropriate for ${selectedLanguage} speakers

🏢 Company Information:
- Name: Quick Air Travel / كويك إير للسياحة
- Established: 1986
- Working Hours: Saturday-Thursday 9AM-9PM, Friday 2PM-9PM
- Contact: 19102 (Phone & WhatsApp)
- Email: 19102@quickair.travel
- Location: Cairo, Egypt

📋 Our Services:
${services.map(s => `• ${s.name}: ${s.description}`).join('\n')}

🎁 Current Offers:
${offers.map(o => `• ${o.title} - ${o.discount}`).join('\n')}

💳 Payment Methods:
${policies.paymentMethods.join(', ')}

📜 Cancellation Policy:
${policies.cancellation.slice(0, 2).join(' | ')}

🌍 Available Destinations:
- Egypt: Sharm El Sheikh, Hurghada, Dahab, Ain Sokhna, Sahl Hasheesh
- International: Bali, Istanbul, Beirut, Dubai

🌐 Website Pages:
- Home: / | Tours: /tours-list | Hotels: /hotels
- Offers: /offers | Plan Trip: /create-trip
- Contact: /contact | FAQ: /faq | About: /about
- Hajj & Umrah: /haj and /omra

🎯 Your Personality:
- Friendly, professional, and helpful
- Understand context and intent from messages
- Reply naturally like a real person
- Remember previous conversation
- Know everything about the company and its services

💬 Response Style:
- ALWAYS respond in ${selectedLanguage}
- First understand what the customer wants
- Reply naturally and briefly (one or two sentences)
- Ask only one question if you need info
- Use one appropriate emoji
- Don't repeat information

🚫 Avoid:
- Responding in any language other than ${selectedLanguage}
- Very long responses
- Multiple lists
- Repeating the same question
- Answering questions outside travel scope`;
}

export async function POST(request) {
  let language = "ar"; // Default language
  
  try {
    const { 
      message, 
      language: userLanguage, 
      conversationHistory,
      userInfo,
      tripData,
      sessionId,
      widgetSelection 
    } = await request.json();
    language = userLanguage || "ar";

    // Handle message validation - message can be string or object from widget
    const messageText = typeof message === 'string' ? message : (message?.message || JSON.stringify(message));
    
    if (!messageText || messageText.trim().length === 0) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const isArabic = language === "ar";

    // ✅ Session Management
    let session;
    if (sessionId) {
      session = sessionManager.getSession(sessionId) || sessionManager.createSession(sessionId, userInfo || {});
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      session = sessionManager.createSession(newSessionId, userInfo || {});
    }

    // Update session with widget selection
    if (widgetSelection) {
      sessionManager.updateTripData(session.sessionId, widgetSelection);
    }

    // Add message to session history
    sessionManager.addMessage(session.sessionId, { role: "user", content: messageText });

    // ✅ Step 1: تحليل رسالة المستخدم
    const userAnalysis = analyzeUserMessage(messageText, language);

    // ✅ Step 2: فحص إذا كان السؤال خارج النطاق
    if (isOutOfScope(messageText)) {
      const outOfScopeMessage = isArabic
        ? "أساعدك في حجز الرحلات والفنادق والتأشيرات فقط.\n\nكيف أساعدك في رحلتك؟"
        : "I help with flight, hotel, and visa bookings only.\n\nHow can I help with your trip?";

      return Response.json({
        reply: outOfScopeMessage,
        success: true,
        intent: "out_of_scope"
      });
    }

    // ✅ Step 3: بناء سياق RAG بالبيانات الحقيقية
    const ragContext = buildRAGContext(userAnalysis, language);
    
    // ✅ Step 3.5: الحصول على الروابط المقترحة
    const suggestedPages = getSuggestedPages(userAnalysis, language);
    
    // ✅ Step 3.6: فحص إذا كان يطلب التوجيه لصفحة معينة
    let navigationAction = null;
    
    // البحث عن صفحة مطابقة - حتى لو الـ intent مختلف
    const matchedPage = findMatchingPage(messageText, language);
    
    // تحقق من وجود كلمات التنقل في الرسالة
    const hasNavigationIntent = /وديني|ودني|خدني|روح|افتح|ورني|اذهب|توجه|صفحة|صفحه|اشوف|شوفني|عرض|لا صفح|لا الصفح|طب |هات|ابي|أبي|أبغى|ابغى|عايز|اريد|أريد|take me|go to|open|show me|navigate|page|view|see|want|need/i.test(messageText);
    
    console.log("🔍 Navigation check:", { messageText, matchedPage, hasNavigationIntent, intent: userAnalysis.intent });
    
    // ✅ إذا طلب صفحة معينة - أعطيه زرار بدل ما يفتح أوتوماتيك
    if (matchedPage) {
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

    // ✅ Step 4: بناء Prompt للـ AI
    const systemPrompt = buildSystemPrompt(language);
    
    let enhancedPrompt = systemPrompt;
    // Only add minimal context - don't overwhelm the AI
    if (ragContext.hotels && ragContext.hotels.length > 0) {
      const hotelSummary = isArabic 
        ? `فنادق متاحة: ${ragContext.hotels.length}`
        : `Hotels available: ${ragContext.hotels.length}`;
      enhancedPrompt += `\n\n${hotelSummary}`;
    }

    // ✅ Step 5: إعداد المحادثة مع OpenRouter
    const chatMessages = [
      { role: "system", content: enhancedPrompt }
    ];

    // Add conversation history
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

    // Add current message
    const currentPrompt = isArabic 
      ? `${messageText}\n\n(تذكر: جملة واحدة قصيرة فقط 10-15 كلمة - سؤال مباشر فقط)`
      : `${messageText}\n\n(Remember: One short sentence only, 10-15 words - direct question only)`;
    
    chatMessages.push({ role: "user", content: currentPrompt });

    // ✅ Step 6: إرسال الرسالة إلى OpenRouter
    const openRouterResponse = await fetch(OPENROUTER_BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://quickair.com",
        "X-Title": "QuickAir Travel Assistant",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: chatMessages,
        max_tokens: 100,
        temperature: 0.5,
        top_p: 0.9,
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.text();
      console.error("OpenRouter API error:", errorData);
      throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
    }

    const responseData = await openRouterResponse.json();
    let reply = responseData.choices?.[0]?.message?.content || "";

    // ✅ Step 7: تنظيف الرد
    reply = reply.trim();

    // ✅ Step 8: Add AI response to session
    sessionManager.addMessage(session.sessionId, { role: "assistant", content: reply });

    // ✅ Step 9: Determine and generate next widget
    // Only show our custom widgets - no AI-generated widgets
    const sessionData = sessionManager.getSession(session.sessionId);
    sessionData.conversationHistory = conversationHistory; // Pass conversation history for smart analysis
    
    const nextWidget = determineNextWidget(sessionData, { ...userAnalysis, originalMessage: messageText });
    let widgetData = null;

    // ✅ Only generate widget if it's a valid type
    if (nextWidget && isValidWidget(nextWidget.type)) {
      // Enable booking mode if starting booking flow
      if (nextWidget.startBookingFlow) {
        sessionManager.enableBookingMode(session.sessionId);
      }
      
      // Pass widgetInfo for direct queries (like hotel search)
      widgetData = generateWidgetData(nextWidget.type, sessionData, language, nextWidget);
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
    console.error("Chatbot API error:", error);
    console.error("Error stack:", error.stack);

    const isArabic = language === "ar";
    const fallbackMessage = isArabic
      ? "عذراً، أواجه صعوبة في الإجابة الآن. يرجى المحاولة مرة أخرى."
      : "Sorry, I'm having trouble responding right now. Please try again.";

    return Response.json(
      {
        reply: fallbackMessage,
        success: true,
        error: error.message || "AI processing error",
        widget: null, // ✅ No widget on error - let user chat normally
      },
      { status: 200 }
    );
  }
}
