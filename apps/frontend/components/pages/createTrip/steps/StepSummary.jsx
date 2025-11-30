"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepSummary.module.css";

const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "AED",
  EGP: "ج.م",
};

export default function StepSummary({ tripData, onEdit, onPrev }) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: tripData.contact?.name || "",
    email: tripData.contact?.email || "",
    phone: tripData.contact?.phone || "",
  });
  const [contactError, setContactError] = useState("");

  const {
    destination,
    tripType,
    travelers = {},
    dates = {},
    budget = {},
    visa = {},
    preferences = {},
  } = tripData;

  const getTotalTravelers = () => {
    const { adults = 0, children = 0, infants = 0 } = travelers;
    return adults + children + infants;
  };

  const getDuration = () => {
    if (dates.flexible) return t("تواريخ مرنة", "Flexible dates");
    if (!dates.startDate || !dates.endDate) return t("غير محدد", "Not specified");

    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.max(1, Math.ceil((end - start) / msPerDay));
    return `${days} ${language === "ar" ? "أيام" : "days"}`;
  };

  const formatDate = (value) => {
    if (!value) return t("غير محدد", "Not specified");
    return new Date(value).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const currencySymbol = CURRENCY_SYMBOLS[budget.currency] || "";

  const getActivitiesExtraLabel = () => {
    if (!preferences.activities || preferences.activities.length <= 3) return "";
    const extra = preferences.activities.length - 3;
    return language === "ar" ? ` +${extra} أخرى` : ` +${extra} more`;
  };

  const handleSubmit = async () => {
    // Validate contact information
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      setContactError(
        t(
          "يرجى ملء جميع معلومات الاتصال",
          "Please fill in all contact information"
        )
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      setContactError(
        t(
          "يرجى إدخال بريد إلكتروني صحيح",
          "Please enter a valid email address"
        )
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setContactError("");
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/trip-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...tripData,
          contact: contactInfo,
        }),
      });

      if (response.ok) {
        router.push("/trip-confirmation");
        return;
      }

      throw new Error("Trip submission failed");
    } catch (error) {
      console.error("Error submitting trip:", error);
      alert(
        t(
          "حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.",
          "There was an error submitting your request. Please try again."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="step-content">
      <div className="text-center mb-40">
        <div className={`${styles.summaryIconWrapper} mb-20`}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="16 8 11 15 8 12" />
          </svg>
        </div>
        <h2 className="text-30 fw-700 text-dark-1 mb-10">
          {t("أوشكنا على الانتهاء!", "Almost there!")}
        </h2>
        <p className="text-16 text-dark-2">
          {t(
            "راجع اختياراتك وسنقوم بتصميم رحلتك المثالية",
            "Review your selections and we'll craft your perfect trip"
          )}
        </p>
      </div>

      <div className="row justify-center">
        <div className="col-xl-10">
          {/* Contact Information */}
          <div className={`${styles.summaryCard} mb-30`}>
            <div className={styles.cardHeader}>
              <div className={styles.headerContent}>
                <div className={styles.cardIconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h3 className="text-20 fw-600 text-dark-1">
                  {t("معلومات الاتصال", "Contact Information")}
                </h3>
              </div>
            </div>
            <div className={styles.cardContent}>
              {contactError && (
                <div className="mb-20" style={{ padding: "12px 16px", backgroundColor: "#fee", borderLeft: "4px solid #f44", borderRadius: "8px" }}>
                  <p className="text-15 text-red-1 mb-0">{contactError}</p>
                </div>
              )}
              <div className="row">
                <div className="col-12 mb-20">
                  <label className="text-15 fw-500 text-dark-1 mb-10">
                    {t("الاسم الكامل", "Full Name")} *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("أدخل اسمك الكامل", "Enter your full name")}
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    style={{
                      padding: "12px 16px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "15px",
                      width: "100%",
                    }}
                  />
                </div>
                <div className="col-md-6 mb-20">
                  <label className="text-15 fw-500 text-dark-1 mb-10">
                    {t("البريد الإلكتروني", "Email Address")} *
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder={t("example@email.com", "example@email.com")}
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    style={{
                      padding: "12px 16px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "15px",
                      width: "100%",
                    }}
                  />
                </div>
                <div className="col-md-6 mb-20">
                  <label className="text-15 fw-500 text-dark-1 mb-10">
                    {t("رقم الهاتف", "Phone Number")} *
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder={t("+20 123 456 7890", "+1 234 567 8900")}
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    style={{
                      padding: "12px 16px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "15px",
                      width: "100%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trip Overview */}
          <div className={`${styles.summaryCard} mb-30`}>
            <div className={styles.cardHeader}>
              <div className={styles.headerContent}>
                <div className={styles.cardIconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                  </svg>
                </div>
                <h3 className="text-20 fw-600 text-dark-1">
                  {t("نظرة عامة على الرحلة", "Trip Overview")}
                </h3>
              </div>
              <button className={styles.editButton} onClick={() => onEdit(1)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                {t("تعديل", "Edit")}
              </button>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>{t("الوجهة", "Destination")}</span>
                <span className={styles.summaryValue}>
                  {destination?.name || t("غير محدد", "Not specified")}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>{t("نوع الرحلة", "Trip Type")}</span>
                <span className={styles.summaryValue}>
                  {tripType?.title || t("غير محدد", "Not specified")}
                </span>
              </div>
            </div>
          </div>

          {/* Travelers & Dates */}
          <div className={`${styles.summaryCard} mb-30`}>
            <div className={styles.cardHeader}>
              <div className={styles.headerContent}>
                <div className={styles.cardIconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h3 className="text-20 fw-600 text-dark-1">
                  {t("المسافرون والتواريخ", "Travelers & Dates")}
                </h3>
              </div>
              <button className={styles.editButton} onClick={() => onEdit(5)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                {t("تعديل", "Edit")}
              </button>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>{t("إجمالي المسافرين", "Total Travelers")}</span>
                <span className={styles.summaryValue}>
                  {getTotalTravelers()} {t("أشخاص", "people")}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>{t("البالغون", "Adults")}</span>
                <span className={styles.summaryValue}>{travelers.adults || 0}</span>
              </div>
              {travelers.children > 0 && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>{t("الأطفال", "Children")}</span>
                  <span className={styles.summaryValue}>{travelers.children}</span>
                </div>
              )}
              {travelers.infants > 0 && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>{t("الرضع", "Infants")}</span>
                  <span className={styles.summaryValue}>{travelers.infants}</span>
                </div>
              )}
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>{t("المدة", "Duration")}</span>
                <span className={styles.summaryValue}>{getDuration()}</span>
              </div>
              {!dates.flexible && dates.startDate && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>{t("تاريخ المغادرة", "Departure Date")}</span>
                  <span className={styles.summaryValue}>{formatDate(dates.startDate)}</span>
                </div>
              )}
              {!dates.flexible && dates.endDate && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>{t("تاريخ العودة", "Return Date")}</span>
                  <span className={styles.summaryValue}>{formatDate(dates.endDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Budget */}
          <div className={`${styles.summaryCard} mb-30`}>
            <div className={styles.cardHeader}>
              <div className={styles.headerContent}>
                <div className={styles.cardIconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="text-20 fw-600 text-dark-1">
                  {t("الميزانية", "Budget")}
                </h3>
              </div>
              <button className={styles.editButton} onClick={() => onEdit(7)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                {t("تعديل", "Edit")}
              </button>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>{t("قيمة الميزانية", "Budget Amount")}</span>
                <span className={`${styles.summaryValue} ${styles.summaryValueHighlight}`}>
                  {currencySymbol}
                  {budget.amount ? Number(budget.amount).toLocaleString() : " -- "}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>{t("نوع الميزانية", "Budget Type")}</span>
                <span className={styles.summaryValue}>
                  {budget.perPerson
                    ? t("لكل فرد", "Per person")
                    : t("ميزانية الرحلة الكاملة", "Total trip budget")}
                </span>
              </div>
            </div>
          </div>

          {/* Visa */}
          <div className={`${styles.summaryCard} mb-30`}>
            <div className={styles.cardHeader}>
              <div className={styles.headerContent}>
                <div className={styles.cardIconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="2" width="18" height="20" rx="2" ry="2" />
                    <path d="M7 7h10" />
                    <path d="M7 11h10" />
                    <path d="M7 15h6" />
                  </svg>
                </div>
                <h3 className="text-20 fw-600 text-dark-1">
                  {t("متطلبات التأشيرة", "Visa Requirements")}
                </h3>
              </div>
              <button className={styles.editButton} onClick={() => onEdit(8)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                {t("تعديل", "Edit")}
              </button>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>{t("هل تريد تأشيرة؟", "Visa Needed")}</span>
                <span className={styles.summaryValue}>
                  {visa.needed === null && t("غير محدد", "Not specified")}
                  {visa.needed === true && t("نعم", "Yes")}
                  {visa.needed === false && t("لا", "No")}
                </span>
              </div>
              {visa.needed === true && (
                <>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>{t("هل معك تأشيرة؟", "Have Visa")}</span>
                    <span className={styles.summaryValue}>
                      {visa.hasVisa ? t("نعم", "Yes") : t("لا", "No")}
                    </span>
                  </div>
                  {visa.hasVisa === false && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>{t("مساعدة مطلوبة", "Assistance Required")}</span>
                      <span className={styles.summaryValue}>
                        {visa.assistanceRequired ? t("نعم", "Yes") : t("لا", "No")}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className={`${styles.summaryCard} mb-30`}>
            <div className={styles.cardHeader}>
              <div className={styles.headerContent}>
                <div className={styles.cardIconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <h3 className="text-20 fw-600 text-dark-1">
                  {t("تفضيلاتك", "Your Preferences")}
                </h3>
              </div>
              <button className={styles.editButton} onClick={() => onEdit(9)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                {t("تعديل", "Edit")}
              </button>
            </div>
            <div className={styles.cardContent}>
              {preferences.accommodation?.length > 0 && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>{t("الإقامة", "Accommodation")}</span>
                  <span className={styles.summaryValue}>
                    {preferences.accommodation.join(", ")}
                  </span>
                </div>
              )}
              {preferences.activities?.length > 0 && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>{t("الأنشطة", "Activities")}</span>
                  <span className={styles.summaryValue}>
                    {preferences.activities.slice(0, 3).join(", ")}
                    {getActivitiesExtraLabel()}
                  </span>
                </div>
              )}
              {preferences.mealPlan && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>{t("خطة الوجبات", "Meal Plan")}</span>
                  <span className={styles.summaryValue}>{preferences.mealPlan}</span>
                </div>
              )}
              {preferences.specialRequests && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>{t("طلبات خاصة", "Special Requests")}</span>
                  <span className={styles.summaryValue}>{preferences.specialRequests}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Notice */}
          <div className={`${styles.contactNotice} rounded-16 p-30 mb-30`}>
            <div className="text-center">
              <div className={`${styles.contactNoticeIcon} mb-15`}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h4 className="text-18 fw-600 text-dark-1 mb-10">
                {t("سنتواصل معك قريبًا!", "We'll Contact You Soon!")}
              </h4>
              <p className="text-15 text-dark-2">
                {t(
                  "سيقوم خبراؤنا بمراجعة طلبك والتواصل معك خلال 24 ساعة بخيارات وعروض مخصصة",
                  "Our travel experts will review your request and reach out within 24 hours with personalized options and quotes."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`d-flex justify-between mt-40 ${styles.buttonStack}`}>
        <button
          className={`button -md -outline-dark-1 text-dark-1 px-40 py-15 rounded-12 ${styles.actionButton} ${styles.outlineButton} ${styles.fullWidthButton}`}
          onClick={onPrev}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {t("رجوع", "Back")}
        </button>
        <button
          className={`button -md -dark-1 bg-accent-1 text-white px-50 py-15 rounded-12 ${
            isSubmitting ? "opacity-50" : ""
          } ${styles.actionButton} ${styles.accentButton} ${styles.fullWidthButton}`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner}></span>
              {t("جاري الإرسال...", "Submitting...")}
            </>
          ) : (
            <>
              {t("إرسال الطلب", "Submit Request")}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
