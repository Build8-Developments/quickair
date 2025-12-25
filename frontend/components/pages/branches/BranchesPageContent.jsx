"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Phone, Smartphone, ExternalLink } from "lucide-react";

const branchesData = [
  {
    id: 1,
    name: { ar: "المنصورة", en: "Mansoura" },
    address: { ar: "ش بن بطوطة أمام الجوازات", en: "Ibn Battuta St., in front of Passports Office" },
    phones: ["0502310023", "0502310054", "0502312040"],
    mobiles: ["01282221011", "01282221012", "01282221013", "01282221014", "01282221015"],
    mapLink: "https://www.google.com/maps/place/Quick+Air+Tours/@31.042967,31.3905375,17z/data=!4m6!3m5!1s0x14f79da4755842d5:0xde268d8e43813f6c!8m2!3d31.0429308!4d31.3926999!16s%2Fg%2F11c54wkkh1?hl=en&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D"
  },
  {
    id: 2,
    name: { ar: "القاهرة", en: "Cairo" },
    address: { ar: "مدينة الشروق 162 مجاورة 2 الى الثانى طريق الشباب", en: "El Shorouk City, 162 Neighborhood 2, Youth Road" },
    phones: ["0220300813", "0220300814", "0220301361", "0220301306"],
    mobiles: ["01282221005", "01282221037"],
    mapLink: "https://www.google.com/maps/place/Quick+Air+Travel,+Al+Shorouk+city,+Al+Shabab+Road,+Villa+162+District+2,+El+Shorouk,+Cairo+Governorate/data=!4m2!3m1!1s0x14581d4fcb4296b7:0x1f582e5a9ac3c9b2?utm_source=mstt_1&entry=gps"
  },
  {
    id: 3,
    name: { ar: "طلخا", en: "Talkha" },
    address: { ar: "ش عاطف الشرقاوى تقسيم غنام", en: "Atef El Sharkawy St., Ghannam Division" },
    phones: ["0502534996", "0502534071"],
    mobiles: ["01000093388"],
    mapLink: "https://www.google.com/maps/place/31%C2%B003'06.9%22N+31%C2%B022'45.2%22E/@31.0519261,31.3770296,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0xe28c76baa1732a05!8m2!3d31.0519261!4d31.3792183?hl=en"
  },
  {
    id: 4,
    name: { ar: "دكرنس", en: "Dekernes" },
    address: { ar: "سور النادى الرياضى - ش مجلس المدينة - دكرنس", en: "Sports Club Wall - City Council St. - Dekernes" },
    phones: ["0503481211"],
    mobiles: ["01282221021"],
    mapLink: "https://www.google.com/maps/place/31%C2%B005'22.3%22N+31%C2%B036'02.1%22E/@31.0895277,31.5983924,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x239328539f7d8e7!8m2!3d31.0895277!4d31.6005811?hl=en"
  },
  {
    id: 5,
    name: { ar: "شربين", en: "Sherbin" },
    address: { ar: "ش الجيش بجوار مسجد الرحمة", en: "El Geish St., next to Al Rahma Mosque" },
    phones: ["0503936090", "0503929090"],
    mobiles: ["01000093378"],
    mapLink: "https://www.google.com/maps/place/31%C2%B011'44.2%22N+31%C2%B031'15.6%22E/@31.1956035,31.5188122,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0xedc72aa3d9e29474!8m2!3d31.1956035!4d31.5210009?hl=en"
  },
  {
    id: 6,
    name: { ar: "بلقاس", en: "Belqas" },
    address: { ar: "ش سامح الرفاعى بلقاس", en: "Sameh El Refaey St., Belqas" },
    phones: ["0502786348", "0502786371"],
    mobiles: ["01282221033"],
    mapLink: "https://www.google.com/maps/place/31%C2%B012'50.0%22N+31%C2%B021'41.8%22E/@31.2138865,31.3594165,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x4e52cd8a03ea06f8!8m2!3d31.2138865!4d31.3616052?hl=en"
  },
  {
    id: 7,
    name: { ar: "فارسكور", en: "Faraskour" },
    address: { ar: "3 ش ترعة البلد خلف مسجد المحطة", en: "3 Terat El Balad St., behind the Station Mosque" },
    phones: ["0573458200", "0573458500"],
    mobiles: ["01094323439"],
    mapLink: "https://www.google.com/maps/place/31%C2%B019'51.1%22N+31%C2%B043'07.8%22E/@31.3308506,31.7166338,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0xbbfafd01148fbc43!8m2!3d31.3308506!4d31.7188225?hl=en"
  },
  {
    id: 8,
    name: { ar: "الروضة", en: "El Rawda" },
    address: { ar: "الروضة 3 ش العروبة قسم الروضة مركز فارسكور - دمياط", en: "El Rawda, 3 El Orouba St., Faraskour Center - Damietta" },
    phones: ["0573477115"],
    mobiles: ["01093535224"],
    mapLink: "https://www.google.com/maps/place/31%C2%B019'23.8%22N+31%C2%B045'29.2%22E/@31.3232822,31.7559213,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0xd96339c2ea3e2c49!8m2!3d31.3232822!4d31.75811?hl=en"
  }
];

const contactInfo = {
  mainHotline: "19102",
  customerService: ["01282221010", "01282221020", "01282221030", "01282221040"],
  uaeNumbers: ["+971525312234", "+971588586112"],
  website: "www.quickair.travel"
};

export default function BranchesPageContent({ locale }) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <section className="layout-pb-lg" style={{ paddingTop: "180px" }}>
      <div className="container">
        {/* Page Header */}
        <div className="row justify-center mb-60" style={{ textAlign: isRTL ? "right" : "left" }}>
          <div className="col-lg-8">
            <h1 className="text-40 fw-700 text-accent-1 mb-20">
              {t("branches.pageTitle")}
            </h1>
            <p className="text-18 text-dark-1">
              {t("branches.pageDescription")}
            </p>
          </div>
        </div>

        {/* Branches Grid */}
        <div className="row y-gap-30">
          {branchesData.map((branch) => (
            <div key={branch.id} className="col-lg-6 col-md-6">
              <div className="branch-card">
                <div className="branch-card__header">
                  <MapPin size={24} className="branch-card__icon" />
                  <h3 className="branch-card__title">
                    {isRTL ? branch.name.ar : branch.name.en}
                  </h3>
                </div>
                
                <div className="branch-card__body">
                  <p className="branch-card__address">
                    {isRTL ? branch.address.ar : branch.address.en}
                  </p>
                  
                  <div className="branch-card__contacts">
                    {branch.phones.length > 0 && (
                      <div className="branch-card__contact-group">
                        <Phone size={16} />
                        <div className="branch-card__numbers">
                          {branch.phones.map((phone, idx) => (
                            <a key={idx} href={`tel:${phone}`} className="branch-card__number">
                              {phone}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {branch.mobiles.length > 0 && (
                      <div className="branch-card__contact-group">
                        <Smartphone size={16} />
                        <div className="branch-card__numbers">
                          {branch.mobiles.map((mobile, idx) => (
                            <a key={idx} href={`tel:${mobile}`} className="branch-card__number">
                              {mobile}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="branch-card__footer">
                  <a 
                    href={branch.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="branch-card__map-link"
                  >
                    <ExternalLink size={14} />
                    {t("branches.viewOnMap")}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Info Section */}
        <div className="row justify-center mt-60">
          <div className="col-lg-10">
            <div className="contact-info-box">
              <div className="contact-info-box__header">
                <Phone size={24} className="contact-info-box__icon" />
                <h3 className="contact-info-box__title">
                  {t("branches.customerService")}
                </h3>
              </div>
              
              <div className="contact-info-box__grid">
                <div className="contact-info-box__item">
                  <span className="contact-info-box__label">{t("branches.hotline")}</span>
                  <a href="tel:19102" className="contact-info-box__value contact-info-box__hotline">
                    {contactInfo.mainHotline}
                  </a>
                </div>
                
                <div className="contact-info-box__item">
                  <span className="contact-info-box__label">{t("branches.egyptNumbers")}</span>
                  <div className="contact-info-box__numbers">
                    {contactInfo.customerService.map((num, idx) => (
                      <a key={idx} href={`tel:${num}`} className="contact-info-box__value">
                        {num}
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="contact-info-box__item">
                  <span className="contact-info-box__label">{t("branches.uaeBranch")}</span>
                  <div className="contact-info-box__numbers">
                    {contactInfo.uaeNumbers.map((num, idx) => (
                      <a key={idx} href={`tel:${num}`} className="contact-info-box__value">
                        {num}
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
