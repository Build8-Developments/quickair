"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import Paymentcards from "../components/Paymentcards";
import FooterLinks from "../components/FooterLinks";
import Socials from "../components/Socials";
import Image from "next/image";
import Link from "next/link";

export default function FooterTwo({ locale: serverLocale }) {
  const { t } = useTranslation();
  const { isRTL, language: contextLocale } = useLanguage();
  const locale = serverLocale || contextLocale;
  const [year, setYear] = useState(2024);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setNewsletterEmail('');
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerStyles = {
    footer: {
      background: 'linear-gradient(135deg, #017a8a 0%, #019fb1 50%, #01b5c9 100%)',
      color: '#ffffff',
    },
    topSection: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '30px',
      marginBottom: '40px',
    },
    heading: {
      color: '#ffffff',
      fontWeight: '600',
    },
    link: {
      color: 'rgba(255, 255, 255, 0.85)',
      transition: 'color 0.3s ease',
    },
    newsletterInput: {
      background: 'rgba(255, 255, 255, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px',
      padding: '12px 16px',
      color: '#ffffff',
      width: '100%',
      marginBottom: '10px',
    },
    newsletterButton: {
      background: '#ffffff',
      color: '#019fb1',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    bottomBar: {
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      paddingTop: '20px',
      marginTop: '40px',
    },
  };

  return (
    <footer
      className="footer -type-1 text-white py-60"
      style={{ ...footerStyles.footer, direction: isRTL ? "rtl" : "ltr" }}
    >
      <div className="container">
        {/* Logo and Contact Info Section */}
        <div style={footerStyles.topSection}>
          <div className="row y-gap-30 justify-between items-center">
            <div className="col-lg-4 col-md-6">
              <Link href={`/${locale}`} className="d-block mb-20">
                <Image
                  width="180"
                  height="45"
                  src={`/img/general/${locale === "ar" ? "ar-logo" : "en-logo"}.svg`}
                  alt="QuickAir Logo"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </Link>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.8' }}>
                {t("footer.companyDescription", "Your trusted travel partner for flights, hotels, and unforgettable experiences.")}
              </p>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="row y-gap-15 items-center">
                <div className="col-auto">
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}>
                    <i className="icon-headphone text-24"></i>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="text-14" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{t("footer.speakToExpert")}</div>
                  <div className="text-20 fw-600" style={{ color: '#ffffff' }}>1-800-453-6744</div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div style={{ textAlign: isRTL ? "right" : "left" }}>
                <div className="text-16 fw-500 mb-15" style={{ color: '#ffffff' }}>
                  {t("footer.followUs")}
                </div>
                <Socials />
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="footer__content">
          <div className="row y-gap-40 justify-between">
            <div
              className="col-lg-3 col-md-6"
              style={{ textAlign: isRTL ? "right" : "left" }}
            >
              <h4 className="text-18 fw-600 mb-20" style={footerStyles.heading}>
                {t("footer.contact")}
              </h4>

              <div className="y-gap-10">
                <a className="d-block" href="#" style={footerStyles.link}>
                  <i className="icon-location text-14 mr-10"></i>
                  328 Queensberry Street, North Melbourne VIC3051, Australia.
                </a>
                <a className="d-block mt-15" href="mailto:hi@quickair.com" style={footerStyles.link}>
                  <i className="icon-email text-14 mr-10"></i>
                  hi@quickair.com
                </a>
              </div>
            </div>

            <FooterLinks locale={locale} />

            <div
              className="col-lg-3 col-md-6"
              style={{ textAlign: isRTL ? "right" : "left" }}
            >
              <h4 className="text-18 fw-600 mb-20" style={footerStyles.heading}>
                {t("footer.newsletter")}
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: '20px' }}>
                {t("footer.newsletterText")}
              </p>

              <form onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t("footer.emailPlaceholder")}
                  required
                  disabled={isSubmitting}
                  style={footerStyles.newsletterInput}
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={footerStyles.newsletterButton}
                >
                  {isSubmitting ? '...' : t("footer.send")}
                </button>
              </form>
              {submitStatus === 'success' && (
                <p style={{ color: '#a7f3d0', marginTop: '10px', fontSize: '14px' }}>
                  ✓ {t("Subscribed successfully!", "Subscribed successfully!")}
                </p>
              )}
              {submitStatus === 'error' && (
                <p style={{ color: '#fca5a5', marginTop: '10px', fontSize: '14px' }}>
                  ✗ {t("Failed to subscribe. Please try again.", "Failed to subscribe. Please try again.")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={footerStyles.bottomBar}>
          <div className="row y-gap-10 justify-between items-center">
            <div className="col-auto">
              <div style={{ opacity: 0.85 }}>
                © {t("footer.copyright")} {year}
              </div>
            </div>

            <div className="col-auto">
              <div className="footer__images d-flex items-center x-gap-10">
                <Paymentcards />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
