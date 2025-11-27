"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

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
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      newErrors.fullName = t("booking.fullNameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("booking.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("booking.emailInvalid");
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("booking.phoneRequired");
    } else if (!/^[+]?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = t("booking.phoneInvalid");
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
      setFormData({ fullName: "", email: "", phone: "" });
      onClose();
    } catch (error) {
      console.error("Booking submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="modalContent -booking"
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="modalHeader">
          <h3 className="text-22 fw-600">{t("booking.confirmBooking")}</h3>
          <button className="modalClose" onClick={onClose}>
            <i className="icon-close text-20"></i>
          </button>
        </div>

        <div className="modalBody">
          {/* Booking Summary */}
          <div className="bookingSummary mb-30">
            <h5 className="text-18 fw-600 mb-20">
              {t("booking.bookingSummary")}
            </h5>

            {/* Hotel Name Card */}
            <div className="summary-card mb-15">
              <div className="d-flex items-center">
                <div className="summary-icon">
                  <i className="icon-hotel text-22"></i>
                </div>
                <div className="ml-15">
                  <div className="text-12 text-light-2 mb-5">
                    {t("hotel.hotel")}
                  </div>
                  <div className="text-16 fw-600">
                    {bookingDetails.hotelName}
                  </div>
                </div>
              </div>
            </div>

            {/* Dates Card */}
            {bookingDetails.checkInDate && bookingDetails.checkOutDate && (
              <div className="summary-card mb-15">
                <div className="d-flex items-center">
                  <div className="summary-icon">
                    <i className="icon-calendar text-22"></i>
                  </div>
                  <div className="ml-15 flex-1">
                    <div className="text-12 text-light-2 mb-5">
                      {t("hotel.dates")}
                    </div>
                    <div className="d-flex items-center gap-10">
                      <div>
                        <div className="text-13 fw-500">
                          {bookingDetails.checkInDate}
                        </div>
                      </div>
                      <i className="icon-arrow-right text-12 text-light-2"></i>
                      <div>
                        <div className="text-13 fw-500">
                          {bookingDetails.checkOutDate}
                        </div>
                      </div>
                    </div>
                    <div className="text-12 text-accent-1 mt-5">
                      {bookingDetails.nights} {t("hotel.nights")}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Guests Card */}
            <div className="summary-card mb-15">
              <div className="d-flex items-center">
                <div className="summary-icon">
                  <i className="icon-user text-22"></i>
                </div>
                <div className="ml-15">
                  <div className="text-12 text-light-2 mb-5">
                    {t("hotel.guests")}
                  </div>
                  <div className="text-15 fw-500">
                    {bookingDetails.adults} {t("hotel.adult")}
                    {bookingDetails.children > 0 &&
                      `, ${bookingDetails.children} ${t("hotel.children")}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Trips */}
            {bookingDetails.optionalTrips &&
              bookingDetails.optionalTrips.length > 0 && (
                <div className="summary-card mb-15">
                  <div className="d-flex items-start">
                    <div className="summary-icon">
                      <i className="icon-ticket text-22"></i>
                    </div>
                    <div className="ml-15 flex-1">
                      <div className="text-12 text-light-2 mb-10">
                        {t("hotel.addExtra")}
                      </div>
                      {bookingDetails.optionalTrips.map((trip, index) => (
                        <div
                          key={index}
                          className="d-flex items-center justify-between mb-8"
                        >
                          <span className="text-14">• {trip.title}</span>
                          <span className="text-13 text-light-2">
                            {trip.persons}{" "}
                            {trip.persons > 1
                              ? t("hotel.persons")
                              : t("hotel.person")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            {/* Total Price Card */}
            <div className="summary-card-total">
              <div className="d-flex justify-between items-center">
                <div>
                  <div className="text-12 text-light-2 mb-5">
                    {t("hotel.total")}
                  </div>
                  <div className="text-24 fw-700 text-accent-1">
                    {bookingDetails.total} {bookingDetails.currency}
                  </div>
                </div>
                <div className="total-icon">
                  <i className="icon-check text-28"></i>
                </div>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <form onSubmit={handleSubmit}>
            <h5 className="text-18 fw-600 mb-20">
              {t("booking.contactDetails") || "Contact Details"}
            </h5>
            <div className="form-group mb-20">
              <label className="text-14 fw-500 mb-10">
                {t("booking.fullName")} *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`form-control ${
                  errors.fullName ? "is-invalid" : ""
                }`}
                placeholder={t("booking.fullNamePlaceholder")}
              />
              {errors.fullName && (
                <span className="text-12 text-red mt-5">{errors.fullName}</span>
              )}
            </div>

            <div className="form-group mb-20">
              <label className="text-14 fw-500 mb-10">
                {t("booking.email")} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder={t("booking.emailPlaceholder")}
              />
              {errors.email && (
                <span className="text-12 text-red mt-5">{errors.email}</span>
              )}
            </div>

            <div className="form-group mb-20">
              <label className="text-14 fw-500 mb-10">
                {t("booking.phone")} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                placeholder={t("booking.phonePlaceholder")}
              />
              {errors.phone && (
                <span className="text-12 text-red mt-5">{errors.phone}</span>
              )}
            </div>

            <div className="d-flex gap-15 mt-30">
              <button
                type="button"
                onClick={onClose}
                className="button col-6 -outline-accent-1 text-accent-1 py-15 rounded-8"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="button col-6 -accent-1 text-white py-15 rounded-8"
                style={{
                  backgroundColor: "var(--color-accent-1)",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? t("booking.sending") : t("booking.sendBooking")}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .modalOverlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .modalContent {
          background: white;
          border-radius: 12px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .modalHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 30px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modalClose {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .modalClose:hover {
          background: #f3f4f6;
        }

        .modalBody {
          padding: 30px;
        }

        .form-control {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .form-control:focus {
          outline: none;
          border-color: var(--color-accent-1);
          box-shadow: 0 0 0 3px rgba(var(--color-accent-1-rgb), 0.1);
        }

        .form-control.is-invalid {
          border-color: #ef4444;
        }

        .text-red {
          color: #ef4444;
          display: block;
        }

        .summary-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px 20px;
          transition: all 0.3s;
        }

        .summary-card:hover {
          background: #f3f4f6;
          border-color: var(--color-accent-1);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .summary-card-total {
          background: linear-gradient(
            135deg,
            rgba(var(--color-accent-1-rgb), 0.1) 0%,
            rgba(var(--color-accent-1-rgb), 0.05) 100%
          );
          border: 2px solid var(--color-accent-1);
          border-radius: 12px;
          padding: 20px;
        }

        .summary-icon {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent-1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .total-icon {
          width: 56px;
          height: 56px;
          background: var(--color-accent-1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        @media (max-width: 768px) {
          .modalContent {
            max-width: 100%;
            margin: 0;
            border-radius: 12px 12px 0 0;
            max-height: 95vh;
          }

          .modalHeader,
          .modalBody {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
