"use client";

import { useEffect, useState } from "react";
import { getAllOffers } from "@/lib/api/services/offer";
import { getStrapiURL } from "@/lib/strapi";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function OfferDestinations() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getLocale, isRTL, language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchOffers = async () => {
      const locale = getLocale();
      const offersData = await getAllOffers({ locale, limit: 8 });
      setOffers(offersData);
      setLoading(false);
    };
    fetchOffers();
  }, [getLocale]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/img/tourCards/1/1.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return getStrapiURL(imageUrl);
  };

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

  return (
    <section className="layout-pt-xl">
      <div className="container">
        <div className="row y-gap-10 justify-between items-end">
          <div className="col-auto">
            <h2
              data-aos="fade-up"
              data-aos-delay=""
              className="text-30"
              style={{ textAlign: isRTL ? "right" : "left" }}
            >
              {t("home.specialOffers")}
            </h2>
          </div>

          <div className="col-auto">
            <Link
              href={"/offers"}
              data-aos="fade-up"
              data-aos-delay=""
              className="buttonArrow d-flex items-center "
            >
              <span>{t("common.seeAll")}</span>
              <i
                className={`icon-arrow-top-right text-16 ${
                  isRTL ? "mr-10" : "ml-10"
                }`}
              ></i>
            </Link>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay=""
          className="row y-gap-20 pt-40"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="col-xl-3 col-lg-4 col-sm-6"
                >
                  <div className="d-flex items-center">
                    <div
                      className="size-100 rounded-full"
                      style={{ background: "#eee" }}
                    ></div>
                    <div className={isRTL ? "mr-20" : "ml-20"}>
                      <div
                        style={{
                          width: 80,
                          height: 16,
                          background: "#eee",
                          borderRadius: 4,
                        }}
                      ></div>
                      <div
                        className="mt-5"
                        style={{
                          width: 120,
                          height: 18,
                          background: "#eee",
                          borderRadius: 4,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            : offers.map((offer, i) => (
                <div
                  key={offer.documentId || i}
                  className="col-xl-3 col-lg-4 col-sm-6"
                >
                  <Link
                    href={`/offers/${offer.documentId}`}
                    className="d-flex items-center -hover-image-scale"
                  >
                    <div className="size-100 -hover-image-scale__image rounded-full">
                      <Image
                        width={260}
                        height={260}
                        src={getImageUrl(offer.coverImage?.url)}
                        alt={offer.coverImage?.name || offer.title}
                        className="img-cover rounded-full"
                      />
                    </div>

                    <div
                      className={isRTL ? "mr-20" : "ml-20"}
                      style={{ textAlign: isRTL ? "right" : "left" }}
                    >
                      <div className="text-accent-1">
                        <bdi>{translateMonth(offer.month)}</bdi> {offer.year}
                      </div>
                      <h4 className="text-15 fw-500 mt-5">
                        <bdi>{offer.title}</bdi>
                      </h4>
                    </div>
                  </Link>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
