"use client";

// Updated: RTL layout, smaller cards, removed Google Maps button - v2.0

import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useRef } from "react";

const branchesData = [
  {
    id: 1,
    name: { ar: "المنصورة", en: "Mansoura" },
    address: { ar: "ش بن بطوطة أمام الجوازات", en: "Ibn Battuta St., in front of Passports Office" },
    phones: ["0502310023", "0502310054", "0502312040"],
    mobiles: ["01282221011", "01282221012", "01282221013", "01282221014", "01282221015"],
    coordinates: [31.0429308, 31.3926999]
  },
  {
    id: 2,
    name: { ar: "القاهرة", en: "Cairo" },
    address: { ar: "مدينة الشروق 162 مجاورة 2", en: "El Shorouk City, 162 Neighborhood 2" },
    phones: ["0220300813", "0220300814", "0220301361", "0220301306"],
    mobiles: ["01282221005", "01282221037"],
    coordinates: [30.1127, 31.6089]
  },
  {
    id: 3,
    name: { ar: "طلخا", en: "Talkha" },
    address: { ar: "ش عاطف الشرقاوى تقسيم غنام", en: "Atef El Sharkawy St., Ghannam Division" },
    phones: ["0502534996", "0502534071"],
    mobiles: ["01000093388"],
    coordinates: [31.0519261, 31.3792183]
  },
  {
    id: 4,
    name: { ar: "دكرنس", en: "Dekernes" },
    address: { ar: "سور النادى الرياضى - ش مجلس المدينة", en: "Sports Club Wall - City Council St." },
    phones: ["0503481211"],
    mobiles: ["01282221021"],
    coordinates: [31.0895277, 31.6005811]
  },
  {
    id: 5,
    name: { ar: "شربين", en: "Sherbin" },
    address: { ar: "ش الجيش بجوار مسجد الرحمة", en: "El Geish St., next to Al Rahma Mosque" },
    phones: ["0503936090", "0503929090"],
    mobiles: ["01000093378"],
    coordinates: [31.1956035, 31.5210009]
  },
  {
    id: 6,
    name: { ar: "بلقاس", en: "Belqas" },
    address: { ar: "ش سامح الرفاعى بلقاس", en: "Sameh El Refaey St., Belqas" },
    phones: ["0502786348", "0502786371"],
    mobiles: ["01282221033"],
    coordinates: [31.2138865, 31.3616052]
  },
  {
    id: 7,
    name: { ar: "فارسكور", en: "Faraskour" },
    address: { ar: "3 ش ترعة البلد خلف مسجد المحطة", en: "3 Terat El Balad St., behind Station Mosque" },
    phones: ["0573458200", "0573458500"],
    mobiles: ["01094323439"],
    coordinates: [31.3308506, 31.7188225]
  },
  {
    id: 8,
    name: { ar: "الروضة", en: "El Rawda" },
    address: { ar: "الروضة 3 ش العروبة - دمياط", en: "El Rawda, 3 El Orouba St. - Damietta" },
    phones: ["0573477115"],
    mobiles: ["01093535224"],
    coordinates: [31.3232822, 31.75811]
  }
];

export default function Locations() {
  const { language, t } = useLanguage();

  // Main branch (Mansoura) data
  const mainBranch = branchesData.find(branch => branch.id === 1);

  return (
    <section className="layout-pt-md layout-pb-md">
      <div className="container">
        <div className="row justify-center mb-40">
          <div className="col-auto">
            <h2 className="section-title">
              {t('فروعنا', 'Our Branches')}
            </h2>
            <p className="section-subtitle">
              {t('تواصل معنا في أي من فروعنا', 'Contact us at any of our branches')}
            </p>
          </div>
        </div>

        {/* Main Section with Mansoura Branch and Map */}
        <div className="row mb-50">
          {/* Mansoura Branch Details */}
          <div className="col-lg-6">
            <div className="main-branch-card">
              <div className="branch-header">
                <div className="location-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3 className="branch-title">
                  {language === "ar" ? mainBranch.name.ar : mainBranch.name.en}
                </h3>
              </div>

              <div className="branch-details">
                {/* Address */}
                <div className="detail-row">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{language === "ar" ? mainBranch.address.ar : mainBranch.address.en}</span>
                </div>
                
                {/* Phones */}
                <div className="detail-section">
                  <div className="detail-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span className="detail-label">{t("التليفون", "Phone")}:</span>
                  </div>
                  <div className="phone-list">
                    {mainBranch.phones.map((phone, i) => (
                      <a 
                        key={i} 
                        href={`tel:${phone}`} 
                        className="phone-link"
                        dir="ltr"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Mobiles */}
                <div className="detail-section">
                  <div className="detail-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                      <line x1="12" y1="18" x2="12.01" y2="18"/>
                    </svg>
                    <span className="detail-label">{t("الموبايل", "Mobile")}:</span>
                  </div>
                  <div className="phone-list">
                    {mainBranch.mobiles.map((mobile, i) => (
                      <a 
                        key={i} 
                        href={`tel:${mobile}`} 
                        className="phone-link"
                        dir="ltr"
                      >
                        {mobile}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="col-lg-6">
            <div className="map-container">
              <div id="map" style={{ width: '100%', height: '100%', minHeight: '400px' }}>
                {/* Map will be loaded here */}
              </div>
            </div>
          </div>
        </div>

        {/* Other Branches */}
        <div className="row y-gap-30">
          {branchesData.filter(branch => branch.id !== 1).map((branch) => (
            <div key={branch.id} className="col-lg-3 col-md-6 col-sm-6">
              <div className="location-card">
                <div className="location-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3 className="location-title">
                  {language === "ar" ? branch.name.ar : branch.name.en}
                </h3>
                <div className="location-details">
                  {/* Address */}
                  <div className="detail-row">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>{language === "ar" ? branch.address.ar : branch.address.en}</span>
                  </div>
                  
                  {/* Phones */}
                  <div className="detail-section">
                    <div className="detail-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <span className="detail-label">{t("التليفون", "Phone")}:</span>
                    </div>
                    <div className="phone-list">
                      {branch.phones.map((phone, i) => (
                        <a 
                          key={i} 
                          href={`tel:${phone}`} 
                          className="phone-link"
                          dir="ltr"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Mobiles */}
                  <div className="detail-section">
                    <div className="detail-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                        <line x1="12" y1="18" x2="12.01" y2="18"/>
                      </svg>
                      <span className="detail-label">{t("الموبايل", "Mobile")}:</span>
                    </div>
                    <div className="phone-list">
                      {branch.mobiles.map((mobile, i) => (
                        <a 
                          key={i} 
                          href={`tel:${mobile}`} 
                          className="phone-link"
                          dir="ltr"
                        >
                          {mobile}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .section-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 10px;
          text-align: center;
        }

        .section-subtitle {
          font-size: 16px;
          color: #666;
          text-align: center;
          margin: 0;
        }

        /* Main Branch Card Styles */
        .main-branch-card {
          background: #019fb1;
          border-radius: 15px;
          padding: 30px;
          color: white;
          height: 100%;
          min-height: 400px;
          display: flex;
          flex-direction: column;
        }

        .branch-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .branch-header .location-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          color: white;
        }

        .branch-title {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .branch-details {
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: right;
          direction: rtl;
          flex: 1;
        }

        .branch-details .detail-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 16px;
          color: white;
          flex-direction: row-reverse;
        }

        .branch-details .detail-row svg {
          min-width: 20px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 2px;
        }

        .branch-details .detail-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .branch-details .detail-header {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          color: white;
          font-weight: 600;
          flex-direction: row-reverse;
        }

        .branch-details .detail-header svg {
          min-width: 20px;
          color: rgba(255, 255, 255, 0.8);
        }

        .branch-details .phone-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-right: 32px;
        }

        .branch-details .phone-link {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          transition: all 0.2s ease;
          padding: 2px 0;
        }

        .branch-details .phone-link:hover {
          color: white;
          text-decoration: underline;
        }

        /* Map Container Styles */
        .map-container {
          background: #f8f9fa;
          border: 3px solid #019fb1;
          border-radius: 15px;
          overflow: hidden;
          height: 100%;
          min-height: 400px;
          position: relative;
        }

        .map-container::before {
          content: "الخريطة";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 18px;
          color: #019fb1;
          font-weight: 600;
          z-index: 1;
        }

        /* Regular Location Cards */
        .location-card {
          background: #fff;
          border: 3px solid #019fb1;
          border-radius: 15px;
          padding: 15px 10px;
          text-align: center;
          transition: all 0.3s ease;
          height: 100%;
          min-height: 280px;
          box-shadow: 0 2px 10px rgba(1, 159, 177, 0.1);
        }

        .location-card:hover {
          border-color: #019fb1;
          box-shadow: 0 8px 25px rgba(1, 159, 177, 0.15);
          transform: translateY(-5px);
        }

        .location-icon {
          width: 40px;
          height: 40px;
          background: #019fb1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 10px;
          color: white;
        }

        .location-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .location-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: right;
          direction: rtl;
          background: rgba(1, 159, 177, 0.05);
          padding: 10px;
          border-radius: 8px;
          margin-top: 10px;
        }

        .detail-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: #666;
          flex-direction: row-reverse;
        }

        .detail-row svg {
          min-width: 16px;
          color: #019fb1;
          margin-top: 2px;
        }

        .detail-row span {
          flex: 1;
          line-height: 1.4;
        }

        .detail-section {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .detail-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #333;
          font-weight: 600;
          flex-direction: row-reverse;
        }

        .detail-header svg {
          min-width: 16px;
          color: #019fb1;
        }

        .detail-label {
          font-size: 12px;
          font-weight: 600;
          color: #333;
        }

        .phone-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-right: 24px;
        }

        .phone-link {
          font-size: 11px;
          color: #019fb1;
          text-decoration: none;
          transition: all 0.2s ease;
          padding: 1px 0;
        }

        .phone-link:hover {
          color: #017a8a;
          text-decoration: underline;
        }

        @media (max-width: 991px) {
          .section-title {
            font-size: 28px;
          }

          .main-branch-card {
            padding: 25px;
            min-height: 350px;
            margin-bottom: 30px;
          }

          .branch-title {
            font-size: 22px;
          }

          .map-container {
            min-height: 350px;
          }

          .location-card {
            padding: 18px 12px;
            min-height: 280px;
          }

          .location-icon {
            width: 45px;
            height: 45px;
          }

          .location-title {
            font-size: 15px;
          }

          .phone-list {
            margin-right: 20px;
          }
        }

        @media (max-width: 575px) {
          .section-title {
            font-size: 24px;
          }

          .main-branch-card {
            padding: 20px;
            min-height: 300px;
          }

          .branch-title {
            font-size: 20px;
          }

          .branch-details .detail-row {
            font-size: 14px;
          }

          .branch-details .detail-header {
            font-size: 14px;
          }

          .branch-details .phone-link {
            font-size: 13px;
          }

          .map-container {
            min-height: 300px;
          }

          .location-card {
            min-height: 260px;
            padding: 15px 10px;
          }

          .location-icon {
            width: 40px;
            height: 40px;
          }

          .location-title {
            font-size: 14px;
          }

          .phone-list {
            margin-right: 18px;
          }

          .detail-row {
            font-size: 11px;
          }

          .detail-header {
            font-size: 11px;
          }

          .phone-link {
            font-size: 10px;
          }
        }
      `}</style>
    </section>
  );
}
