"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Menu from "../components/Menu";
import MobileMenu from "../components/MobileMenu";
import LanguageSwitcherButton from "@/components/common/LanguageSwitcherButton";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header3() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const pageNavigate = (pageName) => {
    router.push(pageName);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addClass, setAddClass] = useState(false);

  // Add a class to the element when scrolled 50px
  const handleScroll = () => {
    if (window.scrollY >= 50) {
      setAddClass(true);
    } else {
      setAddClass(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <header
        className={`header -type-3 js-header ${addClass ? "-is-sticky" : ""}`}
      >
        <div className="header__container container">
          <div className="header__logo">
            <Link href="/" className="header__logo">
              <Image
                width="167"
                height="32"
                src={`/img/general/${
                  language === "ar" ? "ar-logo" : "en-logo"
                }.svg`}
                alt="logo icon"
                priority
              />
            </Link>

            <Menu />
          </div>

          <div className="header__right">
            <LanguageSwitcherButton />
            <Link
              href="/contact"
              className="button -sm -outline-dark-1 rounded-200 text-dark-1 header__help-btn"
            >
              {t("navbar.help")}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="header__menuBtn js-menu-button"
            >
              <i className="icon-main-menu"></i>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
      />
    </>
  );
}
