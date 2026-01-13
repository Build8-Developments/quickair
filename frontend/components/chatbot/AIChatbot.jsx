"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./AIChatbot.module.css";

// Import all booking widgets
import DestinationsWidget from "./widgets/DestinationsWidget";
import DateRangeWidget from "./widgets/DateRangeWidget";
import TravelersWidget from "./widgets/TravelersWidget";
import BudgetWidget from "./widgets/BudgetWidget";
import HotelCardsWidget from "./widgets/HotelCardsWidget";
import MealPlanWidget from "./widgets/MealPlanWidget";
import RoomTypeWidget from "./widgets/RoomTypeWidget";
import BookingSummaryWidget from "./widgets/BookingSummaryWidget";

// LocalStorage keys
const STORAGE_KEYS = {
  SESSION_ID: "quickair_chat_session_id",
  USER_INFO: "quickair_chat_user_info",
  TRIP_DATA: "quickair_chat_trip_data",
  MESSAGES: "quickair_chat_messages",
  CURRENT_STEP: "quickair_chat_current_step",
  POPUP_DISMISSED: "quickair_chat_popup_dismissed",
};

// Popup messages - رسائل جذب الانتباه
const POPUP_MESSAGES = {
  ar: [
    "👋 أهلاً! محتاج مساعدة في تخطيط رحلتك؟",
    "🌴 عروض حصرية على شرم الشيخ ودبي!",
    "✈️ خطط رحلة أحلامك معانا",
    "🎁 خصومات تصل لـ 30% على الرحلات",
    "💬 عندك سؤال؟ أنا هنا للمساعدة!",
    "🏨 أفضل الفنادق بأقل الأسعار",
  ],
  en: [
    "👋 Hi! Need help planning your trip?",
    "🌴 Exclusive deals on Sharm & Dubai!",
    "✈️ Plan your dream trip with us",
    "🎁 Up to 30% off on tours",
    "💬 Got questions? I'm here to help!",
    "🏨 Best hotels at lowest prices",
  ],
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState("welcome");
  const [sessionId, setSessionId] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    preferredLanguage: null,
  });
  const [tripData, setTripData] = useState({
    destination: null,
    budget: null,
    duration: null,
    travelers: null,
    preferences: [],
  });
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Language dropdown state
  const [selectedLang, setSelectedLang] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupDismissed, setPopupDismissed] = useState(false);
  const popupTimerRef = useRef(null);
  const messageIndexRef = useRef(0);
  
  const messagesEndRef = useRef(null);
  const { language } = useLanguage();
  const isArabic = language === "ar";
  
  // Use selected language if available, otherwise use system language
  const chatLanguage = userInfo.preferredLanguage || language;
  const isChatArabic = chatLanguage === "ar";
  const t = (ar, en) => (isChatArabic ? ar : en);

  // ✅ Show popup message
  const showNextPopup = useCallback(() => {
    if (isOpen || popupDismissed) return;
    
    const msgs = isArabic ? POPUP_MESSAGES.ar : POPUP_MESSAGES.en;
    const msg = msgs[messageIndexRef.current % msgs.length];
    setPopupMessage(msg);
    setShowPopup(true);
    messageIndexRef.current++;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 5000);
  }, [isOpen, popupDismissed, isArabic]);

  // ✅ Popup timer - show first popup after 5 seconds, then every 30 seconds
  useEffect(() => {
    // Check if popup was dismissed in this session
    if (typeof window !== "undefined") {
      const dismissed = sessionStorage.getItem(STORAGE_KEYS.POPUP_DISMISSED);
      if (dismissed) {
        setPopupDismissed(true);
        return;
      }
    }
    
    // First popup after 5 seconds
    const initialTimer = setTimeout(() => {
      showNextPopup();
    }, 5000);
    
    // Recurring popups every 30 seconds
    popupTimerRef.current = setInterval(() => {
      showNextPopup();
    }, 30000);
    
    return () => {
      clearTimeout(initialTimer);
      if (popupTimerRef.current) {
        clearInterval(popupTimerRef.current);
      }
    };
  }, [showNextPopup]);

  // ✅ Hide popup when chat opens
  useEffect(() => {
    if (isOpen) {
      setShowPopup(false);
    }
  }, [isOpen]);

  // ✅ Dismiss popup permanently for this session
  const dismissPopup = () => {
    setShowPopup(false);
    setPopupDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEYS.POPUP_DISMISSED, "true");
    }
    if (popupTimerRef.current) {
      clearInterval(popupTimerRef.current);
    }
  };

  // ✅ Load saved data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedSessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
        const savedUserInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
        const savedTripData = localStorage.getItem(STORAGE_KEYS.TRIP_DATA);
        const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
        const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);

        if (savedSessionId) setSessionId(savedSessionId);
        
        // Safely parse JSON with validation
        if (savedUserInfo) {
          try {
            const parsed = JSON.parse(savedUserInfo);
            if (parsed && typeof parsed === 'object') setUserInfo(parsed);
          } catch (e) {
            console.warn("Invalid userInfo in localStorage, clearing...");
            localStorage.removeItem(STORAGE_KEYS.USER_INFO);
          }
        }
        
        if (savedTripData) {
          try {
            const parsed = JSON.parse(savedTripData);
            if (parsed && typeof parsed === 'object') setTripData(parsed);
          } catch (e) {
            console.warn("Invalid tripData in localStorage, clearing...");
            localStorage.removeItem(STORAGE_KEYS.TRIP_DATA);
          }
        }
        
        if (savedMessages) {
          try {
            const parsed = JSON.parse(savedMessages);
            if (Array.isArray(parsed)) setMessages(parsed);
          } catch (e) {
            console.warn("Invalid messages in localStorage, clearing...");
            localStorage.removeItem(STORAGE_KEYS.MESSAGES);
          }
        }
        
        if (savedStep && savedStep !== "welcome") setCurrentStep(savedStep);
        
        console.log("✅ Chat data restored from localStorage");
      } catch (error) {
        console.error("Error loading chat data:", error);
        // Clear all potentially corrupted data
        Object.values(STORAGE_KEYS).forEach(key => {
          try { localStorage.removeItem(key); } catch (e) {}
        });
      }
      setIsInitialized(true);
    }
  }, []);

  // ✅ Save data to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      try {
        if (sessionId) localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
        if (userInfo.name) localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
        if (Object.keys(tripData).some(k => tripData[k])) {
          localStorage.setItem(STORAGE_KEYS.TRIP_DATA, JSON.stringify(tripData));
        }
        if (messages.length > 0) localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
        if (currentStep !== "welcome") localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStep);
      } catch (error) {
        console.error("Error saving chat data:", error);
      }
    }
  }, [sessionId, userInfo, tripData, messages, currentStep, isInitialized]);

  // ✅ Clear all saved data (for restart)
  const clearSavedData = () => {
    if (typeof window !== "undefined") {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log("✅ Chat data cleared from localStorage");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStep]);

  // Handle user info submission
  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    if (userInfo.name && userInfo.email && userInfo.phone) {
      setCurrentStep("language");
    }
  };

  // Handle language selection
  const handleLanguageSelect = async (lang) => {
    console.log("Language selected:", lang);
    setUserInfo({ ...userInfo, preferredLanguage: lang });
    
    // Generate unique session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    setSessionId(newSessionId);
    console.log("Created session:", newSessionId);
    
    // Don't reload page, just change internal language
    setCurrentStep("chat");
    
    // ✅ Welcome messages in all supported languages
    const welcomeMessages = {
      ar: `أهلاً ${userInfo.name}! 👋\n\nأنا كويك، مساعدك الذكي من Quick Air.\n\nكيف أقدر أساعدك اليوم؟`,
      en: `Hi ${userInfo.name}! �\n\nI'm Quوick, your smart assistant from Quick Air.\n\nHow can I help you today?`,
      fr: `Bonjour ${userInfo.name}! 👋\n\nJe suis Quick, votre assistant intelligent de Quick Air.\n\nComment puis-je vous aider aujourd'hui?`,
      de: `Hallo ${userInfo.name}! 👋\n\nIch bin Quick, Ihr intelligenter Assistent von Quick Air.\n\nWie kann ich Ihnen heute helfen?`,
      es: `¡Hola ${userInfo.name}! 👋\n\nSoy Quick, tu asistente inteligente de Quick Air.\n\n¿Cómo puedo ayudarte hoy?`,
      it: `Ciao ${userInfo.name}! 👋\n\nSono Quick, il tuo assistente intelligente di Quick Air.\n\nCome posso aiutarti oggi?`,
      ru: `Привет ${userInfo.name}! 👋\n\nЯ Quick, ваш умный помощник от Quick Air.\n\nКак я могу помочь вам сегодня?`,
      zh: `你好 ${userInfo.name}！👋\n\n我是Quick，来自Quick Air的智能助手。\n\n今天我能帮您什么？`,
      ja: `こんにちは ${userInfo.name}さん！👋\n\n私はQuick、Quick Airのスマートアシスタントです。\n\n今日はどのようにお手伝いできますか？`,
      ko: `안녕하세요 ${userInfo.name}님! 👋\n\n저는 Quick Air의 스마트 어시스턴트 Quick입니다.\n\n오늘 어떻게 도와드릴까요?`,
      pt: `Olá ${userInfo.name}! 👋\n\nSou o Quick, seu assistente inteligente da Quick Air.\n\nComo posso ajudá-lo hoje?`,
      tr: `Merhaba ${userInfo.name}! 👋\n\nBen Quick, Quick Air'den akıllı asistanınız.\n\nBugün size nasıl yardımcı olabilirim?`,
      hi: `नमस्ते ${userInfo.name}! 👋\n\nमैं Quick हूं, Quick Air से आपका स्मार्ट असिस्टेंट।\n\nआज मैं आपकी कैसे मदद कर सकता हूं?`,
      nl: `Hallo ${userInfo.name}! 👋\n\nIk ben Quick, uw slimme assistent van Quick Air.\n\nHoe kan ik u vandaag helpen?`,
      pl: `Cześć ${userInfo.name}! 👋\n\nJestem Quick, Twój inteligentny asystent z Quick Air.\n\nJak mogę Ci dzisiaj pomóc?`,
      th: `สวัสดี ${userInfo.name}! 👋\n\nฉันคือ Quick ผู้ช่วยอัจฉริยะจาก Quick Air\n\nวันนี้ฉันช่วยอะไรคุณได้บ้าง?`,
    };
    
    const welcomeMessage = welcomeMessages[lang] || welcomeMessages.en;
    
    console.log("Setting messages with:", welcomeMessage);
    
    // ✅ Just show welcome message - no widget
    setMessages([
      {
        role: "assistant",
        content: welcomeMessage,
        // No widget here - let user chat first
      },
    ]);
    
    // ✅ No API call needed for initial message
    // User will start chatting and widgets will appear when they want to book
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          language: userInfo.preferredLanguage || (isArabic ? "ar" : "en"),
          conversationHistory: messages,
          userInfo: userInfo,
          tripData: tripData,
          sessionId: sessionId, // Send session ID
        }),
      });

      const data = await response.json();

      if (data.success && data.reply) {
        const assistantMessage = {
          role: "assistant",
          content: data.reply,
          suggestedPages: data.suggestedPages || [],
          tripUpdate: data.tripUpdate || null,
          quickOptions: data.quickOptions || null,
          widget: data.widget || null, // Add widget data from API
          navigation: data.navigation || null, // Add navigation data
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Update trip data if provided
        if (data.tripUpdate) {
          setTripData((prev) => ({ ...prev, ...data.tripUpdate }));
        }

        // ✅ Handle automatic navigation if requested
        if (data.navigation && data.navigation.shouldNavigate && data.navigation.url) {
          // Use site language, not chat language
          const urlWithLocale = data.navigation.url.startsWith(`/${language}`) 
            ? data.navigation.url 
            : `/${language}${data.navigation.url}`;
          
          // Navigate after a short delay to show the message first
          setTimeout(() => {
            window.open(urlWithLocale, '_blank');
          }, 800);
        }

        // Check if conversation is complete
        if (data.isComplete) {
          setTimeout(() => setCurrentStep("summary"), 1000);
        }
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t(
            "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.",
            "Sorry, an error occurred. Please try again."
          ),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quick option selection
  const handleQuickOption = (option) => {
    setInputValue(option.value);
    // Auto send if specified
    if (option.autoSend) {
      setTimeout(() => {
        handleSend();
      }, 100);
    }
  };

  // Send summary email
  const handleSendSummary = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chatbot/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInfo,
          tripData,
          messages,
          language: userInfo.preferredLanguage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        handleReset();
      }
    } catch (error) {
      console.error("Summary error:", error);
      alert(t("حدث خطأ في الإرسال", "Error sending summary"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    clearSavedData(); // ✅ Clear localStorage
    setCurrentStep("welcome");
    setSessionId(null);
    setUserInfo({ name: "", email: "", phone: "", preferredLanguage: null });
    setTripData({ destination: null, budget: null, duration: null, travelers: null, preferences: [] });
    setMessages([]);
    setIsOpen(false);
  };

  // ✅ Restart chat but keep user info
  const handleRestart = () => {
    // Clear trip data and messages but keep user info
    setTripData({ destination: null, budget: null, duration: null, travelers: null, preferences: [] });
    setMessages([]);
    
    // Generate new session
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    setSessionId(newSessionId);
    
    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.TRIP_DATA);
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, newSessionId);
    }
    
    // Show welcome message again
    const lang = userInfo.preferredLanguage || "ar";
    const welcomeMessages = {
      ar: `أهلاً ${userInfo.name}! 👋\n\nتم إعادة تشغيل المحادثة.\n\nكيف أقدر أساعدك؟`,
      en: `Hi ${userInfo.name}! 👋\n\nChat restarted.\n\nHow can I help you?`,
      fr: `Bonjour ${userInfo.name}! 👋\n\nConversation redémarrée.\n\nComment puis-je vous aider?`,
      de: `Hallo ${userInfo.name}! 👋\n\nChat neu gestartet.\n\nWie kann ich helfen?`,
      es: `¡Hola ${userInfo.name}! 👋\n\nChat reiniciado.\n\n¿Cómo puedo ayudarte?`,
    };
    
    setMessages([{
      role: "assistant",
      content: welcomeMessages[lang] || welcomeMessages.en,
    }]);
  };

  // Render widget based on type - only allowed widgets
  const ALLOWED_WIDGETS = ["destinations", "dateRange", "travelers", "budget", "hotelCards", "mealPlan", "roomType", "bookingSummary"];
  
  const renderWidget = (widget, messageIndex) => {
    // ✅ Only render allowed widget types
    if (!widget || !widget.type || !ALLOWED_WIDGETS.includes(widget.type)) {
      return null;
    }
    if (!widget || !widget.type) return null;

    const handleWidgetSelection = async (data) => {
      console.log("Widget selection:", data);
      
      // Extract message string from data
      let selectionMessage;
      if (typeof data === 'string') {
        selectionMessage = data;
      } else if (data.message) {
        selectionMessage = data.message;
      } else if (data.name) {
        selectionMessage = data.name;
      } else if (data.destination) {
        selectionMessage = data.destination;
      } else {
        selectionMessage = JSON.stringify(data);
      }
      
      // Update messages and trip data immediately
      const updatedMessages = [...messages, { role: "user", content: selectionMessage }];
      const updatedTripData = { ...tripData, ...data };
      
      setMessages(updatedMessages);
      setTripData(updatedTripData);
      setIsLoading(true);

      try {
        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: selectionMessage,
            language: userInfo.preferredLanguage || (isArabic ? "ar" : "en"),
            conversationHistory: updatedMessages,
            userInfo: userInfo,
            tripData: updatedTripData,
            sessionId: sessionId,
            widgetSelection: data, // Send widget selection data
          }),
        });

        const responseData = await response.json();

        if (responseData.success && responseData.reply) {
          const assistantMessage = {
            role: "assistant",
            content: responseData.reply,
            suggestedPages: responseData.suggestedPages || [],
            tripUpdate: responseData.tripUpdate || null,
            quickOptions: responseData.quickOptions || null,
            widget: responseData.widget || null,
          };
          setMessages((prev) => [...prev, assistantMessage]);

          // Update trip data if additional updates provided
          if (responseData.tripUpdate) {
            setTripData((prev) => ({ ...prev, ...responseData.tripUpdate }));
          }
        } else {
          throw new Error(responseData.error || "Failed to get response");
        }
      } catch (error) {
        console.error("Widget selection error:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: isChatArabic
              ? "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى."
              : "Sorry, an error occurred. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    const commonProps = {
      language: userInfo.preferredLanguage || "ar",
    };

    switch (widget.type) {
      case "destinations":
        return (
          <DestinationsWidget
            {...commonProps}
            {...widget.props}
            onSelect={handleWidgetSelection}
          />
        );
      
      case "dateRange":
        return (
          <DateRangeWidget
            {...commonProps}
            {...widget.props}
            onSelect={handleWidgetSelection}
          />
        );
      
      case "travelers":
        return (
          <TravelersWidget
            {...commonProps}
            {...widget.props}
            onSelect={handleWidgetSelection}
          />
        );
      
      case "budget":
        return (
          <BudgetWidget
            {...commonProps}
            {...widget.props}
            onSelect={handleWidgetSelection}
          />
        );
      
      case "hotelCards":
        return (
          <HotelCardsWidget
            {...commonProps}
            {...widget.props}
            onSelect={handleWidgetSelection}
          />
        );
      
      case "mealPlan":
        return (
          <MealPlanWidget
            {...commonProps}
            {...widget.props}
            onSelect={handleWidgetSelection}
          />
        );
      
      case "roomType":
        return (
          <RoomTypeWidget
            {...commonProps}
            {...widget.props}
            onSelect={handleWidgetSelection}
          />
        );
      
      case "bookingSummary":
        // Map field names to widget types
        const fieldToWidget = {
          destination: "destinations",
          dates: "dateRange",
          travelers: "travelers",
          budget: "budget",
          hotel: "hotelCards",
          mealPlan: "mealPlan",
          roomType: "roomType"
        };

        // Handle edit - show the appropriate widget
        const handleEdit = (field) => {
          const widgetType = fieldToWidget[field];
          if (!widgetType) return;

          // Clear the field from tripData so user can re-select
          const updatedTripData = { ...tripData };
          if (field === "hotel") {
            delete updatedTripData.selectedHotel;
            delete updatedTripData.hotel;
          } else {
            delete updatedTripData[field];
          }
          setTripData(updatedTripData);

          // Create edit message
          const fieldNames = {
            destination: isChatArabic ? "الوجهة" : "destination",
            dates: isChatArabic ? "التاريخ" : "dates",
            travelers: isChatArabic ? "المسافرين" : "travelers",
            budget: isChatArabic ? "الميزانية" : "budget",
            hotel: isChatArabic ? "الفندق" : "hotel",
            mealPlan: isChatArabic ? "الوجبات" : "meal plan",
            roomType: isChatArabic ? "الغرفة" : "room type"
          };

          const editMessage = isChatArabic 
            ? `تعديل ${fieldNames[field]}`
            : `Edit ${fieldNames[field]}`;

          // Generate the widget data
          let widgetData = { type: widgetType, props: { language: userInfo.preferredLanguage || "ar" } };
          
          // For hotel cards, we need to pass hotels
          if (widgetType === "hotelCards") {
            widgetData.props.hotels = widget.props?.hotels || [];
          }

          // Add message with the edit widget
          setMessages((prev) => [
            ...prev,
            { role: "user", content: editMessage },
            { 
              role: "assistant", 
              content: isChatArabic ? `اختر ${fieldNames[field]} الجديد:` : `Choose new ${fieldNames[field]}:`,
              widget: widgetData
            }
          ]);
        };

        return (
          <BookingSummaryWidget
            {...commonProps}
            bookingData={{ ...widget.props?.bookingData, ...tripData }}
            userInfo={userInfo}
            onConfirm={async () => {
              setIsLoading(true);
              try {
                const response = await fetch("/api/chatbot/confirm", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userInfo,
                    tripData,
                    language: userInfo.preferredLanguage,
                  }),
                });
                const data = await response.json();
                if (data.success) {
                  setMessages((prev) => [
                    ...prev,
                    { 
                      role: "assistant", 
                      content: isChatArabic 
                        ? "تم تأكيد حجزك بنجاح! ✅\n\nتم إرسال تفاصيل الحجز إلى بريدك الإلكتروني وسيتواصل معك فريقنا قريباً."
                        : "Booking confirmed successfully! ✅\n\nBooking details sent to your email and our team will contact you soon."
                    }
                  ]);
                  setTimeout(() => setCurrentStep("summary"), 2000);
                }
              } catch (error) {
                console.error("Confirmation error:", error);
              } finally {
                setIsLoading(false);
              }
            }}
            onEdit={handleEdit}
          />
        );
      
      default:
        return null;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render different steps
  const renderContent = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <div className={styles.welcomeStep}>
            <div className={styles.welcomeIcon}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
            <h2 className={styles.welcomeTitle}>
              {t("مرحباً بك في QuickAir!", "Welcome to QuickAir!")}
            </h2>
            <p className={styles.welcomeText}>
              {t(
                "لنبدأ بتخطيط رحلتك المثالية معاً. أولاً، دعني أتعرف عليك",
                "Let's plan your perfect trip together. First, let me get to know you"
              )}
            </p>
            <form onSubmit={handleUserInfoSubmit} className={styles.userInfoForm}>
              <div className={styles.formGroup}>
                <label>{t("الاسم الكامل", "Full Name")}</label>
                <input
                  type="text"
                  required
                  placeholder={t("أدخل اسمك", "Enter your name")}
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>{t("البريد الإلكتروني", "Email Address")}</label>
                <input
                  type="email"
                  required
                  placeholder={t("example@email.com", "example@email.com")}
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>{t("رقم الهاتف", "Phone Number")}</label>
                <input
                  type="tel"
                  required
                  placeholder={t("+966 XX XXX XXXX", "+966 XX XXX XXXX")}
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                />
              </div>
              <button type="submit" className={styles.submitButton}>
                {t("التالي", "Next")}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
          </div>
        );

      case "language":
        const popularLanguages = [
          { code: "ar", countryCode: "sa", name: "العربية", subtext: "Arabic" },
          { code: "en", countryCode: "gb", name: "English", subtext: "الإنجليزية" },
          { code: "fr", countryCode: "fr", name: "Français", subtext: "French" },
          { code: "de", countryCode: "de", name: "Deutsch", subtext: "German" },
          { code: "es", countryCode: "es", name: "Español", subtext: "Spanish" },
          { code: "it", countryCode: "it", name: "Italiano", subtext: "Italian" },
          { code: "ru", countryCode: "ru", name: "Русский", subtext: "Russian" },
          { code: "zh", countryCode: "cn", name: "中文", subtext: "Chinese" },
          { code: "ja", countryCode: "jp", name: "日本語", subtext: "Japanese" },
          { code: "ko", countryCode: "kr", name: "한국어", subtext: "Korean" },
          { code: "pt", countryCode: "br", name: "Português", subtext: "Portuguese" },
          { code: "tr", countryCode: "tr", name: "Türkçe", subtext: "Turkish" },
          { code: "hi", countryCode: "in", name: "हिन्दी", subtext: "Hindi" },
          { code: "nl", countryCode: "nl", name: "Nederlands", subtext: "Dutch" },
          { code: "pl", countryCode: "pl", name: "Polski", subtext: "Polish" },
          { code: "th", countryCode: "th", name: "ไทย", subtext: "Thai" },
        ];
        
        return (
          <div className={styles.languageStep}>
            <div className={styles.stepIcon}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <h2 className={styles.stepTitle}>
              {t("اختر لغتك المفضلة", "Choose Your Preferred Language")}
            </h2>
            <p className={styles.stepText}>
              {t(
                "نتحدث جميع لغات العالم! اختر لغتك",
                "We speak all languages! Choose yours"
              )}
            </p>
            <div className={styles.languageDropdownWrapper}>
              <button
                type="button"
                className={styles.languageDropdownTrigger}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {selectedLang ? (
                  <>
                    <img 
                      src={`https://flagcdn.com/24x18/${selectedLang.countryCode}.png`}
                      alt={selectedLang.name}
                      className={styles.flagIcon}
                    />
                    <span>{selectedLang.name} - {selectedLang.subtext}</span>
                  </>
                ) : (
                  <span>{t("-- اختر اللغة --", "-- Select Language --")}</span>
                )}
                <div className={`${styles.dropdownArrow} ${dropdownOpen ? styles.dropdownArrowOpen : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </button>
              {dropdownOpen && (
                <div className={styles.languageDropdownMenu}>
                  {popularLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={styles.languageDropdownItem}
                      onClick={() => {
                        setSelectedLang(lang);
                        setDropdownOpen(false);
                        handleLanguageSelect(lang.code);
                      }}
                    >
                      <img 
                        src={`https://flagcdn.com/24x18/${lang.countryCode}.png`}
                        alt={lang.name}
                        className={styles.flagIcon}
                      />
                      <span className={styles.langName}>{lang.name}</span>
                      <span className={styles.langSubtext}>{lang.subtext}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "chat":
        // Find the last message index that has a widget
        const lastWidgetIndex = messages.reduce((lastIdx, msg, idx) => {
          return msg.widget ? idx : lastIdx;
        }, -1);
        
        return (
          <>
            {/* Messages */}
            <div className={styles.chatMessages}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${styles.message} ${
                    message.role === "user" ? styles.messageUser : styles.messageAssistant
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className={styles.messageAvatar}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                      </svg>
                    </div>
                  )}
                  <div className={styles.messageContent}>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
                    
                    {/* Interactive Widgets - Only show the last one */}
                    {message.widget && index === lastWidgetIndex && (
                      <div className={styles.widgetContainer}>
                        {renderWidget(message.widget, index)}
                      </div>
                    )}
                    
                    {/* Quick Options */}
                    {message.quickOptions && message.quickOptions.length > 0 && (
                      <div className={styles.quickOptionsWidget}>
                        {message.quickOptions.map((option, optIndex) => (
                          <button
                            key={optIndex}
                            className={styles.quickOptionBtn}
                            onClick={() => handleQuickOption(option)}
                            disabled={isLoading}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {message.suggestedPages && message.suggestedPages.length > 0 && (
                      <div className={styles.suggestedLinks}>
                        {message.suggestedPages.map((link, linkIndex) => {
                          // Use site language for URLs
                          const urlWithLocale = link.url.startsWith(`/${language}`) 
                            ? link.url 
                            : `/${language}${link.url}`;
                          
                          return (
                            <a
                              key={linkIndex}
                              href={urlWithLocale}
                              className={styles.suggestedLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className={styles.linkText}>{link.text}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className={`${styles.message} ${styles.messageAssistant}`}>
                  <div className={styles.messageAvatar}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={styles.chatInput}>
              <textarea
                className={styles.inputField}
                placeholder={t("اكتب رسالتك هنا...", "Type your message here...")}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
                disabled={isLoading}
              />
              <button
                className={styles.sendButton}
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                aria-label={t("إرسال", "Send")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </>
        );

      case "summary":
        return (
          <div className={styles.summaryStep}>
            <div className={styles.summaryIcon}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className={styles.summaryTitle}>
              {t("رائع! تم تخطيط رحلتك", "Great! Your Trip is Planned")}
            </h2>
            <p className={styles.summaryText}>
              {t(
                "شكراً لاستخدامك مساعدنا الذكي. إليك ملخص رحلتك:",
                "Thank you for using our AI assistant. Here's your trip summary:"
              )}
            </p>
            
            <div className={styles.summaryDetails}>
              <div className={styles.summaryCard}>
                <strong>{t("المعلومات الشخصية", "Personal Info")}</strong>
                <p>{t("الاسم:", "Name:")} {userInfo?.name || "-"}</p>
                <p>{t("البريد الإلكتروني:", "Email:")} {userInfo?.email || "-"}</p>
                <p>{t("رقم الهاتف:", "Phone:")} {userInfo?.phone || "-"}</p>
              </div>
              
              {tripData.destination && (
                <div className={styles.summaryCard}>
                  <strong>{t("تفاصيل الرحلة", "Trip Details")}</strong>
                  <p>{t("الوجهة:", "Destination:")} {tripData.destination?.name || tripData.destination}</p>
                  {tripData.dates && <p>{t("التاريخ:", "Date:")} {tripData.dates?.startDate} - {tripData.dates?.endDate}</p>}
                  {tripData.budget && <p>{t("الميزانية:", "Budget:")} {tripData.budget?.label || tripData.budget}</p>}
                  {tripData.travelers && <p>{t("المسافرون:", "Travelers:")} {tripData.travelers?.total || tripData.travelers?.adults || tripData.travelers}</p>}
                  {tripData.selectedHotel && <p>{t("الفندق:", "Hotel:")} {isChatArabic ? tripData.selectedHotel?.hotel_name_ar : tripData.selectedHotel?.hotel_name_en}</p>}
                  {tripData.mealPlan && <p>{t("الوجبات:", "Meals:")} {tripData.mealPlan?.label || tripData.mealPlan}</p>}
                  {tripData.roomType && <p>{t("الغرفة:", "Room:")} {tripData.roomType?.label || tripData.roomType}</p>}
                </div>
              )}
            </div>

            <button onClick={handleSendSummary} className={styles.summaryButton} disabled={isLoading}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              {t("إرسال الملخص للبريد الإلكتروني", "Send Summary to Email")}
            </button>
            
            <button onClick={handleReset} className={styles.resetButton}>
              {t("بدء رحلة جديدة", "Start New Trip")}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Popup Message Bubble */}
      {showPopup && !isOpen && (
        <div className={styles.popupBubble} dir={isArabic ? "rtl" : "ltr"}>
          <button 
            className={styles.popupClose} 
            onClick={(e) => {
              e.stopPropagation();
              dismissPopup();
            }}
            aria-label="Close"
          >
            ×
          </button>
          <div 
            className={styles.popupContent}
            onClick={() => {
              setShowPopup(false);
              setIsOpen(true);
            }}
          >
            <p>{popupMessage}</p>
          </div>
          <div className={styles.popupArrow}></div>
        </div>
      )}

      {/* Floating Chat Button - hidden on mobile when chat is open */}
      <button
        className={`${styles.chatButton} ${isOpen ? styles.chatButtonOpen : ""} ${isOpen ? styles.chatButtonHiddenMobile : ""} ${showPopup ? styles.chatButtonPulse : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t("مساعد ذكي", "AI Assistant")}
        suppressHydrationWarning
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
        <span className={styles.chatBadge}>AI</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow} dir={chatLanguage === "ar" ? "rtl" : "ltr"}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderContent}>
              <div className={styles.chatHeaderIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div>
                <h3 className={styles.chatTitle}>
                  {t("مساعد QuickAir الذكي", "QuickAir AI Assistant")}
                </h3>
                <p className={styles.chatStatus}>
                  {currentStep === "welcome" && t("ابدأ رحلتك", "Start Your Journey")}
                  {currentStep === "language" && t("اختر اللغة", "Choose Language")}
                  {currentStep === "chat" && (
                    <>
                      <span className={styles.statusDot}></span>
                      {t("جاري التخطيط...", "Planning...")}
                    </>
                  )}
                  {currentStep === "summary" && t("ملخص الرحلة", "Trip Summary")}
                </p>
              </div>
            </div>
            <div className={styles.headerButtons}>
              {/* Restart Button - only show in chat step */}
              {currentStep === "chat" && (
                <button
                  className={styles.restartButton}
                  onClick={handleRestart}
                  aria-label={t("إعادة تشغيل", "Restart")}
                  title={t("إعادة تشغيل المحادثة", "Restart conversation")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                  </svg>
                </button>
              )}
              <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label={t("إغلاق", "Close")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className={styles.chatContent}>
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
}
