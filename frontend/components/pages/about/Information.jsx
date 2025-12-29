"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// SVG Icon Components
const KaabaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="6" width="16" height="14" rx="1"/>
    <path d="M4 10h16"/>
    <path d="M12 2v4"/>
    <circle cx="12" cy="4" r="1"/>
  </svg>
);

const PlaneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
  </svg>
);

const BeachIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 21H6.5c-.5 0-1-.2-1.3-.6L2 17h20l-3.2 3.4c-.3.4-.8.6-1.3.6z"/>
    <path d="M12 12V3"/>
    <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
    <path d="M4 12h16"/>
  </svg>
);

const MapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/>
    <line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
);

const ShipIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
    <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
    <path d="M12 10v4"/>
    <path d="M12 2v3"/>
  </svg>
);

const BusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6v6"/>
    <path d="M16 6v6"/>
    <path d="M2 12h20"/>
    <path d="M7 18h.01"/>
    <path d="M17 18h.01"/>
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 8h20"/>
  </svg>
);

const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const RocketIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

const DiamondIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 13L2 9z"/>
    <path d="M2 9h20"/>
    <path d="M12 22L6 9"/>
    <path d="M12 22l6-13"/>
  </svg>
);

const LightbulbIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const CompassIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

const TicketIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
    <path d="M13 5v2"/>
    <path d="M13 17v2"/>
    <path d="M13 11v2"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2"/>
    <line x1="2" x2="22" y1="10" y2="10"/>
  </svg>
);

export default function Information() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const services = [
    {
      icon: <KaabaIcon />,
      title: isArabic ? "الحج والعمرة" : "Pilgrimage & Omra",
      desc: isArabic 
        ? "برامج متنوعة من الاقتصادية إلى الفاخرة مع أفضل خدمة والتزام"
        : "Programs from low-budget to exclusive deluxe with best service and commitment"
    },
    {
      icon: <PlaneIcon />,
      title: isArabic ? "تذاكر الطيران" : "Airline Tickets",
      desc: isArabic 
        ? "حجز وإصدار تذاكر لمعظم شركات الطيران مع خدمة التوصيل والتعديلات"
        : "Ticket issue for most airlines, delivery, amendments, refunds & travel advice"
    },
    {
      icon: <BeachIcon />,
      title: isArabic ? "السياحة الترفيهية" : "Leisure Travel",
      desc: isArabic 
        ? "حلول مخصصة وجاهزة محلياً ودولياً لجميع أنواع الرحلات"
        : "Tailor made & readymade solutions domestically or internationally"
    },
    {
      icon: <MapIcon />,
      title: isArabic ? "الرحلات السياحية" : "Excursions",
      desc: isArabic 
        ? "برامج رحلات شاملة بجميع اللغات الرئيسية مع مرشدين خبراء"
        : "Full excursion programs in all major languages with skilled guides"
    },
    {
      icon: <ShipIcon />,
      title: isArabic ? "الرحلات البحرية" : "Cruises",
      desc: isArabic 
        ? "برامج رحلات نيلية متنوعة في الأقصر وأسوان بأسعار تنافسية"
        : "Variety of cruise programs at Luxor & Aswan at competitive rates"
    },
    {
      icon: <BusIcon />,
      title: isArabic ? "النقل والمواصلات" : "Transportation",
      desc: isArabic 
        ? "خدمات نقل للأفراد والمجموعات على مدار العام بأسطول فاخر"
        : "Transfers for individuals and groups 365 days a year with luxury fleet"
    },
  ];

  const values = [
    {
      icon: <TargetIcon />,
      title: isArabic ? "رؤيتنا" : "Our Vision",
      desc: isArabic 
        ? "قيمة مقابل المال وتقديم خدمات عالية الجودة تفوق توقعات عملائنا الكرام"
        : "Value for money & to provide quality services that exceeds expectations of our esteemed customers"
    },
    {
      icon: <RocketIcon />,
      title: isArabic ? "هدفنا" : "Our Purpose",
      desc: isArabic 
        ? "أن نكون رائدين في مجال السياحة من خلال تقديم خدمات محسنة وعلاقات متميزة"
        : "To be a leader in tourism field by providing enhanced services, relationships and profitability"
    },
    {
      icon: <DiamondIcon />,
      title: isArabic ? "مهمتنا" : "Our Mission",
      desc: isArabic 
        ? "بناء علاقات طويلة الأمد مع عملائنا وتقديم خدمة عملاء استثنائية"
        : "Build long term relationships with our customers & provide exceptional customer service"
    },
  ];

  const eMarketFeatures = [
    { icon: <CompassIcon />, label: isArabic ? "صمم رحلتك" : "Design Your Trip" },
    { icon: <TicketIcon />, label: isArabic ? "حجز التذاكر" : "Book Tickets" },
    { icon: <LocationIcon />, label: isArabic ? "استكشف الأماكن" : "Explore Places" },
    { icon: <CreditCardIcon />, label: isArabic ? "الدفع الإلكتروني" : "Online Payment" },
  ];

  return (
    <section className="layout-pt-lg layout-pb-lg" dir={isArabic ? "rtl" : "ltr"}>
      <div className="container">
        {/* Main Introduction */}
        <div className="row y-gap-30 justify-between items-center">
          <div className="col-lg-6">
            <div style={{
              background: 'linear-gradient(135deg, #019fb1 0%, #017a8a 100%)',
              borderRadius: '20px',
              padding: '40px',
              color: '#fff',
            }}>
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
              }}>
                {isArabic ? "منذ عام 1986" : "Since 1986"}
              </span>
              <h2 style={{ fontSize: '32px', fontWeight: '700', marginTop: '20px', lineHeight: '1.3', color: '#fff' }}>
                {isArabic 
                  ? "كويك إير للسفريات - شريكك الموثوق منذ أكثر من 38 عاماً"
                  : "Quick Air Travel - Your Trusted Partner for Over 38 Years"}
              </h2>
              <div style={{ marginTop: '24px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: '#fff' }}>2M+</div>
                  <div style={{ opacity: 0.9, fontSize: '14px', color: '#fff' }}>{isArabic ? "عملاء سعداء" : "Happy Customers"}</div>
                </div>
                <div>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: '#fff' }}>38+</div>
                  <div style={{ opacity: 0.9, fontSize: '14px', color: '#fff' }}>{isArabic ? "سنوات خبرة" : "Years Experience"}</div>
                </div>
                <div>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: '#fff' }}>10x</div>
                  <div style={{ opacity: 0.9, fontSize: '14px', color: '#fff' }}>{isArabic ? "نمو سنوي" : "Growth Rate"}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <h3 className="text-24 fw-600 mb-20" style={{ color: '#019fb1' }}>
              {isArabic ? "الأنشطة التجارية العامة" : "General Business Activities"}
            </h3>
            <p style={{ lineHeight: '1.8', color: '#555', marginBottom: '20px' }}>
              {isArabic 
                ? "تأسست كويك إير للسفريات عام 1986، ومنذ ذلك الحين حافظت على خدمات الحج والعمرة كنشاطها الأساسي بالإضافة إلى حجز تذاكر الطيران والسفر الترفيهي وسفر الأعمال والنقل، حيث خدمت أكثر من مليوني عميل."
                : "Quick Air Travel was established in 1986, and ever since it has maintained pilgrimage & Omra service as its core business in addition to Airline ticket reservation, leisure travel, business travel and transportation having served more than two million customers."}
            </p>
            <p style={{ lineHeight: '1.8', color: '#555' }}>
              {isArabic 
                ? "كبوصلة، تطورت كويك إير جغرافياً خلال العقد الأخير، بالتوسع وفتح فروع في مدن مختلفة، تغطي الآن المناطق المحتملة في جميع أنحاء مصر."
                : "As a compass, Quick Air Travel evolved geographically during the last decade, by expanding and opening branches in different cities, covering now potential areas all over Egypt."}
            </p>
          </div>
        </div>

        {/* Vision, Purpose, Mission */}
        <div className="row y-gap-30 mt-60">
          {values.map((item, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div style={{
                background: '#f8fafb',
                borderRadius: '16px',
                padding: '30px',
                height: '100%',
                border: '1px solid #e8f4f6',
                transition: 'all 0.3s ease',
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #019fb1 0%, #01b5c9 100%)',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: '#fff',
                }}>
                  {item.icon}
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#1a1a2e' }}>
                  {item.title}
                </h4>
                <p style={{ color: '#666', lineHeight: '1.7', fontSize: '15px' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Core Values & Philosophy */}
        <div className="row y-gap-30 mt-60 items-center">
          <div className="col-lg-6">
            <h3 className="text-28 fw-700 mb-20">
              {isArabic ? "قيمنا الأساسية وفلسفتنا" : "Core Values & Philosophy"}
            </h3>
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid #019fb1',
              marginBottom: '20px',
            }}>
              <h5 style={{ color: '#019fb1', fontWeight: '600', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LightbulbIcon /> {isArabic ? "القيم الأساسية" : "Core Values"}
              </h5>
              <p style={{ color: '#555', lineHeight: '1.7', fontSize: '15px' }}>
                {isArabic 
                  ? "نؤمن بمعاملة عملائنا باحترام وثقة. ننمو من خلال الإبداع والابتكار. ندمج الصدق والنزاهة وأخلاقيات العمل في جميع جوانب عملنا."
                  : "We believe in treating our customers with respect and faith. We grow through creativity and innovation. We integrate honesty, integrity and business ethics into all aspects of our business functioning."}
              </p>
            </div>
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid #017a8a',
            }}>
              <h5 style={{ color: '#017a8a', fontWeight: '600', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <StarIcon /> {isArabic ? "فلسفتنا" : "Our Philosophy"}
              </h5>
              <p style={{ color: '#555', lineHeight: '1.7', fontSize: '15px' }}>
                {isArabic 
                  ? "كويك إير تحترم وتتبع الطرق التقليدية للسفر، وفي نفس الوقت توفر البنية التحتية الكاملة لنمط العمليات الجديد (الحجوزات الإلكترونية لجميع الخدمات، مركز الاتصال إلخ...)"
                  : "Quick Air Travel respects and follows the traditional ways of traveling, but at the same time offers the full infrastructure for the new mode of operations (online bookings of all services, contact center etc…)"}
              </p>
            </div>
          </div>
          <div className="col-lg-6">
            <div style={{
              background: 'linear-gradient(135deg, #f8fafb 0%, #e8f4f6 100%)',
              borderRadius: '20px',
              padding: '30px',
            }}>
              <h4 style={{ color: '#019fb1', fontWeight: '600', marginBottom: '20px' }}>
                {isArabic ? "أهدافنا الاستراتيجية" : "Strategic Goals"}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  isArabic ? "التوسع الإقليمي في مجال السياحة" : "Regional expansion in tourism field",
                  isArabic ? "تطوير قاعدة عملاء رئيسيين قوية" : "Develop a strong base of key customers",
                  isArabic ? "زيادة أصول واستثمارات الشركة" : "Increase company assets & investments",
                  isArabic ? "بناء سمعة مميزة في مجال السياحة" : "Build good reputation in tourism",
                ].map((goal, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: i < 3 ? '1px solid rgba(1,159,177,0.2)' : 'none',
                  }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      background: '#019fb1',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '12px',
                      flexShrink: 0,
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                    <span style={{ color: '#333', fontSize: '15px' }}>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-80">
          <div className="text-center mb-40">
            <span style={{
              background: 'linear-gradient(135deg, #019fb1 0%, #01b5c9 100%)',
              color: '#fff',
              padding: '6px 20px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
            }}>
              {isArabic ? "خدماتنا" : "Our Services"}
            </span>
            <h3 className="text-30 fw-700 mt-20">
              {isArabic ? "نطاق العمل الشامل" : "Comprehensive Scope of Work"}
            </h3>
            <p style={{ color: '#666', maxWidth: '600px', margin: '15px auto 0' }}>
              {isArabic 
                ? "نقدم في جميع أنحاء مصر مجموعة كاملة من خدمات السياحة الوافدة بحلول مرنة وفعالة"
                : "We offer all over Egypt a full spectrum of incoming tourism services with flexible & efficient solutions"}
            </p>
          </div>

          <div className="row y-gap-30">
            {services.map((service, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '28px',
                  height: '100%',
                  boxShadow: '0 4px 20px rgba(1,159,177,0.08)',
                  border: '1px solid #e8f4f6',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, rgba(1,159,177,0.1) 0%, rgba(1,181,201,0.1) 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    color: '#019fb1',
                  }}>
                    {service.icon}
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: '#1a1a2e' }}>
                    {service.title}
                  </h4>
                  <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px', margin: 0 }}>
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* E-Market Section */}
        <div className="mt-80">
          <div style={{
            background: 'linear-gradient(135deg, #019fb1 0%, #017a8a 100%)',
            borderRadius: '24px',
            padding: '50px',
            color: '#fff',
          }}>
            <div className="row y-gap-30 items-center">
              <div className="col-lg-6">
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  {isArabic ? "السوق الإلكتروني" : "E-Market"}
                </span>
                <h3 style={{ fontSize: '28px', fontWeight: '700', marginTop: '20px', marginBottom: '16px', color: '#fff' }}>
                  {isArabic ? "نحرص على وقتك وجهدك" : "We Value Your Time & Effort"}
                </h3>
                <p style={{ opacity: 0.9, lineHeight: '1.7', color: '#fff' }}>
                  {isArabic 
                    ? "نسعى لجعل عملائنا أكثر ارتياحاً مع السوق الإلكتروني وبدء استخدام الخدمات عبر الإنترنت من خلال موقعنا."
                    : "We try to make our clients more friendly with E-Market to start using online services through our website."}
                </p>
              </div>
              <div className="col-lg-6">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {eMarketFeatures.map((item, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{item.icon}</span>
                      <span style={{ fontWeight: '500', color: '#fff' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sister Companies */}
        <div className="mt-60 text-center">
          <h4 className="text-20 fw-600 mb-30" style={{ color: '#019fb1' }}>
            {isArabic ? "شركاتنا الشقيقة" : "Our Sister Companies"}
          </h4>
          <div className="row y-gap-20 justify-center">
            <div className="col-lg-4 col-md-6">
              <div style={{
                background: '#f8fafb',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e8f4f6',
              }}>
                <h5 style={{ fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>
                  Quick Travel & Tours
                </h5>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                  {isArabic ? "متخصصة في صفقات الشركات وعملاء VIP" : "Specialized with corporate deals and VIP customers"}
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div style={{
                background: '#f8fafb',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e8f4f6',
              }}>
                <h5 style={{ fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>
                  Quick Logistics
                </h5>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                  {isArabic ? "خدمات اللوجستيات والمشتريات" : "Logistics & procurement services"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
