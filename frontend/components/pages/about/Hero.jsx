"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section 
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        background: '#fff',
        position: 'relative',
        padding: '80px 0 60px',
      }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#019fb1',
            padding: '10px 24px',
            borderRadius: '50px',
            marginBottom: '28px',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>
              {isArabic ? "منذ 1986" : "Since 1986"}
            </span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: '800',
            color: '#019fb1',
            lineHeight: 1.2,
            marginBottom: '20px',
          }}>
            {isArabic ? "نحن Quick Air Travel" : "We Are Quick Air Travel"}
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#555',
            lineHeight: 1.7,
            maxWidth: '600px',
            margin: '0 auto 40px',
          }}>
            {isArabic 
              ? "شريكك الموثوق في السفر منذ أكثر من 38 عاماً. نقدم خدمات سياحية متكاملة بمعايير عالمية."
              : "Your trusted travel partner for over 38 years. We provide integrated tourism services with world-class standards."}
          </p>

          {/* Stats Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
          }}>
            {[
              { value: "2M+", label: isArabic ? "عميل سعيد" : "Happy Clients" },
              { value: "38+", label: isArabic ? "سنة خبرة" : "Years Experience" },
              { value: "15+", label: isArabic ? "فرع" : "Branches" },
            ].map((stat, i) => (
              <div key={i} style={{
                textAlign: 'center',
                padding: '0 20px',
                borderRight: i < 2 ? '1px solid #e0e0e0' : 'none',
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#019fb1',
                  lineHeight: 1,
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#888',
                  marginTop: '6px',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
