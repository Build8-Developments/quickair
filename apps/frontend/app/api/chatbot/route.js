import { GoogleGenerativeAI } from "@google/generative-ai";
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
  SITE_PAGES
} from "@/services/ragService";
import sessionManager from "@/services/sessionManager";
import { determineNextWidget, generateWidgetData, generateWidgetResponse } from "@/services/widgetGenerator";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

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
  
  if (isArabic) {
    return `أنت "كويك" - مساعد سفر لـ Quick Air.

أسلوب الرد:
⚡ جملة واحدة قصيرة فقط (10-15 كلمة)
⚡ سؤال واحد واضح ومباشر
⚡ بدون قوائم أو تفاصيل طويلة
⚡ إيموجي واحد فقط

معرفة الصفحات:
📄 الرئيسية: /
🌍 الرحلات: /tours-list
🏨 الفنادق: /hotels
🎁 العروض: /offers
✈️ خطط رحلتك: /create-trip
📞 اتصل بنا: /contact
❓ الأسئلة الشائعة: /faq

قواعد صارمة:
❌ لا تعيد كل المعلومات
❌ لا تشرح بالتفصيل
❌ لا تعرض خيارات متعددة
✅ سؤال واحد مباشر فقط

مثال جيد: "رائع! متى تريد السفر؟ 🗓️"
مثال سيء: "ممتاز! شرم الشيخ وجهة رائعة. يمكنك الاختيار من عدة فنادق..."`;
  } else {
    return `You are "Quick" - travel assistant for Quick Air.

Response Style:
⚡ One short sentence only (10-15 words)
⚡ One clear direct question
⚡ No lists or long details
⚡ One emoji only

Page Knowledge:
📄 Home: /
🌍 Tours: /tours-list
🏨 Hotels: /hotels
🎁 Offers: /offers
✈️ Plan Trip: /create-trip
📞 Contact: /contact
❓ FAQs: /faq

Strict Rules:
❌ Don't repeat all info
❌ Don't explain in detail
❌ Don't show multiple options
✅ One direct question only

Good example: "Great! When would you like to travel? 🗓️"
Bad example: "Excellent! Sharm El Sheikh is amazing. You can choose from several hotels..."`;
  }
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
    if (userAnalysis.intent === "navigate_page") {
      const matchedPage = findMatchingPage(messageText, language);
      if (matchedPage) {
        navigationAction = {
          action: "navigate",
          url: matchedPage.url,
          pageName: matchedPage.name,
          shouldNavigate: true
        };
        
        // رد مختصر مع التوجيه
        const navReply = isArabic 
          ? `جاري فتح ${matchedPage.name}... 🔗`
          : `Opening ${matchedPage.name}... 🔗`;
        
        return Response.json({
          reply: navReply,
          success: true,
          navigation: navigationAction,
          suggestedPages: [matchedPage],
          sessionId: session.sessionId,
          metadata: {
            intent: "navigate_page",
            page: matchedPage.page
          }
        });
      }
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

    // ✅ Step 5: إعداد المحادثة
    const model = genAI.getGenerativeModel({
      model: process.env.MODEL || "gemini-2.0-flash-001",
    });

    // تجهيز سجل المحادثة
    const chatHistory = (conversationHistory || [])
      .slice(-6)
      .filter((msg) => msg.role && msg.content)
      .map((msg) => {
        // Ensure content is always a string
        const content = typeof msg.content === 'string' 
          ? msg.content 
          : (msg.content?.message || JSON.stringify(msg.content));
        
        return {
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: content }],
        };
      });

    // التأكد من أن أول رسالة من user
    if (chatHistory.length > 0 && chatHistory[0].role !== "user") {
      chatHistory.shift();
    }

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 80, // Short and concise responses
        temperature: 0.5, // More creative and natural
        topP: 0.9,
        topK: 40,
      },
    });

    // ✅ Step 6: إرسال الرسالة
    const finalPrompt = chatHistory.length === 0
      ? `${enhancedPrompt}\n\n👤 العميل: ${message}\n\n🤖 الرد (${isArabic ? "بالعربية" : "in English"} - جملة واحدة فقط 10-15 كلمة - سؤال مباشر فقط):`
      : message + "\n\n" + (isArabic ? "تذكر: جملة واحدة قصيرة فقط!" : "Remember: One short sentence only!");

    const result = await chat.sendMessage(finalPrompt);
    const response = result.response;
    let reply = response.text();

    // ✅ Step 7: تنظيف الرد
    reply = reply.trim();

    // ✅ Step 8: Add AI response to session
    sessionManager.addMessage(session.sessionId, { role: "assistant", content: reply });

    // ✅ Step 9: Determine and generate next widget
    const sessionData = sessionManager.getSession(session.sessionId);
    const nextWidget = determineNextWidget(sessionData, userAnalysis);
    let widgetData = null;

    if (nextWidget) {
      widgetData = generateWidgetData(nextWidget.type, sessionData, language);
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
      navigation: navigationAction, // إضافة navigation action
      quickOptions: widgetData ? null : generateQuickOptions(userAnalysis, language, reply), // Hide quick options when widget is shown
      widget: widgetData, // Include widget data
      sessionId: session.sessionId, // Return session ID
      tripUpdate: widgetSelection || null, // Return trip updates
      metadata: {
        intent: userAnalysis.intent,
        destination: userAnalysis.destination,
        hotels_found: ragContext.hotels?.length || 0,
        faqs_found: ragContext.faqs?.length || 0,
        links_suggested: suggestedPages.length,
        widget_type: nextWidget?.type,
        session_step: sessionData?.step,
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
        widget: { type: "destinations", component: "DestinationsWidget", props: { language } }, // Fallback to destinations widget
      },
      { status: 200 }
    );
  }
}
