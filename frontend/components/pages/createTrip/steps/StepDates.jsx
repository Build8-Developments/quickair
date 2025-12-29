"use client";

import { useState } from "react";
import { Calendar } from "react-multi-date-picker";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepDates.module.css";

export default function StepDates({ data, onUpdate, onNext, onPrev }) {
  const [dates, setDates] = useState(data || {});
  const [activeCalendar, setActiveCalendar] = useState(null);
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const t = (ar, en) => (isRTL ? ar : en);

  const today = new Date();
  const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const handleDateSelect = (date) => {
    const selectedDate = date?.toDate?.() || date;
    const dateStr = selectedDate ? selectedDate.toISOString().split("T")[0] : null;

    if (activeCalendar === "start") {
      const newDates = { ...dates, startDate: dateStr };
      if (dates.endDate && new Date(dateStr) >= new Date(dates.endDate)) {
        newDates.endDate = null;
      }
      setDates(newDates);
      onUpdate(newDates);
    } else {
      const newDates = { ...dates, endDate: dateStr };
      setDates(newDates);
      onUpdate(newDates);
    }
    setActiveCalendar(null);
  };

  const handleFlexibleToggle = () => {
    const newDates = { ...dates, flexible: !dates.flexible };
    setDates(newDates);
    onUpdate(newDates);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return t("اختر", "Select");
    const d = new Date(dateStr);
    return d.toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateNights = () => {
    if (!dates.startDate || !dates.endDate) return 0;
    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const isValidDates = () => {
    if (dates.flexible) return true;
    return dates.startDate && dates.endDate && calculateNights() > 0;
  };

  const nights = calculateNights();

  return (
    <div className="step-content" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          {t("متى تريد السفر؟", "When do you want to travel?")}
        </h2>
        <p className={styles.subtitle}>
          {t("اختر تواريخ رحلتك أو اجعلها مرنة", "Pick your dates or stay flexible")}
        </p>
      </div>

      <div className={styles.container}>
        {/* Flexible Toggle */}
        <div
          className={`${styles.flexibleCard} ${dates.flexible ? styles.flexibleActive : ""}`}
          onClick={handleFlexibleToggle}
        >
          <div className={styles.flexibleContent}>
            <div className={styles.flexibleIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className={styles.flexibleText}>
              <span className={styles.flexibleTitle}>
                {t("تواريخي مرنة", "My dates are flexible")}
              </span>
              <span className={styles.flexibleDesc}>
                {t("احصل على عروض أفضل", "Get better deals")}
              </span>
            </div>
          </div>
          <div className={`${styles.toggle} ${dates.flexible ? styles.toggleActive : ""}`}>
            <div className={styles.toggleKnob} />
          </div>
        </div>

        {/* Date Selectors */}
        {!dates.flexible && (
          <div className={styles.dateSection}>
            <div className={styles.dateInputs}>
              {/* Start Date */}
              <div
                className={`${styles.dateSelector} ${dates.startDate ? styles.hasValue : ""}`}
                onClick={() => setActiveCalendar("start")}
              >
                <div className={styles.dateInfo}>
                  <span className={styles.dateLabel}>{t("تاريخ المغادرة", "Departure")}</span>
                  <span className={styles.dateValue}>{formatDate(dates.startDate)}</span>
                </div>
                <svg className={styles.calendarIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>

              {/* End Date */}
              <div
                className={`${styles.dateSelector} ${dates.endDate ? styles.hasValue : ""}`}
                onClick={() => setActiveCalendar("end")}
              >
                <div className={styles.dateInfo}>
                  <span className={styles.dateLabel}>{t("تاريخ العودة", "Return")}</span>
                  <span className={styles.dateValue}>{formatDate(dates.endDate)}</span>
                </div>
                <svg className={styles.calendarIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>

            {/* Nights Info */}
            {nights > 0 && (
              <div className={styles.nightsInfo}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span>
                  {nights} {t(nights === 1 ? "ليلة" : "ليالي", nights === 1 ? "night" : "nights")}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button className={styles.backButton} onClick={onPrev}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isRTL ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"} />
          </svg>
          {t("رجوع", "Back")}
        </button>
        <button
          className={`${styles.continueButton} ${!isValidDates() ? styles.disabled : ""}`}
          onClick={onNext}
          disabled={!isValidDates()}
        >
          {t("متابعة", "Continue")}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isRTL ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
          </svg>
        </button>
      </div>

      {/* Calendar Modal */}
      {activeCalendar && (
        <div className={styles.overlay} onClick={() => setActiveCalendar(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span>
                {activeCalendar === "start"
                  ? t("تاريخ المغادرة", "Departure Date")
                  : t("تاريخ العودة", "Return Date")}
              </span>
              <button className={styles.closeButton} onClick={() => setActiveCalendar(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.calendarWrapper}>
              <Calendar
                value={activeCalendar === "start" ? (dates.startDate ? new Date(dates.startDate) : null) : (dates.endDate ? new Date(dates.endDate) : null)}
                onChange={handleDateSelect}
                minDate={activeCalendar === "end" && dates.startDate ? new Date(dates.startDate) : today}
                maxDate={maxDate}
                weekDays={isRTL
                  ? ["ح", "ن", "ث", "ر", "خ", "ج", "س"]
                  : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
                }
                months={isRTL
                  ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
                  : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
