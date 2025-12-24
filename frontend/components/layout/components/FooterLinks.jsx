"use client";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

const sections = [
  {
    titleKey: "footer.company",
    links: [
      { id: 1, textKey: "footer.aboutUs", href: "/about" },
      { id: 3, textKey: "footer.contactUs", href: "/contact" },
      { id: 7, textKey: "footer.terms", href: "/terms" },
    ],
  },
  {
    titleKey: "footer.support",
    links: [
      { id: 9, textKey: "footer.getInTouch", href: "/contact" },
      {
        id: 11,
        textKey: "footer.liveChat",
        onClick: "openChatbot",
      },
    ],
  },
];

export default function FooterLinks({ locale: serverLocale }) {
  const { t } = useTranslation();
  const { isRTL, language: contextLocale } = useLanguage();
  const locale = serverLocale || contextLocale;

  // Helper to create localized links
  const localePath = (path) => `/${locale}${path}`;

  const handleOpenChatbot = () => {
    const chatbotButton = document.querySelector('[aria-label="Open chat"]');
    if (chatbotButton) {
      chatbotButton.click();
    }
  };

  const linkStyle = {
    color: 'rgba(255, 255, 255, 0.85)',
    transition: 'color 0.3s ease',
  };

  return (
    <>
      {sections.map((elm, i) => (
        <div
          key={i}
          className="col-lg-auto col-6"
          style={{ textAlign: isRTL ? "right" : "left" }}
        >
          <h4 className="text-20 fw-500" style={{ color: '#ffffff' }}>{t(elm.titleKey)}</h4>

          <div className="y-gap-10 mt-20">
            {elm.links.map((elm2, i2) =>
              elm2.onClick === "openChatbot" ? (
                <a
                  key={i2}
                  className="d-block fw-500"
                  onClick={handleOpenChatbot}
                  style={{ ...linkStyle, cursor: "pointer" }}
                >
                  {t(elm2.textKey)}
                </a>
              ) : elm2.href?.startsWith("https://") ? (
                <a
                  key={i2}
                  target="_blank"
                  className="d-block fw-500"
                  href={elm2.href}
                  style={linkStyle}
                >
                  {t(elm2.textKey)}
                </a>
              ) : (
                <a key={i2} className="d-block fw-500" href={localePath(elm2.href)} style={linkStyle}>
                  {t(elm2.textKey)}
                </a>
              )
            )}
          </div>
        </div>
      ))}
    </>
  );
}
