"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tag, Hotel, Compass, MapPin, Globe } from "lucide-react";

const socialMediaLinks = [
  { id: 1, class: "icon-facebook", href: "#" },
  { id: 2, class: "icon-twitter", href: "#" },
  { id: 3, class: "icon-instagram", href: "#" },
  { id: 4, class: "icon-linkedin", href: "#" },
];
export default function MobileMenu({ mobileMenuOpen, setMobileMenuOpen }) {
  const [activeSub, setActiveSub] = useState("");
  const pathname = usePathname();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  return (
    <div
      data-aos="fade"
      data-aos-delay=""
      className={`menu js-menu ${mobileMenuOpen ? "-is-active" : ""} `}
      style={
        mobileMenuOpen
          ? { opacity: "1", visibility: "visible" }
          : { pointerEvents: "none", visibility: "hidden" }
      }
    >
      <div
        onClick={() => setMobileMenuOpen(false)}
        className="menu__overlay js-menu-button"
      ></div>

      <div className="menu__container">
        <div className="menu__header">
          <h4>Menu</h4>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="js-menu-button"
          >
            <i className="icon-cross text-10"></i>
          </button>
        </div>

        <div className="menu__content">
          <ul
            className="menuNav js-navList -is-active"
            style={{ maxHeight: "calc(100vh - 262px)", overflowY: "auto" }}
          >
            <li className="menuNav__item">
              <Link href="/">{t("navbar.home")}</Link>
            </li>

            <li className="menuNav__item -has-submenu js-has-submenu">
              <a
                onClick={() =>
                  setActiveSub((pre) => (pre == "Tour" ? "" : "Tour"))
                }
              >
                <span>{t("navbar.tour")}</span>
                <i
                  style={{
                    transform:
                      activeSub == "Tour" ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.6s ease",
                  }}
                  className="icon-chevron-right"
                ></i>
              </a>

              <ul
                className="mobile-tour-submenu"
                style={{
                  maxHeight: activeSub == "Tour" ? "1200px" : "0px",
                  transition: "max-height 0.6s ease, padding 0.6s ease",
                }}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <li className="mobile-bento-item">
                  <Link href="/offers" className="mobile-bento-link">
                    <div className="mobile-bento-icon">
                      <Tag size={18} strokeWidth={1.5} />
                    </div>
                    <div className="mobile-bento-content">
                      <div className="mobile-bento-title">
                        {t("navbar.offers")}
                      </div>
                      <div className="mobile-bento-desc">
                        {t("navbar.offersDesc")}
                      </div>
                    </div>
                  </Link>
                </li>

                <li className="mobile-bento-item">
                  <Link href="/hotels" className="mobile-bento-link">
                    <div className="mobile-bento-icon">
                      <Hotel size={18} strokeWidth={1.5} />
                    </div>
                    <div className="mobile-bento-content">
                      <div className="mobile-bento-title">
                        {t("navbar.hotels")}
                      </div>
                      <div className="mobile-bento-desc">
                        {t("navbar.hotelsDesc")}
                      </div>
                    </div>
                  </Link>
                </li>

                <li className="mobile-bento-item">
                  <Link href="/haj" className="mobile-bento-link">
                    <div className="mobile-bento-icon">
                      <Compass size={18} strokeWidth={1.5} />
                    </div>
                    <div className="mobile-bento-content">
                      <div className="mobile-bento-title">
                        {t("navbar.haj")}
                      </div>
                      <div className="mobile-bento-desc">
                        {t("navbar.hajDesc")}
                      </div>
                    </div>
                  </Link>
                </li>

                <li className="mobile-bento-item">
                  <Link href="/omra" className="mobile-bento-link">
                    <div className="mobile-bento-icon">
                      <MapPin size={18} strokeWidth={1.5} />
                    </div>
                    <div className="mobile-bento-content">
                      <div className="mobile-bento-title">
                        {t("navbar.omra")}
                      </div>
                      <div className="mobile-bento-desc">
                        {t("navbar.omraDesc")}
                      </div>
                    </div>
                  </Link>
                </li>

                <li className="mobile-bento-item mobile-bento-featured">
                  <a
                    href="#trending_destinations"
                    className="mobile-bento-link"
                  >
                    <div className="mobile-bento-icon">
                      <Globe size={20} strokeWidth={1.5} />
                    </div>
                    <div className="mobile-bento-content">
                      <div className="mobile-bento-title">
                        {t("navbar.destinations")}
                      </div>
                      <div className="mobile-bento-desc">
                        {t("navbar.destinationsDesc")}
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </li>

            <li className="menuNav__item">
              <Link href="/flow">{t("navbar.createTrip")}</Link>
            </li>

            <li className="menuNav__item">
              <Link href="/about">{t("navbar.about")}</Link>
            </li>

            <li className="menuNav__item">
              <Link href="/contact">{t("navbar.contact")}</Link>
            </li>

            <li className="menuNav__item">
              <Link href="/contact">{t("navbar.help")}</Link>
            </li>
          </ul>
        </div>

        <div className="menu__footer">
          <i className="icon-headphone text-50"></i>

          <div className="text-20 lh-12 fw-500 mt-20">
            <div>Speak to our expert at</div>
            <div className="text-accent-1">1-800-453-6744</div>
          </div>

          <div className="d-flex items-center x-gap-10 pt-30">
            {socialMediaLinks.map((elm, i) => (
              <div key={i}>
                <a href={elm.href} className="d-block">
                  <i className={elm.class}></i>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
