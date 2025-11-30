"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import Paymentcards from "../components/Paymentcards";
import FooterLinks from "../components/FooterLinks";
import Socials from "../components/Socials";
import Image from "next/image";

export default function FooterTwo() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
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

  return (
    <footer
      className="footer -type-1 -dark bg-dark-1 text-white"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <div className="footer__main">
        <div className="footer__bg">
          <Image
            width="1800"
            height="627"
            src="/img/footer/1/bg.svg"
            alt="image"
          />
        </div>

        <div className="container">
          <div className="footer__info">
            <div className="row y-gap-20 justify-between">
              <div className="col-auto">
                <div className="row y-gap-20 items-center">
                  <div className="col-auto">
                    <i className="icon-headphone text-50"></i>
                  </div>

                  <div className="col-auto">
                    <div className="text-20 fw-500">
                      {t("footer.speakToExpert")}{" "}
                      <span className="">1-800-453-6744</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-auto">
                <div
                  className={`footerSocials ${isRTL ? "text-right" : ""}`}
                  style={{ direction: isRTL ? "rtl" : "ltr" }}
                >
                  <div className="footerSocials__title">
                    {t("footer.followUs")}
                  </div>

                  <div className="footerSocials__icons">
                    <Socials />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer__content">
            <div className="row y-gap-40 justify-between">
              <div
                className="col-lg-4 col-md-6"
                style={{ textAlign: isRTL ? "right" : "left" }}
              >
                <h4 className="text-20 fw-500">{t("footer.contact")}</h4>

                <div className="y-gap-10 mt-20">
                  <a className="d-block" href="#">
                    328 Queensberry Street, North Melbourne VIC3051, Australia.
                  </a>
                  <a className="d-block" href="#">
                    hi@quickair.com
                  </a>
                </div>
              </div>

              <FooterLinks />

              <div
                className="col-lg-3 col-md-6"
                style={{ textAlign: isRTL ? "right" : "left" }}
              >
                <h4 className="text-20 fw-500">{t("footer.newsletter")}</h4>
                <p className="mt-20">{t("footer.newsletterText")}</p>

                <form onSubmit={handleNewsletterSubmit} className="footer__newsletter">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={t("footer.emailPlaceholder")}
                    required
                    disabled={isSubmitting}
                  />
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '...' : t("footer.send")}
                  </button>
                </form>
                {submitStatus === 'success' && (
                  <p style={{ color: '#22c55e', marginTop: '10px', fontSize: '14px' }}>
                    ✓ {t("Subscribed successfully!", "Subscribed successfully!")}
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p style={{ color: '#ef4444', marginTop: '10px', fontSize: '14px' }}>
                    ✗ {t("Failed to subscribe. Please try again.", "Failed to subscribe. Please try again.")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="footer__bottom">
          <div className="row y-gap-5 justify-between items-center">
            <div className="col-auto">
              <div>
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
