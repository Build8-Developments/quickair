"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", email: "", message: "" });
        setTimeout(() => setSubmitStatus(null), 8000);
      } else {
        setSubmitStatus("error");
        setErrorMessage(
          data.message || t("حدث خطأ غير متوقع", "An unexpected error occurred")
        );
        setTimeout(() => {
          setSubmitStatus(null);
          setErrorMessage("");
        }, 8000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setErrorMessage(
        t(
          "فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.",
          "Connection failed. Please check your internet connection."
        )
      );
      setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage("");
      }, 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRTL = language === "ar";

  return (
    <section className={styles.contactSection} dir={isRTL ? "rtl" : "ltr"}>
      <div className="container">
        <div className="row justify-center">
          <div className="col-xl-10 col-lg-11">
            <div className={styles.contactCard}>
              <div className="row">
                {/* Contact Info */}
                <div className="col-lg-5">
                  <div className={styles.contactInfo}>
                    <div className={styles.infoHeader}>
                      <div className={styles.iconWrapper}>
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <h2 className={styles.infoTitle}>
                        {t("تواصل معنا", "Get in Touch")}
                      </h2>
                      <p className={styles.infoDesc}>
                        {t(
                          "نحن هنا لمساعدتك في تخطيط رحلتك المثالية. تواصل معنا وسنرد عليك في أقرب وقت.",
                          "We're here to help you plan your perfect trip. Reach out and we'll respond as soon as possible."
                        )}
                      </p>
                    </div>

                    <div className={styles.contactDetails}>
                      <div className={styles.detailItem}>
                        <div className={styles.detailIcon}>
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className={styles.detailLabel}>
                            {t("الهاتف", "Phone")}
                          </h4>
                          <p className={styles.detailValue} dir="ltr">
                            19102
                          </p>
                        </div>
                      </div>

                      <div className={styles.detailItem}>
                        <div className={styles.detailIcon}>
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </div>
                        <div>
                          <h4 className={styles.detailLabel}>
                            {t("البريد الإلكتروني", "Email")}
                          </h4>
                          <p className={styles.detailValue}>
                            19102@quickair.travel
                          </p>
                        </div>
                      </div>

                      <div className={styles.detailItem}>
                        <div className={styles.detailIcon}>
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </div>
                        <div>
                          <h4 className={styles.detailLabel}>
                            {t("العنوان", "Address")}
                          </h4>
                          <p className={styles.detailValue}>
                            {t("القاهرة، مصر", "Cairo, Egypt")}
                          </p>
                        </div>
                      </div>

                      <div className={styles.detailItem}>
                        <div className={styles.detailIcon}>
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </div>
                        <div>
                          <h4 className={styles.detailLabel}>
                            {t("ساعات العمل", "Working Hours")}
                          </h4>
                          <p className={styles.detailValue}>
                            {t(
                              "السبت - الخميس: 9 ص - 6 م",
                              "Sat - Thu: 9 AM - 6 PM"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className={styles.socialLinks}>
                      <a
                        href="#"
                        className={styles.socialLink}
                        aria-label="Facebook"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className={styles.socialLink}
                        aria-label="Instagram"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="2"
                            y="2"
                            width="20"
                            height="20"
                            rx="5"
                            ry="5"
                          />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className={styles.socialLink}
                        aria-label="Twitter"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className={styles.socialLink}
                        aria-label="WhatsApp"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="col-lg-7">
                  <div className={styles.formWrapper}>
                    <div className={styles.formHeader}>
                      <div className={styles.formIconWrapper}>
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </div>
                      <h3 className={styles.formTitle}>
                        {t("أرسل لنا رسالة", "Send us a Message")}
                      </h3>
                      <p className={styles.formSubtitle}>
                        {t(
                          "املأ النموذج وسنرد عليك في أقرب وقت",
                          "Fill out the form and we'll get back to you soon"
                        )}
                      </p>
                    </div>

                    {submitStatus === "success" && (
                      <div className={styles.successMessage}>
                        <div className={styles.messageIcon}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        </div>
                        <div className={styles.messageContent}>
                          <h4 className={styles.messageTitle}>
                            {t("تم الإرسال بنجاح!", "Successfully Sent!")}
                          </h4>
                          <p className={styles.messageText}>
                            {t(
                              "شكراً لتواصلك معنا! سنرد على رسالتك في أقرب وقت ممكن.",
                              "Thank you for contacting us! We'll respond to your message as soon as possible."
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {submitStatus === "error" && (
                      <div className={styles.errorMessage}>
                        <div className={styles.messageIcon}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                        </div>
                        <div className={styles.messageContent}>
                          <h4 className={styles.messageTitle}>
                            {t(
                              "عذراً، حدث خطأ!",
                              "Oops, Something Went Wrong!"
                            )}
                          </h4>
                          <p className={styles.messageText}>
                            {errorMessage ||
                              t(
                                "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.",
                                "Failed to send message. Please try again."
                              )}
                          </p>
                        </div>
                      </div>
                    )}

                    {isSubmitting && (
                      <div className={styles.sendingMessage}>
                        <div className={styles.messageIcon}>
                          <span className={styles.spinner}></span>
                        </div>
                        <div className={styles.messageContent}>
                          <h4 className={styles.messageTitle}>
                            {t("جاري الإرسال...", "Sending...")}
                          </h4>
                          <p className={styles.messageText}>
                            {t(
                              "يرجى الانتظار بينما نرسل رسالتك",
                              "Please wait while we send your message"
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    <form
                      onSubmit={handleSubmit}
                      className={styles.contactForm}
                    >
                      <div className="row y-gap-20">
                        <div className="col-md-6">
                          <div className={styles.formGroup}>
                            <label>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              {t("الاسم", "Name")}
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder={t("أدخل اسمك", "Enter your name")}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className={styles.formGroup}>
                            <label>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
                              </svg>
                              {t("الهاتف", "Phone")}
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder={t("رقم الهاتف", "Phone number")}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className={styles.formGroup}>
                            <label>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                              </svg>
                              {t("البريد الإلكتروني", "Email")}
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder={t("بريدك الإلكتروني", "Your email")}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className={styles.formGroup}>
                            <label>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                              {t("الرسالة", "Message")}
                            </label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              placeholder={t(
                                "كيف يمكننا مساعدتك؟",
                                "How can we help you?"
                              )}
                              rows="5"
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-12">
                          <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <span className={styles.spinner}></span>
                                {t("جاري الإرسال...", "Sending...")}
                              </>
                            ) : (
                              <>
                                {t("إرسال الرسالة", "Send Message")}
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <line x1="22" y1="2" x2="11" y2="13" />
                                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
