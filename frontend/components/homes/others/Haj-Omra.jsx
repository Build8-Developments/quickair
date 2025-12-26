"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

export default function HajOmra({ locale = "en" }) {
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  return (
    <section className="layout-pt-xl layout-pb-xl">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-auto">
            <div className="text-15 text-accent-1 mb-10">
              {t("home.spiritualJourneys")}
            </div>
            <h2 data-aos="fade-up" data-aos-delay="" className="text-30">
              {t("home.hajOmraPackages")}
            </h2>
          </div>
        </div>

        <div className="row y-gap-30 justify-between pt-40 sm:pt-20">
          {/* Haj Image */}
          <div
            className="col-lg-6 col-md-6 col-sm-12"
            data-aos="fade-up"
            data-aos-delay=""
          >
            <Link href={`/${locale}/haj`} className="d-block overflow-hidden rounded-12">
              <Image
                src="/hij.png"
                alt={t("home.haj")}
                width={750}
                height={600}
                className="w-100 h-auto"
                style={{
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            </Link>
          </div>

          {/* Omra Image */}
          <div
            className="col-lg-6 col-md-6 col-sm-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Link href={`/${locale}/omra`} className="d-block overflow-hidden rounded-12">
              <Image
                src="/omra.png"
                alt={t("home.omra")}
                width={750}
                height={600}
                className="w-100 h-auto"
                style={{
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
