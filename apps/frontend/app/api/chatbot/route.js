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
  SITE_PAGES
} from "@/services/ragService";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * نظام محادثة ذكي مع RAG لـ QuickAir
 * Smart Chatbot with RAG for QuickAir
 * 
 * ❗ NO HALLUCINATIONS - Only real data from database
 */

// بناء السياق النظامي الكامل
function buildSystemPrompt(language = "ar") {
  const isArabic = language === "ar";
  
  if (isArabic) {
    return `أنت بوت سفر ذكي تابع لشركة Quick Air.
هدفك هو مساعدة العميل في اختيار الوجهة، الفندق، والميزانية، وتقديم العروض الحقيقية بدقة 100%.

🎯 **القواعد الذهبية:**

1️⃣ **ممنوع اختراع أي معلومة**
- استخدم فقط البيانات المتوفرة في السياق
- لا تذكر فنادق أو أسعار غير موجودة
- إذا لم تجد معلومة، اعترف بذلك

2️⃣ **الرد بنفس اللغة 100%**
- إذا كان العميل يتحدث بالعربية، رد بالعربية فقط
- إذا كان يتحدث بالإنجليزية، رد بالإنجليزية فقط
- ممنوع خلط اللغات

3️⃣ **فهم اللغة الطبيعية**
- افهم الرسائل حتى لو كانت غير دقيقة
- استخرج المعلومات تلقائيًا (الوجهة، التاريخ، عدد الأشخاص، الميزانية)

4️⃣ **عرض المعلومات بدقة**
- اذكر اسم الفندق كاملاً
- اذكر السعر بالجنيه والدولار
- اذكر عدد النجوم ونوع الغرفة
- اذكر ما يشمله العرض وما لا يشمله

5️⃣ **تحويل الزائر إلى عميل**
- كن ودوداً ومتحمساً
- اطرح أسئلة ذكية لفهم احتياجاته
- اقترح خيارات مناسبة لميزانيته

6️⃣ **التعامل مع الأسئلة خارج النطاق**
- إذا سأل عن شيء غير متعلق بالسفر، قل:
  "أنا متاح لمساعدتك في الرحلات، التأشيرات، العروض، والفنادق الخاصة بـ Quick Air 🌍✈️"

7️⃣ **تفاصيل العروض**
✔ يشمل: الإقامة، الوجبات، الانتقالات، التأمين
❌ لا يشمل: الطيران، التأشيرة، الجولات الاختيارية، المصروفات الشخصية

8️⃣ **أسلوب المحادثة**
- ردود قصيرة وواضحة
- بدون حشو
- استخدم الإيموجي بذكاء
- كن طبيعياً وودوداً

🌍 **الوجهات المتاحة:**
- بالي 🏝️ (إندونيسيا)
- إسطنبول 🕌 (تركيا)
- شرم الشيخ 🏖️ (مصر)
- الغردقة 🤿 (مصر)
- دهب 🏄 (مصر)
- بيروت 🌆 (لبنان)

استخدم المعلومات المتوفرة في السياق لبناء ردك.`;
  } else {
    return `You are an intelligent travel bot for Quick Air.
Your goal is to help customers choose destinations, hotels, and budgets, providing 100% accurate real offers.

🎯 **Golden Rules:**

1️⃣ **NO HALLUCINATIONS**
- Use only data provided in context
- Never mention hotels or prices not in database
- If you don't know, admit it

2️⃣ **Reply in same language 100%**
- If customer speaks Arabic, reply in Arabic only
- If customer speaks English, reply in English only
- Never mix languages

3️⃣ **Natural Language Understanding**
- Understand messages even if imprecise
- Automatically extract info (destination, dates, travelers, budget)

4️⃣ **Display Info Accurately**
- Mention full hotel name
- State price in EGP and USD
- State stars and room type
- State what's included and excluded

5️⃣ **Convert Visitor to Customer**
- Be friendly and enthusiastic
- Ask smart questions to understand needs
- Suggest options within budget

6️⃣ **Handle Out-of-Scope Questions**
- If asked about non-travel topics, say:
  "I can help with flights, visas, offers, and hotels for Quick Air 🌍✈️"

7️⃣ **Offer Details**
✔ Includes: Accommodation, Meals, Transfers, Insurance
❌ Excludes: Flights, Visa, Optional Tours, Personal Expenses

8️⃣ **Conversation Style**
- Short, clear responses
- No fluff
- Use emojis smartly
- Be natural and friendly

🌍 **Available Destinations:**
- Bali 🏝️ (Indonesia)
- Istanbul 🕌 (Turkey)
- Sharm El Sheikh 🏖️ (Egypt)
- Hurghada 🤿 (Egypt)
- Dahab 🏄 (Egypt)
- Beirut 🌆 (Lebanon)

Use the information provided in context to build your response.`;
  }
}

export async function POST(request) {
  let language = "ar"; // Default language
  
  try {
    const { message, language: userLanguage, conversationHistory } = await request.json();
    language = userLanguage || "ar";

    if (!message || message.trim().length === 0) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const isArabic = language === "ar";

    // ✅ Step 1: تحليل رسالة المستخدم
    const userAnalysis = analyzeUserMessage(message, language);

    // ✅ Step 2: فحص إذا كان السؤال خارج النطاق
    if (isOutOfScope(message)) {
      const outOfScopeMessage = isArabic
        ? "أنا متاح لمساعدتك في الرحلات، التأشيرات، العروض، والفنادق الخاصة بـ Quick Air 🌍✈️\n\nكيف يمكنني مساعدتك في التخطيط لرحلتك؟"
        : "I can help with flights, visas, offers, and hotels for Quick Air 🌍✈️\n\nHow can I help you plan your trip?";

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

    // ✅ Step 4: بناء Prompt للـ AI
    const systemPrompt = buildSystemPrompt(language);
    
    let enhancedPrompt = systemPrompt;
    if (ragContext.context) {
      enhancedPrompt += `\n\n📊 **البيانات المتوفرة:**\n${ragContext.context}`;
    }
    
    // إضافة الروابط للـ prompt
    if (suggestedPages.length > 0) {
      enhancedPrompt += isArabic 
        ? `\n\n🔗 **روابط مفيدة (اذكرها في ردك):**\n`
        : `\n\n🔗 **Useful Links (mention in your response):**\n`;
      
      suggestedPages.forEach(link => {
        enhancedPrompt += `${link.icon} ${link.text}: ${link.url}\n`;
      });
      
      enhancedPrompt += isArabic
        ? `\n⚠️ مهم: اذكر هذه الروابط في ردك بطريقة طبيعية وشجع العميل على زيارتها.\n`
        : `\n⚠️ Important: Mention these links naturally in your response and encourage the customer to visit them.\n`;
    }

    // ✅ Step 5: إعداد المحادثة
    const model = genAI.getGenerativeModel({
      model: process.env.MODEL || "gemini-2.0-flash-001",
    });

    // تجهيز سجل المحادثة
    const chatHistory = (conversationHistory || [])
      .slice(-6)
      .filter((msg) => msg.role && msg.content)
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    // التأكد من أن أول رسالة من user
    if (chatHistory.length > 0 && chatHistory[0].role !== "user") {
      chatHistory.shift();
    }

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.7,
        topP: 0.85,
        topK: 30,
      },
    });

    // ✅ Step 6: إرسال الرسالة
    const finalPrompt = chatHistory.length === 0
      ? `${enhancedPrompt}\n\n👤 العميل: ${message}\n\n🤖 الرد (باللغة ${isArabic ? "العربية" : "الإنجليزية"} فقط):`
      : message;

    const result = await chat.sendMessage(finalPrompt);
    const response = result.response;
    let reply = response.text();

    // ✅ Step 7: تنظيف الرد
    reply = reply.trim();

    // ✅ Step 8: إرجاع النتيجة مع الروابط
    return Response.json({
      reply,
      success: true,
      suggestedPages, // إضافة الروابط للرد
      metadata: {
        intent: userAnalysis.intent,
        destination: userAnalysis.destination,
        hotels_found: ragContext.hotels?.length || 0,
        faqs_found: ragContext.faqs?.length || 0,
        links_suggested: suggestedPages.length,
      },
    });
  } catch (error) {
    console.error("Chatbot API error:", error);

    const isArabic = language === "ar";
    const fallbackMessage = isArabic
      ? "عذراً، أواجه صعوبة في الإجابة الآن. يرجى المحاولة مرة أخرى أو التواصل مع فريق الدعم عبر صفحة الاتصال."
      : "Sorry, I'm having trouble responding right now. Please try again or contact our support team via the contact page.";

    return Response.json(
      {
        reply: fallbackMessage,
        error: "AI processing error",
      },
      { status: 200 }
    );
  }
}
