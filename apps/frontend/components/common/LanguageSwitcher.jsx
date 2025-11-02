"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = languages.find((lang) => lang.code === language);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="language-switcher__button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <span className="language-switcher__flag">{currentLanguage?.flag}</span>
        <span className="language-switcher__name">{currentLanguage?.name}</span>
        <i
          className={`icon-chevron-down language-switcher__icon ${
            isOpen ? "rotated" : ""
          }`}
        ></i>
      </button>

      {isOpen && (
        <div className="language-switcher__dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-switcher__option ${
                lang.code === language ? "active" : ""
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="language-switcher__flag">{lang.flag}</span>
              <span className="language-switcher__name">{lang.name}</span>
              {lang.code === language && (
                <i className="icon-check language-switcher__check"></i>
              )}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .language-switcher {
          position: relative;
          display: inline-block;
        }

        .language-switcher__button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          min-width: 120px;
        }

        .language-switcher__button:hover {
          border-color: #eb662b;
          background: #fff9f6;
        }

        .language-switcher__flag {
          font-size: 18px;
          line-height: 1;
        }

        .language-switcher__name {
          flex: 1;
          text-align: left;
        }

        .language-switcher__icon {
          font-size: 12px;
          transition: transform 0.2s ease;
          color: #6b7280;
        }

        .language-switcher__icon.rotated {
          transform: rotate(180deg);
        }

        .language-switcher__dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          z-index: 1000;
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .language-switcher__option {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 10px 12px;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
          font-size: 14px;
          color: #374151;
          text-align: left;
        }

        .language-switcher__option:hover {
          background: #f9fafb;
        }

        .language-switcher__option.active {
          background: #fff9f6;
          color: #eb662b;
          font-weight: 600;
        }

        .language-switcher__option:not(:last-child) {
          border-bottom: 1px solid #f3f4f6;
        }

        .language-switcher__check {
          margin-left: auto;
          font-size: 12px;
          color: #eb662b;
        }
      `}</style>
    </div>
  );
}
