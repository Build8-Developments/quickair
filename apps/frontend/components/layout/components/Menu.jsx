"use client";

import { homes, pages, tours } from "@/data/menu";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Tag, Hotel, Compass, MapPin, Globe } from "lucide-react";

export default function Menu() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <>
      <div className="xl:d-none ml-30">
        <div className="desktopNav">
          <div className="desktopNav__item">
            <Link href="/">{t("navbar.home")}</Link>
          </div>

          <div className="desktopNav__item">
            <a href="#">
              {t("navbar.tour")} <i className="icon-chevron-down"></i>
            </a>

            <div className="desktopNavMega" dir={isRTL ? "rtl" : "ltr"}>
              <div className="desktopNavMega__container">
                <div className="desktopNavMega__lists">
                  <div className="bento-menu-grid">
                    <Link href="/offers" className="bento-menu-item">
                      <div className="bento-menu-icon">
                        <Tag size={20} strokeWidth={1.5} />
                      </div>
                      <div className="bento-menu-content">
                        <div className="bento-menu-title">
                          {t("navbar.offers")}
                        </div>
                        <div className="bento-menu-description">
                          {t("navbar.offersDesc")}
                        </div>
                      </div>
                    </Link>

                    <Link href="/hotels" className="bento-menu-item">
                      <div className="bento-menu-icon">
                        <Hotel size={20} strokeWidth={1.5} />
                      </div>
                      <div className="bento-menu-content">
                        <div className="bento-menu-title">
                          {t("navbar.hotels")}
                        </div>
                        <div className="bento-menu-description">
                          {t("navbar.hotelsDesc")}
                        </div>
                      </div>
                    </Link>

                    <Link href="/haj" className="bento-menu-item">
                      <div className="bento-menu-icon">
                        <Compass size={20} strokeWidth={1.5} />
                      </div>
                      <div className="bento-menu-content">
                        <div className="bento-menu-title">
                          {t("navbar.haj")}
                        </div>
                        <div className="bento-menu-description">
                          {t("navbar.hajDesc")}
                        </div>
                      </div>
                    </Link>

                    <Link href="/omra" className="bento-menu-item">
                      <div className="bento-menu-icon">
                        <MapPin size={20} strokeWidth={1.5} />
                      </div>
                      <div className="bento-menu-content">
                        <div className="bento-menu-title">
                          {t("navbar.omra")}
                        </div>
                        <div className="bento-menu-description">
                          {t("navbar.omraDesc")}
                        </div>
                      </div>
                    </Link>

                    <a
                      href="#trending_destinations"
                      className="bento-menu-item bento-menu-featured"
                    >
                      <div className="bento-menu-icon">
                        <Globe size={22} strokeWidth={1.5} />
                      </div>
                      <div className="bento-menu-content">
                        <div className="bento-menu-title">
                          {t("navbar.destinations")}
                        </div>
                        <div className="bento-menu-description">
                          {t("navbar.destinationsDesc")}
                        </div>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="desktopNavMega__info">
                  <div className="specialCardGrid row y-gap-30">
                    <div className="col-12">
                      <div className="specialCard">
                        <div className="specialCard__image">
                          <Image
                            width={615}
                            height={300}
                            src="/img/cta/10/1.jpg"
                            alt="image"
                          />
                        </div>

                        <div className="specialCard__content">
                          <div className="specialCard__subtitle">
                            {t("navbar.promoCard1Subtitle")}
                          </div>
                          <h3 className="specialCard__title">
                            {t("navbar.promoCard1Title")}
                          </h3>
                          <div className="specialCard__text">
                            {t("navbar.promoCard1Text")}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="specialCard">
                        <div className="specialCard__image">
                          <Image
                            width={615}
                            height={300}
                            src="/img/cta/10/2.jpg"
                            alt="image"
                          />
                        </div>

                        <div className="specialCard__content">
                          <div className="specialCard__subtitle">
                            {t("navbar.promoCard2Subtitle")}
                          </div>
                          <h3 className="specialCard__title">
                            {t("navbar.promoCard2Title")}
                          </h3>
                          <div className="specialCard__text"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desktopNav__item">
            <a href="/flow">{t("navbar.createTrip")}</a>
          </div>

          <div className="desktopNav__item">
            <a href="/about">{t("navbar.about")}</a>
          </div>

          <div className="desktopNav__item">
            <Link href="/contact">{t("navbar.contact")}</Link>
          </div>
        </div>
      </div>
    </>
  );
}
