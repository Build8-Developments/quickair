"use client";

import { useState } from "react";
import styles from "./BookingSummaryWidget.module.css";

export default function BookingSummaryWidget({ 
  bookingData = {}, 
  tripData = {},
  userInfo = {},
  language = "ar", 
  onConfirm,
  onEdit,
  onUserInfoUpdate
}) {
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  // ✅ Local state for user info form
  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    preferredLanguage: userInfo?.preferredLanguage || language
  });

  const [formErrors, setFormErrors] = useState({});
  const [showForm, setShowForm] = useState(true);

  // Support both bookingData and tripData props
  const data = Object.keys(bookingData).length > 0 ? bookingData : tripData;
  const { destination, dates, travelers, budget, selectedHotel, hotel, mealPlan, roomType } = data;
  const hotelData = selectedHotel || hotel;

  // ✅ Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = t("الاسم مطلوب (حرفين على الأقل)", "Name required (min 2 characters)");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = t("البريد الإلكتروني غير صحيح", "Invalid email address");
    }
    
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      errors.phone = t("رقم الهاتف غير صحيح (10 أرقام على الأقل)", "Invalid phone (min 10 digits)");
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Update parent component with user info
      if (onUserInfoUpdate) {
        onUserInfoUpdate(formData);
      }
      setShowForm(false);
      // Call confirm after a short delay
      setTimeout(() => {
        if (onConfirm) {
          onConfirm();
        }
      }, 300);
    }
  };

  // ✅ Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Edit button component
  const EditBtn = ({ field }) => (
    <button 
      className={styles.editBtn} 
      onClick={() => onEdit && onEdit(field)}
      title={t("تعديل", "Edit")}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </button>
  );

  return (
    <div className={styles.widget} dir={isArabic ? "rtl" : "ltr"}>
      <div className={styles.summaryHeader}>
        <h3 className={styles.title}>{t("ملخص الحجز", "Booking Summary")}</h3>
      </div>

      <div className={styles.sections}>
        {/* ✅ User Info Form - Always show at top */}
        {showForm && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {t("بياناتك للتواصل", "Your Contact Info")}
              </div>
            </div>
            <div className={styles.formContainer}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  {t("الاسم الكامل", "Full Name")} <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={`${styles.formInput} ${formErrors.name ? styles.inputError : ""}`}
                  placeholder={t("أدخل اسمك الكامل", "Enter your full name")}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {formErrors.name && <span className={styles.errorText}>{formErrors.name}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  {t("البريد الإلكتروني", "Email")} <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  className={`${styles.formInput} ${formErrors.email ? styles.inputError : ""}`}
                  placeholder={t("example@email.com", "example@email.com")}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {formErrors.email && <span className={styles.errorText}>{formErrors.email}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  {t("رقم الهاتف", "Phone Number")} <span className={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  className={`${styles.formInput} ${formErrors.phone ? styles.inputError : ""}`}
                  placeholder={t("+20 1XX XXX XXXX", "+20 1XX XXX XXXX")}
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
                {formErrors.phone && <span className={styles.errorText}>{formErrors.phone}</span>}
              </div>

              <div className={styles.privacyNote}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" width="16" height="16">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>{t("بياناتك آمنة ومحمية معنا", "Your data is safe and secure with us")}</span>
              </div>
            </div>
          </div>
        )}

        {/* Show user info summary if form is hidden */}
        {!showForm && (formData.name || formData.email || formData.phone) && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {t("بيانات العميل", "Customer Info")}
              </div>
              <button 
                className={styles.editBtn} 
                onClick={() => setShowForm(true)}
                title={t("تعديل", "Edit")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
            <div className={styles.details}>
              {formData.name && <div className={styles.detailValue}>{t("الاسم:", "Name:")} {formData.name}</div>}
              {formData.email && <div className={styles.detailValue}>{t("الإيميل:", "Email:")} {formData.email}</div>}
              {formData.phone && <div className={styles.detailValue}>{t("الهاتف:", "Phone:")} {formData.phone}</div>}
            </div>
          </div>
        )}

        {/* Trip Details - Destination */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {t("الوجهة", "Destination")}
            </div>
            <EditBtn field="destination" />
          </div>
          <div className={styles.details}>
            <div className={styles.detailValue}>
              {destination?.name || destination || t("غير محدد", "Not set")}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {t("التاريخ", "Dates")}
            </div>
            <EditBtn field="dates" />
          </div>
          <div className={styles.details}>
            <div className={styles.detailValue}>
              {dates?.startDate 
                ? `${dates.startDate} → ${dates.endDate || "..."} (${dates.nights || "?"} ${t("ليالي", "nights")})`
                : t("غير محدد", "Not set")
              }
            </div>
          </div>
        </div>

        {/* Travelers */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {t("المسافرون", "Travelers")}
            </div>
            <EditBtn field="travelers" />
          </div>
          <div className={styles.details}>
            <div className={styles.detailValue}>
              {travelers 
                ? `${travelers?.adults || travelers?.total || travelers} ${t("بالغ", "adult(s)")}${travelers?.children > 0 ? ` + ${travelers.children} ${t("طفل", "child")}` : ""}`
                : t("غير محدد", "Not set")
              }
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                <path d="M12 18V6"/>
              </svg>
              {t("الميزانية", "Budget")}
            </div>
            <EditBtn field="budget" />
          </div>
          <div className={styles.details}>
            <div className={styles.detailValue}>
              {budget 
                ? (budget.label || budget.message || (
                    budget.minEGP && budget.maxEGP 
                      ? `${(budget.minEGP / 1000).toFixed(0)}-${(budget.maxEGP / 1000).toFixed(0)}${t(" ألف", "K")}` 
                      : budget.minEGP 
                        ? `${(budget.minEGP / 1000).toFixed(0)}+${t(" ألف", "K")}`
                        : budget
                  ))
                : t("غير محدد", "Not set")
              }
            </div>
          </div>
        </div>

        {/* Hotel */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
              </svg>
              {t("الفندق", "Hotel")}
            </div>
            <EditBtn field="hotel" />
          </div>
          <div className={styles.details}>
            <div className={styles.detailValue}>
              {hotelData 
                ? `${isArabic ? hotelData.hotel_name_ar : hotelData.hotel_name_en || hotelData.name || hotelData}${hotelData.stars ? ` ${"⭐".repeat(hotelData.stars)}` : ""}`
                : t("غير محدد", "Not set")
              }
            </div>
            {hotelData?.price_egp && (
              <div className={styles.priceTag}>
                {hotelData.price_egp?.toLocaleString()} {t("ج.م", "EGP")}
              </div>
            )}
          </div>
        </div>

        {/* Meal Plan */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/>
                <line x1="10" y1="1" x2="10" y2="4"/>
                <line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
              {t("الوجبات", "Meals")}
            </div>
            <EditBtn field="mealPlan" />
          </div>
          <div className={styles.details}>
            <div className={styles.detailValue}>
              {mealPlan?.label || mealPlan || t("غير محدد", "Not set")}
            </div>
          </div>
        </div>

        {/* Room Type */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/>
                <path d="M21 7H3l2-4h14l2 4z"/>
                <path d="M12 4v3"/>
              </svg>
              {t("الغرفة", "Room")}
            </div>
            <EditBtn field="roomType" />
          </div>
          <div className={styles.details}>
            <div className={styles.detailValue}>
              {roomType?.label || roomType || t("غير محدد", "Not set")}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button className={styles.confirmButton} onClick={handleSubmit}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          {t("تأكيد الحجز", "Confirm Booking")}
        </button>
      </div>
    </div>
  );
}
