"use client";

import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

export default function NotFound() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <>
      <main dir={isRTL ? "rtl" : "ltr"}>
        <Header3 />
        <section className="nopage mt-header">
          <div className="container">
            <div className="row y-gap-30 justify-between items-center">
              <div className="col-xl-6 col-lg-6">
                <Image
                  width="629"
                  height="481"
                  src="/img/404/1.svg"
                  alt="image"
                />
              </div>

              <div className="col-xl-5 col-lg-6">
                <div
                  className="nopage__content pr-30 lg:pr-0"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <h1>
                    40<span className="text-accent-1">4</span>
                  </h1>
                  <h2 className="text-30 md:text-24 fw-700">
                    {t("notFound.heading")}
                  </h2>
                  <p>{t("notFound.description")}</p>

                  <Link
                    href="/"
                    className="button -md -dark-1 bg-accent-1 text-white mt-25"
                  >
                    {t("notFound.button")}
                    <i className="icon-arrow-top-right ml-10"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <FooterTwo />
      </main>
    </>
  );
}
