"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MainInformation({ offer }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // Translate English month names to Arabic
  const translateMonth = (monthName) => {
    if (!monthName || language !== "ar") return monthName;

    const monthMap = {
      January: "يناير",
      February: "فبراير",
      March: "مارس",
      April: "أبريل",
      May: "مايو",
      June: "يونيو",
      July: "يوليو",
      August: "أغسطس",
      September: "سبتمبر",
      October: "أكتوبر",
      November: "نوفمبر",
      December: "ديسمبر",
    };

    return monthMap[monthName] || monthName;
  };

  if (!offer) return null;

  console.log(offer);

  return (
    <>
      <div className="row y-gap-20 justify-between items-end">
        <div className="col-auto">
          <div className="row x-gap-10 y-gap-10 items-center">
            <div className="col-auto">
              <button className="button -accent-1 text-14 py-5 px-15 bg-accent-1-05 text-accent-1 rounded-200">
                <bdi>{translateMonth(offer.month)}</bdi> {offer.year}
              </button>
            </div>
            {offer.hotelOptions?.some((opt) => opt.specialOffer) && (
              <div className="col-auto">
                <button className="button -blue-1 text-14 py-5 px-15 bg-blue-1-05 text-blue-1 rounded-200">
                  {t("offer.specialOffer")}
                </button>
              </div>
            )}
          </div>

          <h2 className="text-40 sm:text-30 lh-14 mt-20">{offer.title}</h2>

          <div className="row x-gap-20 y-gap-20 items-center pt-20">
            <div className="col-auto">
              <div className="d-flex items-center">
                <i
                  className={`icon-pin text-16 ${isRTL ? "ml-5" : "mr-5"}`}
                ></i>
                {offer.location?.name}
                {offer.location?.country && `, ${offer.location.country}`}
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex items-center">
                <i
                  className={`icon-calendar text-16 ${isRTL ? "ml-5" : "mr-5"}`}
                ></i>
                <bdi>{translateMonth(offer.month)}</bdi> {offer.year}
              </div>
            </div>

            {offer.hotelOptions && offer.hotelOptions.length > 0 && (
              <div className="col-auto">
                <div className="d-flex items-center">
                  <i
                    className={`icon-bed text-16 ${isRTL ? "ml-5" : "mr-5"}`}
                  ></i>
                  {offer.hotelOptions.length}{" "}
                  {offer.hotelOptions.length > 1
                    ? t("offer.hotelOptions")
                    : t("offer.hotelOption")}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-auto">
          <div className="d-flex x-gap-30 y-gap-10">
            <a href="#" className="d-flex items-center">
              <i
                className={`icon-share flex-center text-16 ${
                  isRTL ? "ml-10" : "mr-10"
                }`}
              ></i>
              {t("offer.share")}
            </a>

            <a href="#" className="d-flex items-center">
              <i
                className={`icon-heart flex-center text-16 ${
                  isRTL ? "ml-10" : "mr-10"
                }`}
              ></i>
              {t("offer.wishlist")}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
