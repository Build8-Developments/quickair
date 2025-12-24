"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TripConfirmation() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle navigation when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      router.push(`/${language}`);
    }
  }, [countdown, router, language]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #019fb1 0%, #016d7a 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          background: "white",
          borderRadius: "20px",
          padding: "60px 40px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            width: "100px",
            height: "100px",
            background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 30px",
            animation: "scaleIn 0.5s ease-out",
          }}
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Success Message */}
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#1a1a1a",
            marginBottom: "15px",
            lineHeight: "1.2",
          }}
        >
          {t("تم إرسال طلبك بنجاح!", "Request Sent Successfully!")}
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#666",
            marginBottom: "30px",
            lineHeight: "1.6",
          }}
        >
          {t(
            "شكراً لثقتك في كويك إير! تم إرسال طلب رحلتك بنجاح.",
            "Thank you for trusting QuickAir! Your trip request has been sent successfully."
          )}
        </p>

        {/* Email Confirmation Box */}
        <div
          style={{
            background: "#f0f9ff",
            border: "2px solid #019fb1",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#019fb1"
              strokeWidth="2"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#019fb1",
                margin: 0,
              }}
            >
              {t("تحقق من بريدك الإلكتروني", "Check Your Email")}
            </h3>
          </div>
          <p
            style={{
              fontSize: "15px",
              color: "#555",
              margin: 0,
              lineHeight: "1.6",
            }}
          >
            {t(
              "لقد أرسلنا رسالة تأكيد إلى بريدك الإلكتروني تحتوي على تفاصيل طلبك.",
              "We've sent a confirmation email with your request details."
            )}
          </p>
        </div>

        {/* What's Next */}
        <div
          style={{
            textAlign: language === "ar" ? "right" : "left",
            background: "#fafafa",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "30px",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1a1a1a",
              marginBottom: "15px",
            }}
          >
            {t("ماذا بعد؟", "What's Next?")}
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {[
              {
                ar: "سيقوم فريق الخبراء لدينا بمراجعة طلبك",
                en: "Our expert team will review your request",
              },
              {
                ar: "سنتواصل معك خلال 24 ساعة",
                en: "We'll contact you within 24 hours",
              },
              {
                ar: "سنرسل لك عروض وخيارات مخصصة",
                en: "You'll receive personalized options and quotes",
              },
            ].map((item, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "12px",
                  fontSize: "15px",
                  color: "#555",
                }}
              >
                <span
                  style={{
                    color: "#019fb1",
                    fontSize: "20px",
                    lineHeight: "1",
                  }}
                >
                  ✓
                </span>
                <span>{t(item.ar, item.en)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Countdown */}
        <div
          style={{
            padding: "20px",
            background: "#fff8e6",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              fontSize: "15px",
              color: "#666",
              margin: 0,
            }}
          >
            {t(
              `سيتم توجيهك إلى الصفحة الرئيسية خلال ${countdown} ${
                countdown === 1 ? "ثانية" : "ثواني"
              }`,
              `Redirecting to homepage in ${countdown} second${
                countdown !== 1 ? "s" : ""
              }`
            )}
          </p>
        </div>

        {/* Manual Navigation Button */}
        <button
          onClick={() => router.push(`/${language}`)}
          style={{
            width: "100%",
            padding: "15px",
            background: "linear-gradient(135deg, #019fb1 0%, #016d7a 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
        >
          {t("العودة إلى الصفحة الرئيسية", "Return to Homepage")}
        </button>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
