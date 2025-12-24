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
  const [errorMessage, setErrorMessage] = useState('');

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
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ name: "", phone: "", email: "", message: "" });
        setTimeout(() => setSubmitStatus(null), 8000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.message || t('حدث خطأ غير متوقع', 'An unexpected error occurred'));
        setTimeout(() => {
          setSubmitStatus(null);
          setErrorMessage('');
        }, 8000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(t('فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.', 'Connection failed. Please check your internet connection.'));
      setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage('');
      }, 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.contactSection}>
      <div className="container">
        <div className="text-center py-20">
          <h1 className="text-30 fw-700 text-blue-1">
            {t('صفحة التواصل', 'Contact Page')}
          </h1>
        </div>
        <div className="row justify-center">
          <div className="col-xl-10 col-lg-11">
            <div className={styles.contactCard}>
              <div className="row">
                {/* Contact Info */}
                <div className="col-lg-5">
                  <div className={styles.contactInfo}>
                    <div className={styles.infoHeader}>
                      <div className={styles.iconWrapper}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                      </div>
                      <h2 className={styles.infoTitle}>
                        {t('تواصل معنا', 'Get in Touch')}
                      </h2>
                      <p className={styles.infoDesc}>
                        {t('نحن هنا لمساعدتك في تخطيط رحلتك المثالية', 'We\'re here to help you plan your perfect trip')}
                      </p>
                    </div>

                    <div className={styles.contactDetails}>
                      <div className={styles.detailItem}>
                        <div className={styles.detailIcon}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className={styles.detailLabel}>{t('الهاتف', 'Phone')}</h4>
                          <p className={styles.detailValue} dir="ltr">+20 123 456 7890</p>
                        </div>
                      </div>

                      <div className={styles.detailItem}>
                        <div className={styles.detailIcon}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className={styles.detailLabel}>{t('البريد الإلكتروني', 'Email')}</h4>
                          <p className={styles.detailValue}>info@quickair.com</p>
                        </div>
                      </div>

                      <div className={styles.detailItem}>
                        <div className={styles.detailIcon}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className={styles.detailLabel}>{t('العنوان', 'Address')}</h4>
                          <p className={styles.detailValue}>
                            {t('القاهرة، مصر', 'Cairo, Egypt')}
                          </p>
                        </div>
                      </div>

                      <div className={styles.detailItem}>
                        <div className={styles.detailIcon}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className={styles.detailLabel}>{t('ساعات العمل', 'Working Hours')}</h4>
                          <p className={styles.detailValue}>
                            {t('السبت - الخميس: 9 صباحاً - 6 مساءً', 'Sat - Thu: 9 AM - 6 PM')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="col-lg-7">
                  <div className={styles.formWrapper}>
                    <h3 className={styles.formTitle}>
                      {t('أرسل لنا رسالة', 'Send us a Message')}
                    </h3>
                    <p className={styles.formSubtitle}>
                      {t('املأ النموذج وسنرد عليك في أقرب وقت', 'Fill out the form and we\'ll get back to you soon')}
                    </p>

                    {submitStatus === 'success' && (
                      <div className={styles.successMessage}>
                        <div className={styles.messageIcon}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                          </svg>
                        </div>
                        <div className={styles.messageContent}>
                          <h4 className={styles.messageTitle}>
                            {t('تم الإرسال بنجاح! ✨', 'Successfully Sent! ✨')}
                          </h4>
                          <p className={styles.messageText}>
                            {t('شكراً لتواصلك معنا! سنرد على رسالتك في أقرب وقت ممكن. تحقق من بريدك الإلكتروني للحصول على نسخة من رسالتك.', 'Thank you for contacting us! We\'ll respond to your message as soon as possible. Check your email for a copy of your message.')}
                          </p>
                        </div>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className={styles.errorMessage}>
                        <div className={styles.messageIcon}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                        </div>
                        <div className={styles.messageContent}>
                          <h4 className={styles.messageTitle}>
                            {t('عذراً، حدث خطأ!', 'Oops, Something Went Wrong!')}
                          </h4>
                          <p className={styles.messageText}>
                            {errorMessage || t('فشل إرسال الرسالة. يرجى التحقق من المعلومات والمحاولة مرة أخرى، أو تواصل معنا مباشرة عبر الهاتف أو البريد الإلكتروني.', 'Failed to send message. Please verify your information and try again, or contact us directly via phone or email.')}
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
                            {t('جاري الإرسال...', 'Sending...')}
                          </h4>
                          <p className={styles.messageText}>
                            {t('يرجى الانتظار بينما نرسل رسالتك', 'Please wait while we send your message')}
                          </p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.contactForm}>
                      <div className="row y-gap-20">
                        <div className="col-md-6">
                          <div className={styles.formGroup}>
                            <label>{t('الاسم', 'Name')}</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder={t('أدخل اسمك', 'Enter your name')}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className={styles.formGroup}>
                            <label>{t('الهاتف', 'Phone')}</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder={t('رقم الهاتف', 'Phone number')}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className={styles.formGroup}>
                            <label>{t('البريد الإلكتروني', 'Email')}</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder={t('بريدك الإلكتروني', 'Your email')}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className={styles.formGroup}>
                            <label>{t('الرسالة', 'Message')}</label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              placeholder={t('كيف يمكننا مساعدتك؟', 'How can we help you?')}
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
                                {t('جاري الإرسال...', 'Sending...')}
                              </>
                            ) : (
                              <>
                                {t('إرسال الرسالة', 'Send Message')}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="22" y1="2" x2="11" y2="13"/>
                                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
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
