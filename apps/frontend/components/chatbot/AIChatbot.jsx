"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./AIChatbot.module.css";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message when chatbot opens for the first time
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: t(
            "مرحباً بك في Quick Air! 👋\n\nأنا مساعدك الذكي لمساعدتك في:\n\n🏝️ اختيار أفضل الوجهات السياحية\n🏨 حجز الفنادق بأفضل الأسعار\n✈️ معلومات عن الرحلات والتأشيرات\n💰 عروض مميزة حصرية\n\nما هي وجهتك المفضلة؟",
            "Welcome to Quick Air! 👋\n\nI'm your intelligent assistant to help you with:\n\n🏝️ Choosing the best destinations\n🏨 Booking hotels at best prices\n✈️ Flight and visa information\n💰 Exclusive special offers\n\nWhat's your preferred destination?"
          ),
        },
      ]);
    }
  }, [isOpen]);

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
          language: isArabic ? "ar" : "en",
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      if (data.success && data.reply) {
        // Add assistant message with links if available
        const assistantMessage = {
          role: "assistant",
          content: data.reply,
          suggestedPages: data.suggestedPages || [], // إضافة الروابط
        };
        setMessages((prev) => [...prev, assistantMessage]);
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    {
      icon: "🏝️",
      label: t("وجهات شاطئية", "Beach Destinations"),
      query: t("أريد وجهة شاطئية مميزة", "I want a great beach destination"),
    },
    {
      icon: "🕌",
      label: t("رحلات ثقافية", "Cultural Trips"),
      query: t("أريد رحلة ثقافية", "I want a cultural trip"),
    },
    {
      icon: "💰",
      label: t("عروض مميزة", "Special Offers"),
      query: t("ما هي أفضل العروض المتاحة؟", "What are the best available offers?"),
    },
    {
      icon: "📞",
      label: t("تواصل معنا", "Contact Us"),
      query: t("أريد التحدث مع فريق الدعم", "I want to speak with support team"),
    },
  ];

  const handleQuickAction = (query) => {
    setInputValue(query);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={`${styles.chatButton} ${isOpen ? styles.chatButtonOpen : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t("مساعد ذكي", "AI Assistant")}
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
        <div className={styles.chatWindow} dir={isArabic ? "rtl" : "ltr"}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderContent}>
              <div className={styles.chatHeaderIcon}>
                <img src="/img/general/logo-light.svg" alt="QuickAir" className={styles.logoImage} />
              </div>
              <div>
                <h3 className={styles.chatTitle}>
                  {t("مساعد QuickAir الذكي", "QuickAir AI Assistant")}
                </h3>
                <p className={styles.chatStatus}>
                  <span className={styles.statusDot}></span>
                  {t("متصل الآن", "Online now")}
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
                    <img src="/img/general/logo-light.svg" alt="AI" />
                  </div>
                )}
                <div className={styles.messageContent}>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
                  
                  {/* عرض الروابط المقترحة */}
                  {message.suggestedPages && message.suggestedPages.length > 0 && (
                    <div className={styles.suggestedLinks}>
                      {message.suggestedPages.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          className={styles.suggestedLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className={styles.linkIcon}>{link.icon}</span>
                          <span className={styles.linkText}>{link.text}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.messageAssistant}`}>
                <div className={styles.messageAvatar}>
                  <img src="/img/general/logo-light.svg" alt="AI" />
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

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className={styles.quickActions}>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={styles.quickActionButton}
                  onClick={() => handleQuickAction(action.query)}
                >
                  <span className={styles.quickActionIcon}>{action.icon}</span>
                  <span className={styles.quickActionLabel}>{action.label}</span>
                </button>
              ))}
            </div>
          )}

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
        </div>
      )}
    </>
  );
}
