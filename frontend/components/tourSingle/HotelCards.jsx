"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Stars from "../common/Stars";
import { getStrapiURL } from "@/lib/strapi";
import { CalendarCheck2, SquareMenu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { getHotelCurrency } from "@/utils/currency";

export default function HotelCards({ hotelOptions }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  if (!hotelOptions || hotelOptions.length === 0) return null;

  return (
    <div className="row y-gap-30">
      {hotelOptions.map((option, index) => {
        const hotel = option.hotel;
        if (!hotel) return null;

        // Determine currency based on hotel location (Egypt = EGP, others = USD)
        const currency = getHotelCurrency(option, hotel, "USD");

        return (
          <div key={index} className="col-lg-6 col-md-6">
            <Link
              href={`/hotels/${hotel.documentId}`}
              className="tourCard -type-1 -hover-shadow border-1 rounded-12 bg-white"
            >
              <div className="tourCard__header">
                <div className="tourCard__image ratio ratio-28:20">
                  <Image
                    width={450}
                    height={325}
                    src={
                      hotel.externalImageUrl ||
                      getStrapiURL(hotel.coverImage?.url)
                    }
                    alt={hotel.coverImage?.alternativeText || hotel.name}
                    className="img-ratio rounded-12"
                  />
                </div>

                {option.specialOffer && (
                  <div className="tourCard__badge">
                    <div className="bg-blue-1 text-white px-15 py-5 text-12 fw-500 rounded-right-4">
                      {option.specialOffer}
                    </div>
                  </div>
                )}
              </div>

              <div className="tourCard__content px-20 py-20">
                <div className="d-flex flex-column mb-10">
                  <div className="d-flex items-center mb-5">
                    {hotel.stars && (
                      <div className="d-flex x-gap-5 mr-10">
                        <Stars star={hotel.stars} font={14} />
                      </div>
                    )}
                    {hotel.chain && (
                      <span className="text-12 text-light-2">
                        • {hotel.chain}
                      </span>
                    )}
                  </div>
                  <h3 className="text-18 fw-600 text-dark-1">{hotel.name}</h3>
                </div>

                {hotel.location && (
                  <div className="d-flex items-center text-14 text-light-2 mb-10">
                    <i className="icon-pin text-16 mr-5"></i>
                    {hotel.location.name}
                    {hotel.location.country && `, ${hotel.location.country}`}
                  </div>
                )}

                {hotel.shortDescription && (
                  <p className="text-14 text-light-2 mb-15 line-clamp-2">
                    {hotel.shortDescription}
                  </p>
                )}

                <div className="row x-gap-20 y-gap-10 pt-10 border-top-1">
                  <div className="col-auto">
                    <div className="d-flex items-center text-14">
                      <CalendarCheck2
                        className={`text-16 ${isRTL ? "ml-5" : "mr-5"}`}
                      />
                      {option.nights}{" "}
                      {option.nights > 1 ? t("hotel.nights") : t("hotel.night")}
                    </div>
                  </div>

                  {option.mealPlan && (
                    <div className="col-auto">
                      <div className="d-flex items-center text-14">
                        <SquareMenu
                          className={`text-16 ${isRTL ? "ml-5" : "mr-5"}`}
                        />
                        {option.mealPlan.name}
                      </div>
                    </div>
                  )}

                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="col-auto">
                      <div className="d-flex items-center text-14">
                        <i
                          className={`icon-check text-16 ${
                            isRTL ? "ml-5" : "mr-5"
                          }`}
                        ></i>
                        {hotel.amenities.length} {t("hotel.amenities")}
                      </div>
                    </div>
                  )}
                </div>

                {option.roomPricing && option.roomPricing.length > 0 && (
                  <div className="d-flex items-center justify-between pt-15 mt-15 border-top-1">
                    <div className="d-flex flex-column">
                      <span className="text-12 text-light-2">
                        {t("hotel.startingFrom")}
                      </span>
                      <div className="text-20 fw-600 text-accent-1 mt-5">
                        {Math.min(
                          ...option.roomPricing
                            .map((p) =>
                              Math.min(
                                p.singleOccupancyPrice || Infinity,
                                p.doubleOccupancyPrice || Infinity,
                                p.tripleOccupancyPrice || Infinity
                              )
                            )
                            .filter((p) => p !== Infinity)
                        ).toLocaleString()}{" "}
                        <span className="text-16 fw-500">{currency}</span>
                      </div>
                    </div>
                    <div className="button -sm -accent-1 text-white px-20 py-10 rounded-8">
                      {t("hotel.viewDetails")}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
