"use client";

import { useState } from "react";
import { Calendar } from "react-multi-date-picker";
import styles from "./DateRangeWidget.module.css";

export default function DateRangeWidget({ language = "ar", onSelect }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activeCalendar, setActiveCalendar] = useState(null); // 'start' | 'end' | null
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  const today = new Date();
  const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end - start;
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (nights < 0 || nights > 365) return -1;
    return nights;
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleConfirm = () => {
    const nights = calculateNights();
    if (startDate && endDate && nights > 0) {
      const startStr = new Date(startDate).toISOString().split('T')[0];
      const endStr = new Date(endDate).toISOString().split('T')[0];
      onSelect({
        dates: {
          startDate: startStr,
          endDate: endStr,
          nights,
        },
        message: `${startStr} → ${endStr} (${nights} ${nights === 1 ? 'night' : 'nights'})`,
      });
    }
  };

  const nights = calculateNights();

  const CalendarIcon = () => (
    <svg className={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  return (
    <div className={styles.widget} dir={isArabic ? "rtl" : "ltr"}>
      <div className={styles.dateInputs}>
        {/* Start Date */}
        <div 
          className={`${styles.dateSelector} ${startDate ? styles.hasValue : ''}`}
          onClick={() => setActiveCalendar('start')}
        >
          <div className={styles.dateInfo}>
            <span className={styles.dateLabel}>{t("تاريخ البداية", "Start Date")}</span>
            <span className={styles.dateValue}>
              {startDate ? formatDate(startDate) : t("اختر", "Select")}
            </span>
          </div>
          <CalendarIcon />
        </div>

        {/* End Date */}
        <div 
          className={`${styles.dateSelector} ${endDate ? styles.hasValue : ''}`}
          onClick={() => setActiveCalendar('end')}
        >
          <div className={styles.dateInfo}>
            <span className={styles.dateLabel}>{t("تاريخ النهاية", "End Date")}</span>
            <span className={styles.dateValue}>
              {endDate ? formatDate(endDate) : t("اختر", "Select")}
            </span>
          </div>
          <CalendarIcon />
        </div>
      </div>

      {nights > 0 && nights <= 365 && (
        <div className={styles.nightsInfo}>
          <span>{nights} {t(nights === 1 ? "ليلة" : "ليالي", nights === 1 ? "night" : "nights")}</span>
        </div>
      )}

      <button
        className={styles.confirmButton}
        onClick={handleConfirm}
        disabled={!startDate || !endDate || nights <= 0}
      >
        {t("تأكيد", "Confirm")}
      </button>

      {/* Calendar Modal */}
      {activeCalendar && (
        <div className={styles.calendarOverlay} onClick={() => setActiveCalendar(null)}>
          <div className={styles.calendarModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.calendarHeader}>
              <span>{activeCalendar === 'start' ? t("تاريخ البداية", "Start Date") : t("تاريخ النهاية", "End Date")}</span>
              <button className={styles.closeBtn} onClick={() => setActiveCalendar(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={styles.calendarWrapper}>
              <Calendar
                value={activeCalendar === 'start' ? startDate : endDate}
                onChange={(date) => {
                  const selectedDate = date?.toDate?.() || date;
                  if (activeCalendar === 'start') {
                    setStartDate(selectedDate);
                    if (endDate && new Date(selectedDate) >= new Date(endDate)) {
                      setEndDate(null);
                    }
                  } else {
                    setEndDate(selectedDate);
                  }
                  setActiveCalendar(null);
                }}
                minDate={activeCalendar === 'end' && startDate ? new Date(startDate) : today}
                maxDate={maxDate}
                weekDays={isArabic 
                  ? ["ح", "ن", "ث", "ر", "خ", "ج", "س"]
                  : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
                }
                months={isArabic
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
