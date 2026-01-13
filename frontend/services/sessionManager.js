/**
 * Session Manager - إدارة جلسات المحادثة
 * Manages conversation sessions with user data, trip data, and context memory
 */

class SessionManager {
  constructor() {
    // Store sessions in memory (in production, use Redis or database)
    this.sessions = new Map();
    // Auto-cleanup inactive sessions every hour
    this.startCleanup();
  }

  /**
   * إنشاء جلسة جديدة - Create new session
   */
  createSession(sessionId, userInfo) {
    console.log("[SessionManager] Creating session:", sessionId);
    
    const session = {
      sessionId,
      userInfo: {
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        preferredLanguage: userInfo.preferredLanguage || "ar",
      },
      tripData: {
        destination: null,
        dates: null,
        travelers: null,
        budget: null,
        hotel: null,
        mealPlan: null,
        roomType: null,
      },
      conversationHistory: [],
      contextMemory: {
        lastHotelMentioned: null,
        lastDestinationMentioned: null,
        lastPriceMentioned: null,
        displayedHotels: [],
        comparedHotels: [],
        bookingMode: false, // ✅ New: Track if user is in booking flow
        widgetsShown: false, // ✅ New: Track if widgets were shown initially
      },
      currentStep: "chat", // welcome, userInfo, language, chat, summary
      metadata: {
        createdAt: new Date(),
        lastActivity: new Date(),
        intentHistory: [],
      },
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * الحصول على الجلسة - Get session
   */
  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      // تحديث وقت آخر نشاط
      session.metadata.lastActivity = new Date();
    }
    return session;
  }

  /**
   * تحديث بيانات المستخدم - Update user info
   */
  updateUserInfo(sessionId, updates) {
    const session = this.getSession(sessionId);
    if (session) {
      session.userInfo = { ...session.userInfo, ...updates };
      return true;
    }
    return false;
  }

  /**
   * تحديث بيانات الرحلة - Update trip data
   */
  updateTripData(sessionId, updates) {
    const session = this.getSession(sessionId);
    if (session) {
      session.tripData = { ...session.tripData, ...updates };
      return true;
    }
    return false;
  }

  /**
   * إضافة رسالة للمحادثة - Add message to conversation
   */
  addMessage(sessionId, message) {
    const session = this.getSession(sessionId);
    if (session) {
      // الاحتفاظ بآخر 20 رسالة فقط
      session.conversationHistory.push({
        ...message,
        timestamp: new Date(),
      });

      if (session.conversationHistory.length > 20) {
        session.conversationHistory.shift();
      }
      return true;
    }
    return false;
  }

  /**
   * الحصول على تاريخ المحادثة - Get conversation history
   */
  getConversationHistory(sessionId, limit = 10) {
    const session = this.getSession(sessionId);
    if (session) {
      return session.conversationHistory.slice(-limit);
    }
    return [];
  }

  /**
   * تحديث ذاكرة السياق - Update context memory
   */
  updateContextMemory(sessionId, updates) {
    const session = this.getSession(sessionId);
    if (session) {
      session.contextMemory = { ...session.contextMemory, ...updates };
      return true;
    }
    return false;
  }

  /**
   * تفعيل وضع الحجز - Enable booking mode
   */
  enableBookingMode(sessionId) {
    const session = this.getSession(sessionId);
    if (session) {
      session.contextMemory.bookingMode = true;
      return true;
    }
    return false;
  }

  /**
   * إلغاء وضع الحجز - Disable booking mode
   */
  disableBookingMode(sessionId) {
    const session = this.getSession(sessionId);
    if (session) {
      session.contextMemory.bookingMode = false;
      return true;
    }
    return false;
  }

  /**
   * التحقق من وضع الحجز - Check if in booking mode
   */
  isInBookingMode(sessionId) {
    const session = this.getSession(sessionId);
    return session?.contextMemory?.bookingMode === true;
  }

  /**
   * إضافة فندق معروض - Add displayed hotel
   */
  addDisplayedHotel(sessionId, hotel) {
    const session = this.getSession(sessionId);
    if (session) {
      if (!session.contextMemory.displayedHotels.includes(hotel)) {
        session.contextMemory.displayedHotels.push(hotel);
        // الاحتفاظ بآخر 10 فنادق
        if (session.contextMemory.displayedHotels.length > 10) {
          session.contextMemory.displayedHotels.shift();
        }
      }
      // تحديث آخر فندق مذكور
      session.contextMemory.lastHotelMentioned = hotel;
      return true;
    }
    return false;
  }

  /**
   * حل الإشارات الضمنية - Resolve implicit references
   */
  resolveReference(sessionId, reference) {
    const session = this.getSession(sessionId);
    if (!session) return null;

    const { contextMemory } = session;
    reference = reference.toLowerCase().trim();

    // "ده" أو "this" → آخر فندق
    if (
      reference === "ده" ||
      reference === "دا" ||
      reference === "this" ||
      reference === "it"
    ) {
      return contextMemory.lastHotelMentioned;
    }

    // "الأول" → أول فندق معروض
    if (
      reference === "الأول" ||
      reference === "الاول" ||
      reference === "first" ||
      reference === "1"
    ) {
      return contextMemory.displayedHotels[0];
    }

    // "الثاني" → ثاني فندق
    if (
      reference === "الثاني" ||
      reference === "التاني" ||
      reference === "second" ||
      reference === "2"
    ) {
      return contextMemory.displayedHotels[1];
    }

    // "الأرخص" → أرخص فندق معروض
    if (
      reference === "الأرخص" ||
      reference === "الارخص" ||
      reference === "cheapest" ||
      reference === "lowest"
    ) {
      if (contextMemory.displayedHotels.length > 0) {
        return contextMemory.displayedHotels.reduce((cheapest, current) => {
          return current.price_egp < cheapest.price_egp ? current : cheapest;
        });
      }
    }

    // "الأفضل" أو "الأغلى" → أعلى تقييم
    if (
      reference === "الأفضل" ||
      reference === "الافضل" ||
      reference === "best" ||
      reference === "الأغلى" ||
      reference === "الاغلى" ||
      reference === "most expensive"
    ) {
      if (contextMemory.displayedHotels.length > 0) {
        return contextMemory.displayedHotels.reduce((best, current) => {
          return current.stars > best.stars ? current : best;
        });
      }
    }

    return null;
  }

  /**
   * تسجيل النية - Record intent
   */
  recordIntent(sessionId, intent, confidence = 1.0) {
    const session = this.getSession(sessionId);
    if (session) {
      session.metadata.intentHistory.push({
        intent,
        confidence,
        timestamp: new Date(),
      });

      // الاحتفاظ بآخر 50 نية
      if (session.metadata.intentHistory.length > 50) {
        session.metadata.intentHistory.shift();
      }
      return true;
    }
    return false;
  }

  /**
   * تحديث الخطوة الحالية - Update current step
   */
  setCurrentStep(sessionId, step) {
    const session = this.getSession(sessionId);
    if (session) {
      session.currentStep = step;
      return true;
    }
    return false;
  }

  /**
   * التحقق من اكتمال البيانات - Check if data is complete
   */
  isBookingComplete(sessionId) {
    const session = this.getSession(sessionId);
    if (!session) return false;

    const { tripData } = session;
    return !!(
      tripData.destination &&
      tripData.travelers &&
      tripData.hotel
    );
  }

  /**
   * الحصول على ملخص الحجز - Get booking summary
   */
  getBookingSummary(sessionId) {
    const session = this.getSession(sessionId);
    if (!session) return null;

    return {
      userInfo: session.userInfo,
      tripData: session.tripData,
      isComplete: this.isBookingComplete(sessionId),
      metadata: {
        createdAt: session.metadata.createdAt,
        messagesCount: session.conversationHistory.length,
      },
    };
  }

  /**
   * حذف جلسة - Delete session
   */
  deleteSession(sessionId) {
    return this.sessions.delete(sessionId);
  }

  /**
   * تنظيف الجلسات القديمة - Clean up old sessions
   */
  cleanup() {
    const now = new Date();
    const HOUR_IN_MS = 60 * 60 * 1000;
    let cleanedCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      const inactiveTime = now - session.metadata.lastActivity;
      // حذف الجلسات غير النشطة لأكثر من ساعة
      if (inactiveTime > HOUR_IN_MS) {
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`[SessionManager] Cleaned ${cleanedCount} inactive sessions`);
    }
  }

  /**
   * بدء التنظيف التلقائي - Start auto cleanup
   */
  startCleanup() {
    // تشغيل التنظيف كل ساعة
    setInterval(() => {
      this.cleanup();
      console.log(`[Session Cleanup] Active sessions: ${this.sessions.size}`);
    }, 60 * 60 * 1000);
  }

  /**
   * إحصائيات الجلسات - Session statistics
   */
  getStats() {
    const sessions = Array.from(this.sessions.values());
    return {
      totalSessions: sessions.length,
      completedBookings: sessions.filter((s) =>
        this.isBookingComplete(s.sessionId)
      ).length,
      averageMessages:
        sessions.reduce((sum, s) => sum + s.conversationHistory.length, 0) /
        sessions.length || 0,
      languageDistribution: {
        ar: sessions.filter((s) => s.userInfo.preferredLanguage === "ar")
          .length,
        en: sessions.filter((s) => s.userInfo.preferredLanguage === "en")
          .length,
      },
    };
  }
}

// إنشاء نسخة واحدة (Singleton)
const sessionManager = new SessionManager();

export default sessionManager;
