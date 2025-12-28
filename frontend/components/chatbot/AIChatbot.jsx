"use client";

import { useState, useRef, useEffect } from "react";
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

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState("welcome"); // welcome, userInfo, language, chat, summary
  const [sessionId, setSessionId] = useState(null); // Track session ID
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
  const messagesEndRef = useRef(null);
  const { language } = useLanguage();
  const isArabic = language === "ar";
  
  // Use selected language if available, otherwise use system language
  const chatLanguage = userInfo.preferredLanguage || language;
  const isChatArabic = chatLanguage === "ar";
  const t = (ar, en) => (isChatArabic ? ar : en);

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
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    console.log("Created session:", newSessionId);
    
    // Don't reload page, just change internal language
    setCurrentStep("chat");
    
    // ✅ Initialize chat with welcome message - NO widget initially
    // Let user chat naturally, widgets will appear when they want to book
    const welcomeMessage = lang === "ar"
      ? `أهلاً ${userInfo.name}! 👋\n\nأنا كويك، مساعدك الذكي من Quick Air.\n\nكيف أقدر أساعدك اليوم؟`
      : `Hi ${userInfo.name}! 👋\n\nI'm Quick, your smart assistant from Quick Air.\n\nHow can I help you today?`;
    
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
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Update trip data if provided
        if (data.tripUpdate) {
          setTripData((prev) => ({ ...prev, ...data.tripUpdate }));
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
    setCurrentStep("welcome");
    setSessionId(null);
    setUserInfo({ name: "", email: "", phone: "", preferredLanguage: null });
    setTripData({ destination: null, budget: null, duration: null, travelers: null, preferences: [] });
    setMessages([]);
    setIsOpen(false);
  };

  // Render widget based on type
  const renderWidget = (widget, messageIndex) => {
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
                "سيتم التواصل معك بهذه اللغة طوال المحادثة",
                "We'll communicate with you in this language throughout"
              )}
            </p>
            <div className={styles.languageButtons}>
              <button
                type="button"
                className={styles.languageButton}
                onClick={() => handleLanguageSelect("ar")}
              >
                <span className={styles.languageFlag}>🇸🇦</span>
                <span className={styles.languageName}>العربية</span>
                <span className={styles.languageSubtext}>Arabic</span>
              </button>
              <button
                type="button"
                className={styles.languageButton}
                onClick={() => handleLanguageSelect("en")}
              >
                <span className={styles.languageFlag}>🇬🇧</span>
                <span className={styles.languageName}>English</span>
                <span className={styles.languageSubtext}>الإنجليزية</span>
              </button>
            </div>
          </div>
        );

      case "chat":
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
                    
                    {/* Interactive Widgets */}
                    {message.widget && (
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
                          // Add locale to URL if not already present
                          const locale = userInfo.preferredLanguage || language || 'en';
                          const urlWithLocale = link.url.startsWith(`/${locale}`) 
                            ? link.url 
                            : `/${locale}${link.url}`;
                          
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
              {t("رائع! تم تخطيط رحلتك 🎉", "Great! Your Trip is Planned 🎉")}
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
                <p>👤 {userInfo.name}</p>
                <p>📧 {userInfo.email}</p>
                <p>📱 {userInfo.phone}</p>
              </div>
              
              {tripData.destination && (
                <div className={styles.summaryCard}>
                  <strong>{t("تفاصيل الرحلة", "Trip Details")}</strong>
                  <p>📍 {t("الوجهة:", "Destination:")} {tripData.destination?.name || tripData.destination}</p>
                  {tripData.dates && <p>📅 {t("التاريخ:", "Date:")} {tripData.dates?.startDate} → {tripData.dates?.endDate}</p>}
                  {tripData.budget && <p>💰 {t("الميزانية:", "Budget:")} {tripData.budget?.label || tripData.budget}</p>}
                  {tripData.travelers && <p>👥 {t("المسافرون:", "Travelers:")} {tripData.travelers?.total || tripData.travelers?.adults || tripData.travelers}</p>}
                  {tripData.selectedHotel && <p>🏨 {t("الفندق:", "Hotel:")} {isChatArabic ? tripData.selectedHotel?.hotel_name_ar : tripData.selectedHotel?.hotel_name_en}</p>}
                  {tripData.mealPlan && <p>🍽️ {t("الوجبات:", "Meals:")} {tripData.mealPlan?.label || tripData.mealPlan}</p>}
                  {tripData.roomType && <p>🛏️ {t("الغرفة:", "Room:")} {tripData.roomType?.label || tripData.roomType}</p>}
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
      {/* Floating Chat Button */}
      <button
        className={`${styles.chatButton} ${isOpen ? styles.chatButtonOpen : ""}`}
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

          {/* Content */}
          <div className={styles.chatContent}>
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
}
