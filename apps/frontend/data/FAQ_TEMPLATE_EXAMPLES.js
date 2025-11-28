/**
 * EXAMPLE: How to Add Custom FAQ Content
 * 
 * Copy this template into data/faqData.js to add your own categories
 */

// TEMPLATE FOR NEW CATEGORY
const newCategoryTemplate = {
  en: {
    id: "custom-category",           // Unique identifier (use lowercase, hyphens)
    name: "Custom Category Name",     // Display name shown in sidebar
    icon: "icon-name",                // Icon class from your icon font
    questions: [
      {
        id: "custom-1",               // Unique question ID
        question: "What is your question?",
        answer: "This is the detailed answer to the question. Keep it clear and concise."
      },
      {
        id: "custom-2",
        question: "Another question?",
        answer: "Another helpful answer here."
      }
    ]
  },
  ar: {
    id: "custom-category",           // MUST match English ID
    name: "اسم الفئة المخصصة",
    icon: "icon-name",               // MUST match English icon
    questions: [
      {
        id: "custom-1",              // MUST match English ID
        question: "ما هو سؤالك؟",
        answer: "هذه هي الإجابة التفصيلية على السؤال."
      },
      {
        id: "custom-2",
        question: "سؤال آخر؟",
        answer: "إجابة مفيدة أخرى هنا."
      }
    ]
  }
};

// REAL EXAMPLE: Tours & Activities Category
const toursExample = {
  en: {
    id: "tours",
    name: "Tours & Activities",
    icon: "icon-destination",
    questions: [
      {
        id: "tours-1",
        question: "How do I book a tour?",
        answer: "Browse our tours page, select your preferred tour, choose dates and number of travelers, then complete the booking form. You'll receive instant confirmation via email."
      },
      {
        id: "tours-2",
        question: "Can I customize a tour?",
        answer: "Yes! Many of our tours offer customization options. Contact our team with your preferences, and we'll create a personalized itinerary for you."
      },
      {
        id: "tours-3",
        question: "What's included in tour packages?",
        answer: "Each tour includes different amenities. Typically, you'll get transportation, guide services, and entrance fees. Check individual tour pages for specific inclusions."
      },
      {
        id: "tours-4",
        question: "Are group discounts available?",
        answer: "Yes, we offer special rates for groups of 10 or more people. Contact our group bookings team for a custom quote."
      }
    ]
  },
  ar: {
    id: "tours",
    name: "الجولات والأنشطة",
    icon: "icon-destination",
    questions: [
      {
        id: "tours-1",
        question: "كيف أحجز جولة؟",
        answer: "تصفح صفحة الجولات، اختر الجولة المفضلة لديك، اختر التواريخ وعدد المسافرين، ثم أكمل نموذج الحجز. ستتلقى تأكيدًا فوريًا عبر البريد الإلكتروني."
      },
      {
        id: "tours-2",
        question: "هل يمكنني تخصيص جولة؟",
        answer: "نعم! العديد من جولاتنا تقدم خيارات التخصيص. اتصل بفريقنا مع تفضيلاتك، وسنقوم بإنشاء خط سير مخصص لك."
      },
      {
        id: "tours-3",
        question: "ما الذي تتضمنه باقات الجولات؟",
        answer: "كل جولة تتضمن وسائل راحة مختلفة. عادةً، ستحصل على النقل وخدمات المرشد ورسوم الدخول. تحقق من صفحات الجولات الفردية للحصول على محتويات محددة."
      },
      {
        id: "tours-4",
        question: "هل تتوفر خصومات جماعية؟",
        answer: "نعم، نقدم أسعارًا خاصة للمجموعات المكونة من 10 أشخاص أو أكثر. اتصل بفريق الحجوزات الجماعية للحصول على عرض أسعار مخصص."
      }
    ]
  }
};

// STEPS TO ADD THIS TO YOUR FAQ:

/**
 * 1. Open: data/faqData.js
 * 
 * 2. Find: export const faqCategories = {
 * 
 * 3. Add your category to the 'en' array:
 *    en: [
 *      { existing categories... },
 *      { your new category here }
 *    ]
 * 
 * 4. Add corresponding Arabic version to 'ar' array:
 *    ar: [
 *      { existing categories... },
 *      { your Arabic category here }
 *    ]
 * 
 * 5. Save the file
 * 
 * 6. Refresh the page - your category appears automatically!
 */

// IMPORTANT RULES:

/**
 * ✅ DO:
 * - Use unique IDs for categories and questions
 * - Keep the same ID in English and Arabic versions
 * - Use clear, concise language
 * - Test in both languages
 * - Use existing icon classes
 * 
 * ❌ DON'T:
 * - Use spaces or special characters in IDs
 * - Forget to add Arabic translation
 * - Use different IDs for same content
 * - Make answers too long (aim for 2-4 sentences)
 * - Use icons that don't exist in your icon set
 */

// CONTENT WRITING TIPS:

/**
 * Questions should:
 * - Start with how, what, when, where, why, can, do
 * - Be specific and clear
 * - Match common user queries
 * - Include keywords for SEO
 * 
 * Answers should:
 * - Be direct and helpful
 * - Start with yes/no when applicable
 * - Provide actionable information
 * - Link to relevant pages if needed
 * - Be friendly and professional
 */

// SEO OPTIMIZATION:

/**
 * Include keywords like:
 * - booking, reservation, payment
 * - hotel, flight, tour
 * - cancel, modify, refund
 * - visa, passport, insurance
 * - customer service, support
 * 
 * This helps users find answers through search!
 */

export { newCategoryTemplate, toursExample };
