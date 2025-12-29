"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepSummary.module.css";

const CURRENCY_SYMBOLS = { USD: "$", EUR: "€", GBP: "£", AED: "AED", EGP: "ج.م" };

export default function StepSummary({ tripData, onEdit, onPrev }) {
  const router = useRouter();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const t = (ar, en) => (isRTL ? ar : en);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: tripData.contact?.name || "",
    email: tripData.contact?.email || "",
    phone: tripData.contact?.phone || "",
  });
  const [error, setError] = useState("");

  const { destination, tripType, travelers = {}, dates = {}, budget = {}, visa = {}, preferences = {}, hotel } = tripData;

  const getTotalTravelers = () => (travelers.adults || 0) + (travelers.children || 0) + (travelers.infants || 0);

  const formatDate = (value) => {
    if (!value) return t("غير محدد", "Not set");
    return new Date(value).toLocaleDateString(isRTL ? "ar-EG" : "en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getNights = () => {
    if (!dates.startDate || !dates.endDate) return 0;
    return Math.ceil((new Date(dates.endDate) - new Date(dates.startDate)) / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async () => {
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      setError(t("يرجى ملء جميع البيانات", "Please fill all fields"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      setError(t("بريد إلكتروني غير صحيح", "Invalid email address"));
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/trip-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...tripData, contact: contactInfo }),
      });
      if (response.ok) {
        router.push("/trip-confirmation");
        return;
      }
      throw new Error("Failed");
    } catch (err) {
      alert(t("حدث خطأ، حاول مرة أخرى", "Something went wrong, please try again"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const SummaryRow = ({ label, value }) => (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value || t("غير محدد", "Not set")}</span>
    </div>
  );

  return (
    <div className="step-content" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="16 8 11 15 8 12" />
          </svg>
        </div>
        <h2 className={styles.title}>{t("أوشكت على الانتهاء!", "Almost there!")}</h2>
        <p className={styles.subtitle}>{t("راجع بياناتك وأرسل الطلب", "Review your details and submit")}</p>
      </div>

      <div className={styles.container}>
        {/* Contact Form */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className={styles.cardTitle}>{t("معلومات الاتصال", "Contact Information")}</span>
          </div>
          <div className={styles.cardBody}>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.inputGroup}>
              <label className={styles.label}>{t("الاسم الكامل", "Full Name")} *</label>
              <input
                type="text"
                className={styles.input}
                placeholder={t("أدخل اسمك", "Enter your name")}
                value={contactInfo.name}
                onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
              />
            </div>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>{t("البريد الإلكتروني", "Email")} *</label>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="example@email.com"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>{t("رقم الهاتف", "Phone")} *</label>
                <input
                  type="tel"
                  className={styles.input}
                  placeholder="+20 123 456 7890"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Trip Overview */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </div>
            <span className={styles.cardTitle}>{t("تفاصيل الرحلة", "Trip Details")}</span>
            <button className={styles.editBtn} onClick={() => onEdit(1)}>
              {t("تعديل", "Edit")}
            </button>
          </div>
          <div className={styles.cardBody}>
            <SummaryRow label={t("الوجهة", "Destination")} value={destination?.name} />
            <SummaryRow label={t("نوع الرحلة", "Trip Type")} value={tripType?.title || tripType?.titleAr} />
            {hotel?.hotel && <SummaryRow label={t("الفندق", "Hotel")} value={hotel.hotel.hotel_name_en} />}
          </div>
        </div>

        {/* Travelers & Dates */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className={styles.cardTitle}>{t("المسافرون والتواريخ", "Travelers & Dates")}</span>
            <button className={styles.editBtn} onClick={() => onEdit(5)}>
              {t("تعديل", "Edit")}
            </button>
          </div>
          <div className={styles.cardBody}>
            <SummaryRow label={t("المسافرون", "Travelers")} value={`${getTotalTravelers()} ${t("أشخاص", "people")}`} />
            {dates.flexible ? (
              <SummaryRow label={t("التواريخ", "Dates")} value={t("مرنة", "Flexible")} />
            ) : (
              <>
                <SummaryRow label={t("المغادرة", "Departure")} value={formatDate(dates.startDate)} />
                <SummaryRow label={t("العودة", "Return")} value={formatDate(dates.endDate)} />
                {getNights() > 0 && <SummaryRow label={t("المدة", "Duration")} value={`${getNights()} ${t("ليالي", "nights")}`} />}
              </>
            )}
          </div>
        </div>

        {/* Budget */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className={styles.cardTitle}>{t("الميزانية", "Budget")}</span>
            <button className={styles.editBtn} onClick={() => onEdit(7)}>
              {t("تعديل", "Edit")}
            </button>
          </div>
          <div className={styles.cardBody}>
            <SummaryRow
              label={t("المبلغ", "Amount")}
              value={budget.amount ? `${CURRENCY_SYMBOLS[budget.currency] || ""}${Number(budget.amount).toLocaleString()}` : null}
            />
            <SummaryRow label={t("النوع", "Type")} value={budget.perPerson ? t("لكل فرد", "Per person") : t("إجمالي", "Total")} />
          </div>
        </div>

        {/* Preferences */}
        {(preferences.activities?.length > 0 || preferences.mealPlan) && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <span className={styles.cardTitle}>{t("التفضيلات", "Preferences")}</span>
              <button className={styles.editBtn} onClick={() => onEdit(9)}>
                {t("تعديل", "Edit")}
              </button>
            </div>
            <div className={styles.cardBody}>
              {preferences.activities?.length > 0 && (
                <SummaryRow label={t("الأنشطة", "Activities")} value={preferences.activities.join(", ")} />
              )}
              {preferences.mealPlan && <SummaryRow label={t("الوجبات", "Meals")} value={preferences.mealPlan} />}
              {preferences.specialRequests && (
                <SummaryRow label={t("طلبات خاصة", "Special Requests")} value={preferences.specialRequests} />
              )}
            </div>
          </div>
        )}

        {/* Notice */}
        <div className={styles.notice}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <div>
            <strong>{t("سنتواصل معك قريباً", "We'll contact you soon")}</strong>
            <p>{t("خلال 24 ساعة بعروض مخصصة", "Within 24 hours with personalized offers")}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button className={styles.backButton} onClick={onPrev}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isRTL ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"} />
          </svg>
          {t("رجوع", "Back")}
        </button>
        <button className={styles.submitButton} onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className={styles.spinner} />
              {t("جاري الإرسال...", "Submitting...")}
            </>
          ) : (
            <>
              {t("إرسال الطلب", "Submit Request")}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
