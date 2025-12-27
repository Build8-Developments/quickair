"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

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

// Fix Leaflet default marker icon issue in Next.js
const fixLeafletIcon = async () => {
  const L = (await import("leaflet")).default;
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

export default function MapWidget() {
  const { t, language } = useLanguage();
  const [selectedBranch, setSelectedBranch] = useState(branchesData[0]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fixLeafletIcon();
  }, []);

  return (
    <section className="layout-pt-md layout-pb-lg" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container">
        {/* Title */}
        <div className="row justify-center mb-30">
          <div className="col-auto text-center">
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 700, 
              color: '#019fb1', 
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              {t("فروعنا", "Our Branches")}
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#019fb1',
              textAlign: 'center'
            }}>
              {t("اختر فرع لعرضه على الخريطة", "Select a branch to view on the map")}
            </p>
          </div>
        </div>

        {/* Branch Selection Cards */}
        <div className="row y-gap-15 mb-30">
          {branchesData.map((branch) => (
            <div key={branch.id} className="col-lg-3 col-md-4 col-sm-6">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedBranch(branch)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedBranch(branch)}
                style={{
                  background: selectedBranch.id === branch.id ? '#019fb1' : '#019fb1',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '15px 18px',
                  border: selectedBranch.id === branch.id ? '2px solid #017a8a' : '2px solid #019fb1',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  textAlign: language === 'ar' ? 'right' : 'left',
                  direction: language === 'ar' ? 'rtl' : 'ltr'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '8px',
                  flexWrap: 'wrap'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span style={{ fontWeight: 600, fontSize: '16px' }}>
                    {language === "ar" ? branch.name.ar : branch.name.en}
                  </span>
                </div>
                <p style={{ 
                  fontSize: '14px', 
                  margin: 0, 
                  opacity: selectedBranch.id === branch.id ? 0.9 : 0.9,
                  lineHeight: 1.5,
                  textAlign: language === 'ar' ? 'right' : 'left',
                  wordWrap: 'break-word',
                  overflow: 'hidden',
                  color: '#fff'
                }}>
                  {language === "ar" ? branch.address.ar : branch.address.en}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Map and Details */}
        <div className="row y-gap-30">
          {/* Map - Left side for Arabic, Right side for English */}
          <div className={`col-lg-8 ${language === 'ar' ? 'order-lg-2' : 'order-lg-1'}`}>
            <div style={{ 
              borderRadius: '16px', 
              overflow: 'hidden', 
              height: '450px',
              border: '2px solid #e8e8e8'
            }}>
              {isClient && (
                <MapContainer
                  center={selectedBranch.coordinates}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                  key={selectedBranch.id}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={selectedBranch.coordinates} />
                </MapContainer>
              )}
            </div>
          </div>

          {/* Branch Details Panel - Right side for Arabic, Left side for English */}
          <div className={`col-lg-4 ${language === 'ar' ? 'order-lg-1' : 'order-lg-2'}`}>
            <div style={{
              background: '#019fb1',
              borderRadius: '16px',
              padding: '25px',
              color: '#fff',
              height: '450px',
              display: 'flex',
              flexDirection: 'column',
              textAlign: language === 'ar' ? 'right' : 'left',
              direction: language === 'ar' ? 'rtl' : 'ltr'
            }}>
              <h3 style={{ 
                fontSize: '24px', 
                fontWeight: 700, 
                marginBottom: '25px',
                textAlign: language === 'ar' ? 'right' : 'left'
              }}>
                {language === "ar" ? selectedBranch.name.ar : selectedBranch.name.en}
              </h3>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Address */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span style={{ fontSize: '14px', opacity: 0.9 }}>{t("العنوان", "Address")}</span>
                  </div>
                  <p style={{ 
                    fontSize: '15px', 
                    margin: 0, 
                    paddingRight: language === "ar" ? '28px' : 0, 
                    paddingLeft: language === "en" ? '28px' : 0,
                    textAlign: language === 'ar' ? 'right' : 'left'
                  }}>
                    {language === "ar" ? selectedBranch.address.ar : selectedBranch.address.en}
                  </p>
                </div>

                {/* Phones */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span style={{ fontSize: '16px', opacity: 0.9, fontWeight: 600 }}>{t("التليفون", "Phone")}</span>
                  </div>
                  <div style={{ 
                    paddingRight: language === "ar" ? '28px' : 0, 
                    paddingLeft: language === "en" ? '28px' : 0,
                    textAlign: language === 'ar' ? 'right' : 'left'
                  }}>
                    {selectedBranch.phones.map((phone, i) => (
                      <a 
                        key={i} 
                        href={`tel:${phone}`} 
                        style={{ 
                          display: 'inline-block', 
                          color: '#fff', 
                          fontSize: '16px', 
                          textDecoration: 'none',
                          marginBottom: '6px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          transition: 'all 0.2s ease',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          marginRight: language === 'ar' ? '0' : '8px',
                          marginLeft: language === 'ar' ? '8px' : '0',
                          width: 'fit-content'
                        }} 
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Mobiles */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                      <line x1="12" y1="18" x2="12.01" y2="18"/>
                    </svg>
                    <span style={{ fontSize: '16px', opacity: 0.9, fontWeight: 600 }}>{t("الموبايل", "Mobile")}</span>
                  </div>
                  <div style={{ 
                    paddingRight: language === "ar" ? '28px' : 0, 
                    paddingLeft: language === "en" ? '28px' : 0,
                    textAlign: language === 'ar' ? 'right' : 'left'
                  }}>
                    {selectedBranch.mobiles.map((mobile, i) => (
                      <a 
                        key={i} 
                        href={`tel:${mobile}`} 
                        style={{ 
                          display: 'inline-block', 
                          color: '#fff', 
                          fontSize: '16px', 
                          textDecoration: 'none',
                          marginBottom: '6px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          transition: 'all 0.2s ease',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          marginRight: language === 'ar' ? '0' : '8px',
                          marginLeft: language === 'ar' ? '8px' : '0',
                          width: 'fit-content'
                        }} 
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                      >
                        {mobile}
                      </a>
                    ))}
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
