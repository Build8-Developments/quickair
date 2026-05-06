"use client";

import { useState, useEffect } from "react";
import styles from "./OffersPopup.module.css";

export default function OffersPopup({ language = "ar", onClose, onSubmit }) {
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);
  
  // ✅ Get brand logo based on language
  const brandLogoSrc = `/img/general/${isArabic ? "ar-logo" : "en-logo"}.svg`;

  const [formData, setFormData] = useState({
    contact: "", // Can be email or phone
    preferredContact: "whatsapp" // whatsapp, email, phone
  });

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ Validate contact (email or phone)
  const validateContact = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.contact || !validateContact(formData.contact)) {
      setFormError(t(
        "يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح",
        "Please enter a valid email or phone number"
      ));
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      // ✅ Send lead data to API
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: formData.contact,
          preferredContact: formData.preferredContact,
          source: "offers_popup",
          language: language,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        if (onSubmit) {
          onSubmit(formData);
        }
        // Close popup after 2 seconds
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 2000);
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      console.error("Lead submission error:", error);
      setFormError(t(
        "حدث خطأ. يرجى المحاولة مرة أخرى",
        "An error occurred. Please try again"
      ));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div 
        className={styles.popup} 
        onClick={(e) => e.stopPropagation()}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {!isSuccess ? (
          <>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.logoContainer}>
                <img src={brandLogoSrc} alt="QuickAir" className={styles.logo} />
              </div>
              <h2 className={styles.title}>
                {t("عروض حصرية لك", "Exclusive Offers for You")}
              </h2>
              <p className={styles.subtitle}>
                {t(
                  "اشترك الآن واحصل على أفضل العروض والخصومات الخاصة",
                  "Subscribe now and get the best offers and special discounts"
                )}
              </p>
            </div>

            {/* Offers Preview */}
            <div className={styles.offersPreview}>
              <div className={styles.offerItem}>
                <div className={styles.offerIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                </div>
                <span className={styles.offerText}>
                  {t("خصم حتى 30% على رحلات بالي", "Up to 30% off on Bali trips")}
                </span>
              </div>
              <div className={styles.offerItem}>
                <div className={styles.offerIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
                  </svg>
                </div>
                <span className={styles.offerText}>
                  {t("عروض فنادق 5 نجوم بأسعار خاصة", "5-star hotels at special prices")}
                </span>
              </div>
              <div className={styles.offerItem}>
                <div className={styles.offerIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <span className={styles.offerText}>
                  {t("باقات شهر العسل المميزة", "Premium honeymoon packages")}
                </span>
              </div>
            </div>

            {/* Form */}
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {t("البريد الإلكتروني أو رقم الهاتف", "Email or Phone Number")}
                </label>
                <input
                  type="text"
                  className={`${styles.input} ${formError ? styles.inputError : ""}`}
                  placeholder={t(
                    "example@email.com أو +20 1XX XXX XXXX",
                    "example@email.com or +20 1XX XXX XXXX"
                  )}
                  value={formData.contact}
                  onChange={(e) => {
                    setFormData({ ...formData, contact: e.target.value });
                    setFormError("");
                  }}
                  disabled={isSubmitting}
                />
                {formError && <span className={styles.error}>{formError}</span>}
              </div>

              <div className={styles.contactPreference}>
                <label className={styles.preferenceLabel}>
                  {t("طريقة التواصل المفضلة:", "Preferred contact method:")}
                </label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="preferredContact"
                      value="whatsapp"
                      checked={formData.preferredContact === "whatsapp"}
                      onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                      disabled={isSubmitting}
                    />
                    <span>WhatsApp</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="preferredContact"
                      value="email"
                      checked={formData.preferredContact === "email"}
                      onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                      disabled={isSubmitting}
                    />
                    <span>{t("بريد", "Email")}</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="preferredContact"
                      value="phone"
                      checked={formData.preferredContact === "phone"}
                      onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                      disabled={isSubmitting}
                    />
                    <span>{t("مكالمة", "Call")}</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className={styles.spinner}></span>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13"/>
                      <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
                    </svg>
                    {t("احصل على العروض", "Get Offers")}
                  </>
                )}
              </button>

              <p className={styles.privacy}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                {t(
                  "بياناتك آمنة ومحمية. لن نشارك معلوماتك مع أي طرف ثالث",
                  "Your data is safe and secure. We won't share your info with third parties"
                )}
              </p>
            </form>
          </>
        ) : (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h3 className={styles.successTitle}>
              {t("تم الاشتراك بنجاح!", "Successfully Subscribed!")}
            </h3>
            <p className={styles.successText}>
              {t(
                "سنتواصل معك قريباً بأفضل العروض الحصرية",
                "We'll contact you soon with the best exclusive offers"
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
