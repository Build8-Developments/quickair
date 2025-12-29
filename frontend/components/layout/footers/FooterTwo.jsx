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
  const [newsletterEmail, setNewsletterEmail] = useState("");
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
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
        setNewsletterEmail("");
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const textAlign = isRTL ? "right" : "left";
  const flexDirection = isRTL ? "row-reverse" : "row";

  const footerStyles = {
    footer: {
      background:
        "linear-gradient(145deg, #015f6b 0%, #017a8a 30%, #019fb1 70%, #01b5c9 100%)",
      color: "#ffffff",
      position: "relative",
      overflow: "hidden",
    },
    footerOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)",
      pointerEvents: "none",
    },
    topSection: {
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      padding: "35px",
      marginBottom: "50px",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      color: "#ffffff",
      fontWeight: "600",
      textAlign: textAlign,
    },
    newsletterInput: {
      background: "rgba(255, 255, 255, 0.15)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "12px",
      padding: "14px 18px",
      color: "#ffffff",
      width: "100%",
      marginBottom: "12px",
      fontSize: "15px",
      textAlign: textAlign,
      direction: isRTL ? "rtl" : "ltr",
    },
    newsletterButton: {
      background: "#ffffff",
      color: "#019fb1",
      border: "none",
      borderRadius: "12px",
      padding: "14px 28px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "15px",
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      flexDirection: flexDirection,
    },
    bottomBar: {
      borderTop: "1px solid rgba(255, 255, 255, 0.2)",
      paddingTop: "25px",
      marginTop: "50px",
    },
    iconBox: {
      width: "54px",
      height: "54px",
      background:
        "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)",
      borderRadius: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ffffff",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      flexShrink: 0,
    },
    contactItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      flexDirection: flexDirection,
      textAlign: textAlign,
      marginBottom: "15px",
      textDecoration: "none",
    },
    contactIcon: {
      width: "40px",
      height: "40px",
      background: "rgba(255, 255, 255, 0.15)",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      color: "#ffffff",
    },
  };

  // Arrow icon that points right in EN and left in AR
  const ArrowIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {isRTL ? (
        <>
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </>
      ) : (
        <>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </>
      )}
    </svg>
  );

  return (
    <footer
      className="footer -type-1 text-white py-60"
      style={footerStyles.footer}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div style={footerStyles.footerOverlay}></div>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Logo and Contact Info Section */}
        <div style={footerStyles.topSection}>
          <div className="row y-gap-30 items-center">
            {/* Logo Column */}
            <div className="col-lg-4 col-md-6" style={{ textAlign: textAlign }}>
              <Link href={`/${locale}`} className="d-block mb-20">
                <Image
                  width="180"
                  height="45"
                  src={`/img/general/${
                    locale === "ar" ? "ar-logo" : "en-logo"
                  }.svg`}
                  alt="QuickAir Logo"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </Link>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  lineHeight: "1.8",
                  textAlign: textAlign,
                  margin: 0,
                }}
              >
                {t("footer.companyDescription")}
              </p>
            </div>

            {/* Phone Column */}
            <div className="col-lg-4 col-md-6" style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "15px",
                  flexDirection: flexDirection,
                }}
              >
                <div style={footerStyles.iconBox}>
                  <i className="icon-headphone text-24"></i>
                </div>
                <div style={{ textAlign: textAlign }}>
                  <div
                    className="text-14"
                    style={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    {t("footer.speakToExpert")}
                  </div>
                  <div
                    className="text-20 fw-600"
                    style={{ color: "#ffffff" }}
                    dir="ltr"
                  >
                    19102
                  </div>
                </div>
              </div>
            </div>

            {/* Social Column */}
            <div
              className="col-lg-4 col-md-12 col-12"
              style={{ textAlign: textAlign }}
            >
              <div
                className="footer-social-wrapper"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isRTL ? "flex-end" : "flex-start",
                }}
              >
                <style jsx>{`
                  @media (max-width: 991px) {
                    .footer-social-wrapper {
                      align-items: center !important;
                      text-align: center !important;
                      width: 100%;
                      margin-top: 10px;
                    }
                  }
                `}</style>
                <div
                  className="text-16 fw-500 mb-15"
                  style={{ color: "#ffffff", textAlign: "inherit" }}
                >
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
            <div className="col-lg-3 col-md-6" style={{ textAlign: textAlign }}>
              <h4 className="text-18 fw-600 mb-20" style={footerStyles.heading}>
                {t("footer.contact")}
              </h4>

              <div className="y-gap-10">
                <a href="#" style={footerStyles.contactItem}>
                  <div style={footerStyles.contactIcon}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.85)",
                      lineHeight: "1.6",
                    }}
                  >
                    {t(
                      "footer.address",
                      "328 Queensberry Street, North Melbourne VIC3051, Australia."
                    )}
                  </span>
                </a>
                <a
                  href="mailto:19102@quickair.travel"
                  style={footerStyles.contactItem}
                >
                  <div style={footerStyles.contactIcon}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <span style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                    {t("footer.email", "19102@quickair.travel")}
                  </span>
                </a>
              </div>
            </div>

            <FooterLinks locale={locale} />

            <div className="col-lg-3 col-md-6" style={{ textAlign: textAlign }}>
              <h4 className="text-18 fw-600 mb-20" style={footerStyles.heading}>
                {t("footer.newsletter")}
              </h4>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.85)",
                  marginBottom: "20px",
                  lineHeight: "1.7",
                }}
              >
                {t("footer.newsletterText")}
              </p>

              <form onSubmit={handleNewsletterSubmit}>
                <style jsx>{`
                  input::placeholder {
                    color: rgba(255, 255, 255, 0.5) !important;
                  }
                `}</style>
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
                  style={{
                    ...footerStyles.newsletterButton,
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <span>...</span>
                  ) : (
                    <>
                      <span>{t("footer.send")}</span>
                      <ArrowIcon />
                    </>
                  )}
                </button>
              </form>
              {submitStatus === "success" && (
                <p
                  style={{
                    color: "#a7f3d0",
                    marginTop: "12px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexDirection: flexDirection,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  {t("footer.subscribedSuccess", "Subscribed successfully!")}
                </p>
              )}
              {submitStatus === "error" && (
                <p
                  style={{
                    color: "#fca5a5",
                    marginTop: "12px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexDirection: flexDirection,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  {t(
                    "footer.subscribedError",
                    "Failed to subscribe. Please try again."
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={footerStyles.bottomBar}>
          <div className="row y-gap-10 justify-between items-center">
            <div className="col-auto" style={{ textAlign: textAlign }}>
              <div style={{ opacity: 0.85 }}>
                © {t("footer.copyright")} {year}
              </div>
            </div>

            <div className="col-auto">
              <div
                className="footer__images d-flex items-center x-gap-10"
                style={{ flexDirection: flexDirection }}
              >
                <Paymentcards />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
