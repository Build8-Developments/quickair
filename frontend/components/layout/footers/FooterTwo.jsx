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
  const marginStart = isRTL ? { marginLeft: "10px" } : { marginRight: "10px" };

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
    link: {
      color: "rgba(255, 255, 255, 0.85)",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      flexDirection: flexDirection,
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
      display: "flex",
      alignItems: "center",
      gap: "8px",
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
    },
    contactItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      flexDirection: flexDirection,
      textAlign: textAlign,
      marginBottom: "15px",
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
    },
  };

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
          <div className="row y-gap-30 justify-between items-center">
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
                }}
              >
                {t(
                  "footer.companyDescription",
                  "Your trusted travel partner for flights, hotels, and unforgettable experiences."
                )}
              </p>
            </div>

            <div className="col-lg-4 col-md-6">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  flexDirection: flexDirection,
                  justifyContent: isRTL ? "flex-end" : "flex-start",
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
                    1-800-453-6744
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div style={{ textAlign: textAlign }}>
                <div
                  className="text-16 fw-500 mb-15"
                  style={{ color: "#ffffff" }}
                >
                  {t("footer.followUs")}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: isRTL ? "flex-end" : "flex-start",
                  }}
                >
                  <Socials />
                </div>
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
                    <i className="icon-location text-16"></i>
                  </div>
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.85)",
                      lineHeight: "1.6",
                    }}
                  >
                    328 Queensberry Street, North Melbourne VIC3051, Australia.
                  </span>
                </a>
                <a
                  href="mailto:hi@quickair.com"
                  style={footerStyles.contactItem}
                >
                  <div style={footerStyles.contactIcon}>
                    <i className="icon-email text-16"></i>
                  </div>
                  <span style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                    hi@quickair.com
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
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ transform: isRTL ? "rotate(180deg)" : "none" }}
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
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
                  {t("Subscribed successfully!", "Subscribed successfully!")}
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
                    "Failed to subscribe. Please try again.",
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
