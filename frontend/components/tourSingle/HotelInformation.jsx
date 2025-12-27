"use client";

import React from "react";
import Link from "next/link";
import Stars from "@/components/common/Stars";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HotelInformation({ hotel, offer }) {
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

  if (!hotel) return null;

  return (
    <>
      {/* Breadcrumbs */}
      <div className="row pb-20">
        <div className="col-12">
          <div
            className="text-14 text-light-2"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            <Link href="/" className="text-accent-1">
              {t("common.home")}
            </Link>
            <span className="mx-10">{">"}</span>
            <Link href="/offers" className="text-accent-1">
              {t("common.offers")}
            </Link>
            {offer && (
              <>
                <span className="mx-10">{">"}</span>
                <Link
                  href={`/offers/${offer.documentId}`}
                  className="text-accent-1"
                >
                  {offer.title}
                </Link>
              </>
            )}
            <span className="mx-10">{">"}</span>
            <span className="text-dark-1">{hotel.name}</span>
          </div>
        </div>
      </div>

      {/* Hotel Header */}
      <div className="row y-gap-20 justify-between items-end">
        <div className="col-auto">
          <div className="row x-gap-10 y-gap-10 items-center">
            {/* Stars */}
            {hotel.stars && (
              <div className="col-auto">
                <div className="d-flex items-center">
                  <Stars star={hotel.stars} font={18} />
                  <span className="text-14 text-light-2 ml-10">
                    {hotel.stars} {t("hotel.stars")}
                  </span>
                </div>
              </div>
            )}

            {/* Hotel Chain */}
            {hotel.chain && (
              <div className="col-auto">
                <button className="button -blue-1 text-14 py-5 px-15 bg-blue-1-05 text-blue-1 rounded-200">
                  {hotel.chain}
                </button>
              </div>
            )}

            {/* Featured Badge */}
            {hotel.featured && (
              <div className="col-auto">
                <button className="button -accent-1 text-14 py-5 px-15 bg-accent-1-05 text-accent-1 rounded-200">
                  {t("hotel.featured")}
                </button>
              </div>
            )}
          </div>

          <h1
            className="text-40 sm:text-30 lh-14 mt-20"
            dir="ltr"
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {hotel.name}
          </h1>

          <div
            className="row x-gap-20 y-gap-15 items-center pt-20"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {/* Location */}
            {hotel.location && (
              <div className="col-auto">
                <div className="d-flex items-center" style={{ gap: "8px" }}>
                  <i className="icon-pin text-16 text-accent-1 flex-shrink-0"></i>
                  <span>
                    {hotel.location.name}
                    {hotel.location.country && `, ${hotel.location.country}`}
                  </span>
                </div>
              </div>
            )}

            {/* Address */}
            {hotel.address && (
              <div className="col-auto">
                <div className="d-flex items-center" style={{ gap: "8px" }}>
                  <i className="icon-destination text-16 text-accent-1 flex-shrink-0"></i>
                  <span>{hotel.address}</span>
                </div>
              </div>
            )}

            {/* Amenities Count */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="col-auto">
                <div className="d-flex items-center" style={{ gap: "8px" }}>
                  <i className="icon-check text-16 text-accent-1 flex-shrink-0"></i>
                  <span>
                    {hotel.amenities.length} {t("hotel.amenities")}
                  </span>
                </div>
              </div>
            )}

            {/* Offer Badge */}
            {offer && (
              <div className="col-auto">
                <div className="d-flex items-center" style={{ gap: "8px" }}>
                  <i className="icon-calendar text-16 text-accent-1 flex-shrink-0"></i>
                  <span>
                    <bdi>{translateMonth(offer.month)}</bdi> {offer.year}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-auto">
          <button className="d-flex items-center">
            <i
              className={`icon-share flex-center text-16 ${
                isRTL ? "ml-10" : "mr-10"
              }`}
            ></i>
            {t("common.share")}
          </button>
        </div>
      </div>
    </>
  );
}
