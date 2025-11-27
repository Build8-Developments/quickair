"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  X,
  FileText,
  Hotel,
  Calendar,
  Users,
  Ticket,
  CheckCircle,
  ArrowRight,
  Moon,
  User,
  Mail,
  Phone,
  FileEdit,
  Info,
  Shield,
  Clock,
  Headphones,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import styles from "./BookingModal.module.css";

export default function BookingModal({
  isOpen,
  onClose,
  bookingDetails,
  onSubmit,
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName =
        t("booking.fullNameRequired") || "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = t("booking.emailRequired") || "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        t("booking.emailInvalid") || "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        t("booking.phoneRequired") || "Phone number is required";
    } else if (!/^[+]?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone =
        t("booking.phoneInvalid") || "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({ ...formData, ...bookingDetails });
      // Reset form
      setFormData({ fullName: "", email: "", phone: "", specialRequests: "" });
      onClose();
    } catch (error) {
      console.error("Booking submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Enhanced Header with Gradient */}
        <div className={styles.modalHeader}>
          <div>
            <h3 className="text-24 fw-700 mb-5">
              {t("booking.confirmBooking") || "Confirm Your Booking"}
            </h3>
            <p className="text-14 text-light-2">
              {t("booking.almostDone") ||
                "You're almost done! Complete your booking details"}
            </p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Booking Summary */}
          <div className="bookingSummary mb-30">
            <div className={styles["summary-header"]}>
              <FileText size={20} className="text-accent-1" />
              <h5 className="text-18 fw-700 ml-10">
                {t("booking.bookingSummary") || "Booking Summary"}
              </h5>
            </div>

            <div className={styles["summary-grid"]}>
              {/* Hotel Name Card */}
              <div className={styles["summary-card"]}>
                <div className="d-flex items-center">
                  <div className={styles["summary-icon"]}>
                    <Hotel size={22} />
                  </div>
                  <div className="ml-15">
                    <div className="text-12 text-light-2 mb-5">
                      {t("hotel.hotel") || "Hotel"}
                    </div>
                    <div className="text-16 fw-700">
                      {bookingDetails.hotelName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates Card */}
              {bookingDetails.checkInDate && bookingDetails.checkOutDate && (
                <div className={styles["summary-card"]}>
                  <div className="d-flex items-center">
                    <div className={styles["summary-icon"]}>
                      <Calendar size={22} />
                    </div>
                    <div className="ml-15 flex-1">
                      <div className="text-12 text-light-2 mb-5">
                        {t("hotel.dates") || "Dates"}
                      </div>
                      <div className={styles["dates-display"]}>
                        <div className={styles["date-item"]}>
                          <span className="text-13 fw-600">
                            {bookingDetails.checkInDate}
                          </span>
                        </div>
                        <ArrowRight size={12} className="text-accent-1 mx-10" />
                        <div className={styles["date-item"]}>
                          <span className="text-13 fw-600">
                            {bookingDetails.checkOutDate}
                          </span>
                        </div>
                      </div>
                      <div className={styles["nights-indicator"]}>
                        <Moon
                          size={12}
                          className={`${styles.inline} ${styles["mr-5"]}`}
                        />
                        {bookingDetails.nights} {t("hotel.nights") || "nights"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Guests Card */}
              <div className={styles["summary-card"]}>
                <div className="d-flex items-center">
                  <div className={styles["summary-icon"]}>
                    <Users size={22} />
                  </div>
                  <div className="ml-15">
                    <div className="text-12 text-light-2 mb-5">
                      {t("hotel.guests") || "Guests"}
                    </div>
                    <div className={styles["guests-display"]}>
                      <span
                        className={`${styles["guest-badge"]} ${styles.adults}`}
                      >
                        {bookingDetails.adults} {t("hotel.adult") || "Adults"}
                      </span>
                      {bookingDetails.children > 0 && (
                        <span
                          className={`${styles["guest-badge"]} ${styles.children}`}
                        >
                          {bookingDetails.children}{" "}
                          {t("hotel.children") || "Children"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Trips */}
              {bookingDetails.optionalTrips &&
                bookingDetails.optionalTrips.length > 0 && (
                  <div
                    className={`${styles["summary-card"]} ${styles["full-width"]}`}
                  >
                    <div className="d-flex items-start">
                      <div className={styles["summary-icon"]}>
                        <Ticket size={22} />
                      </div>
                      <div className="ml-15 flex-1">
                        <div className="text-12 text-light-2 mb-10">
                          {t("hotel.addExtra") || "Optional Extras"}
                        </div>
                        {bookingDetails.optionalTrips.map((trip, index) => (
                          <div key={index} className={styles["trip-item"]}>
                            <CheckCircle
                              size={14}
                              className="text-accent-1 mr-6"
                            />
                            <span className="text-14 fw-500">{trip.title}</span>
                            <span className={styles["trip-persons"]}>
                              {trip.persons}{" "}
                              {trip.persons > 1
                                ? t("hotel.persons") || "persons"
                                : t("hotel.person") || "person"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Total Price Card */}
            <div className={styles["summary-card-total"]}>
              <div className="d-flex justify-between items-center">
                <div>
                  <div className="text-13 text-light-2 mb-5">
                    {t("booking.totalPrice") || "Total Price"}
                  </div>
                  <div className={styles["price-display"]}>
                    <span className={styles["currency-symbol"]}>
                      {bookingDetails.currency}
                    </span>
                    <span className={styles["price-amount"]}>
                      {bookingDetails.total}
                    </span>
                  </div>
                  <div className="text-11 text-light-2 mt-5">
                    {t("booking.taxesIncluded") ||
                      "All taxes and fees included"}
                  </div>
                </div>
                <div className={styles["total-icon"]}>
                  <CheckCircle size={32} />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit}>
            <div className={styles["form-section-header"]}>
              <User size={18} className="text-accent-1" />
              <h5 className="text-18 fw-700 ml-10">
                {t("booking.contactDetails") || "Contact Details"}
              </h5>
            </div>

            <div className={styles["form-grid"]}>
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>
                  <User size={18} className={styles["mr-6"]} />
                  <span>{t("booking.fullName") || "Full Name"} *</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`${styles["form-control"]} ${
                    errors.fullName ? styles["is-invalid"] : ""
                  }`}
                  placeholder={
                    t("booking.fullNamePlaceholder") || "Enter your full name"
                  }
                />
                {errors.fullName && (
                  <span className={styles["error-message"]}>
                    <AlertCircle
                      size={12}
                      className={`${styles.inline} ${styles["mr-5"]}`}
                    />
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>
                  <Mail
                    size={14}
                    className={`${styles.inline} ${styles["mr-6"]}`}
                  />
                  {t("booking.email") || "Email"} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles["form-control"]} ${
                    errors.email ? styles["is-invalid"] : ""
                  }`}
                  placeholder={
                    t("booking.emailPlaceholder") || "your@email.com"
                  }
                />
                {errors.email && (
                  <span className={styles["error-message"]}>
                    <AlertCircle
                      size={12}
                      className={`${styles.inline} ${styles["mr-5"]}`}
                    />
                    {errors.email}
                  </span>
                )}
              </div>

              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>
                  <Phone
                    size={14}
                    className={`${styles.inline} ${styles["mr-6"]}`}
                  />
                  {t("booking.phone") || "Phone"} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`${styles["form-control"]} ${
                    errors.phone ? styles["is-invalid"] : ""
                  }`}
                  placeholder={
                    t("booking.phonePlaceholder") || "+1 (555) 000-0000"
                  }
                />
                {errors.phone && (
                  <span className={styles["error-message"]}>
                    <AlertCircle
                      size={12}
                      className={`${styles.inline} ${styles["mr-5"]}`}
                    />
                    {errors.phone}
                  </span>
                )}
              </div>

              <div
                className={`${styles["form-group"]} ${styles["full-width"]}`}
              >
                <label className={styles["form-label"]}>
                  <FileEdit
                    size={14}
                    className={`${styles.inline} ${styles["mr-6"]}`}
                  />
                  {t("booking.specialRequests") || "Special Requests"} (
                  {t("booking.optional") || "Optional"})
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className={`${styles["form-control"]} ${styles.textarea}`}
                  placeholder={
                    t("booking.specialRequestsPlaceholder") ||
                    "Any special requirements or preferences?"
                  }
                  rows="3"
                />
              </div>
            </div>

            {/* What Happens Next */}
            <div className={styles["info-box"]}>
              <div className={styles["info-box-header"]}>
                <Info size={18} className="text-accent-1" />
                <span className="text-15 fw-600 ml-10">
                  {t("booking.whatHappensNext") || "What happens next?"}
                </span>
              </div>
              <div className={styles["info-steps"]}>
                <div className={styles["info-step"]}>
                  <div className={styles["step-dot"]}>1</div>
                  <span>
                    {t("booking.step1") ||
                      "We'll receive your booking request instantly"}
                  </span>
                </div>
                <div className={styles["info-step"]}>
                  <div className={styles["step-dot"]}>2</div>
                  <span>
                    {t("booking.step2") ||
                      "Our team will contact you  to confirm"}
                  </span>
                </div>
                <div className={styles["info-step"]}>
                  <div className={styles["step-dot"]}>3</div>
                  <span>
                    {t("booking.step3") || "Receive your booking confirmation"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles["action-buttons"]}>
              <button
                type="button"
                onClick={onClose}
                className={styles["btn-secondary"]}
              >
                <ArrowLeft
                  size={14}
                  className={`${styles.inline} ${styles["mr-6"]}`}
                />
                {t("common.cancel") || "Cancel"}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles["btn-primary"]}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    {t("booking.sending") || "Sending..."}
                  </>
                ) : (
                  <>
                    {t("booking.sendBooking") || "Send Booking Request"}
                    <ArrowUpRight
                      size={14}
                      className={`${styles.inline} ${styles["ml-8"]}`}
                    />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
