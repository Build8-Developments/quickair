"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const locations = [
  {
    id: 1,
    title: "القاهرة",
    titleEn: "Cairo",
    address: "شارع ابن بطوطة، مصر الجديدة، القاهرة",
    addressEn: "Ibn Battuta Street, Heliopolis, Cairo",
    phone: "+20 123 456 7890",
    email: "cairo@quickair.com",
  },
  {
    id: 2,
    title: "الإسكندرية",
    titleEn: "Alexandria",
    address: "كورنيش الإسكندرية، الإسكندرية",
    addressEn: "Alexandria Corniche, Alexandria",
    phone: "+20 123 456 7891",
    email: "alex@quickair.com",
  },
  {
    id: 3,
    title: "الغردقة",
    titleEn: "Hurghada",
    address: "منطقة المارينا، الغردقة",
    addressEn: "Marina Area, Hurghada",
    phone: "+20 123 456 7892",
    email: "hurghada@quickair.com",
  },
  {
    id: 4,
    title: "شرم الشيخ",
    titleEn: "Sharm El Sheikh",
    address: "نعمة باي، شرم الشيخ",
    addressEn: "Naama Bay, Sharm El Sheikh",
    phone: "+20 123 456 7893",
    email: "sharm@quickair.com",
  },
];

export default function Locations() {
  const { language, t } = useLanguage();

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
        <div className="row y-gap-30">
          {locations.map((location) => (
            <div key={location.id} className="col-lg-3 col-md-6 col-sm-6">
              <div className="location-card">
                <div className="location-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3 className="location-title">
                  {t(location.title, location.titleEn)}
                </h3>
                <div className="location-details">
                  <div className="detail-row">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>{t(location.address, location.addressEn)}</span>
                  </div>
                  <div className="detail-row">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span dir="ltr">{location.phone}</span>
                  </div>
                  <div className="detail-row">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span>{location.email}</span>
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

        .location-card {
          background: #fff;
          border: 2px solid #e8e8e8;
          border-radius: 20px;
          padding: 30px 25px;
          text-align: center;
          transition: all 0.3s ease;
          height: 100%;
        }

        .location-card:hover {
          border-color: #019fb1;
          box-shadow: 0 8px 25px rgba(1, 159, 177, 0.15);
          transform: translateY(-5px);
        }

        .location-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, rgba(1, 159, 177, 0.1) 0%, rgba(1, 192, 212, 0.1) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #019fb1;
        }

        .location-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
        }

        .location-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
        }

        .detail-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          color: #666;
        }

        .detail-row svg {
          min-width: 18px;
          color: #019fb1;
          margin-top: 2px;
        }

        .detail-row span {
          flex: 1;
          line-height: 1.5;
        }

        @media (max-width: 991px) {
          .section-title {
            font-size: 28px;
          }

          .location-card {
            padding: 25px 20px;
          }
        }

        @media (max-width: 575px) {
          .section-title {
            font-size: 24px;
          }

          .location-icon {
            width: 60px;
            height: 60px;
          }

          .location-title {
            font-size: 18px;
          }
        }
      `}</style>
    </section>
  );
}
