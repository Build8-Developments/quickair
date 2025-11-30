"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { getFeaturedTrips } from "@/lib/api/services/hotel";
import { getStrapiURL } from "@/lib/strapi";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import Stars from "@/components/common/Stars";
import Image from "next/image";
import Link from "next/link";
import { MenuSquare } from "lucide-react";

export default function TourSlider5() {
  const { getLocale } = useLanguage();
  const { t } = useTranslation();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      const locale = getLocale();
      const tripsData = await getFeaturedTrips({ locale, limit: 10 });
      setTrips(tripsData);
      setLoading(false);
    };
    fetchTrips();
  }, [getLocale]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/img/tourCards/1/1.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return getStrapiURL(imageUrl);
  };

  // Get minimum price from hotel options
  const getMinPrice = (hotelOptions) => {
    if (!hotelOptions || hotelOptions.length === 0) return null;

    let minPrice = Infinity;
    let currency = "EGP";

    hotelOptions.forEach((option) => {
      if (option.roomPricing && option.roomPricing.length > 0) {
        currency = option.currency || currency;
        option.roomPricing.forEach((room) => {
          const prices = [
            room.singleOccupancyPrice,
            room.doubleOccupancyPrice,
            room.tripleOccupancyPrice,
          ].filter((p) => p > 0);
          if (prices.length > 0) {
            minPrice = Math.min(minPrice, ...prices);
          }
        });
      }
    });

    return minPrice !== Infinity ? { price: minPrice, currency } : null;
  };

  // Count available meal plan options
  const getMealPlanCount = (hotelOptions) => {
    if (!hotelOptions) return 0;
    const uniqueMealPlans = new Set(
      hotelOptions.filter((opt) => opt.mealPlan).map((opt) => opt.mealPlan.code)
    );
    return uniqueMealPlans.size;
  };

  return (
    <>
      <section className="layout-pt-xl layout-pb-xl">
        <div className="container">
          <div className="row y-gap-10 justify-between items-center y-gap-10">
            <div className="col-auto">
              <h2 data-aos="fade-up" data-aos-delay="" className="text-30">
                {t("home.featuredTrips")}
              </h2>
            </div>
          </div>

          <div className="relative pt-40 sm:pt-20">
            <div className="js-section-slider">
              <div data-aos="fade-up" data-aos-delay="" className="">
                <Swiper
                  spaceBetween={30}
                  className="w-100 overflow-visible"
                  navigation={{
                    prevEl: ".js-slider1-prev",
                    nextEl: ".js-slider1-next",
                  }}
                  modules={[Navigation, Pagination]}
                  breakpoints={{
                    500: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 3,
                    },
                    1200: {
                      slidesPerView: 3,
                    },
                  }}
                >
                  <SwiperSlide>
                    <Link href={`/create-trip`} className=" -type-3 ">
                      <div className="tourCard__image ratio  ratio-41:45 rounded-12  ">
                        <div className="img-ratio rounded-12 d-flex items-center justify-center bg-light-1">
                          <span className="text-black text-24 fw-500 text-center px-20">
                            {t("home.customizeTrip")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>

                  {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <SwiperSlide key={`skeleton-${i}`}>
                          <div className="tourCard -type-3">
                            <div
                              className="tourCard__image ratio ratio-41:45 rounded-12"
                              style={{ background: "#eee" }}
                            ></div>
                          </div>
                        </SwiperSlide>
                      ))
                    : trips.map((trip, i) => {
                        const pricing = getMinPrice(trip.hotelOptions);
                        const mealPlanCount = getMealPlanCount(
                          trip.hotelOptions
                        );
                        const firstHotel = trip.hotelOptions?.[0]?.hotel;
                        const nights = trip.hotelOptions?.[0]?.nights;

                        return (
                          <SwiperSlide key={trip.documentId || i}>
                            <Link
                              href={`/offers/${trip.documentId}`}
                              className="tourCard -type-3 -hover-image-scale"
                            >
                              <div className="tourCard__image ratio ratio-41:45 rounded-12 -hover-image-scale__image">
                                <Image
                                  width={421}
                                  height={301}
                                  src={getImageUrl(trip.coverImage?.url)}
                                  alt={trip.coverImage?.name || trip.title}
                                  className="img-ratio rounded-12"
                                />
                              </div>

                              <div className="tourCard__wrap">
                                <div className="tourCard__header d-flex justify-between items-center text-13 text-white">
                                  <div className="d-flex items-center">
                                    <i className="icon-clock text-16 mr-5"></i>
                                    {nights
                                      ? `${nights} ${t("home.nights")}`
                                      : trip.month}
                                  </div>

                                  <button className="tourCard__favorite">
                                    <i className="icon-heart"></i>
                                  </button>
                                </div>

                                <div className="tourCard__content d-flex justify-between items-end">
                                  <div>
                                    <div className="tourCard__location d-flex items-center text-13 text-white">
                                      <i className="icon-pin d-flex text-16 text-white mr-5"></i>
                                      {trip.location?.name ||
                                        t("home.destination")}
                                    </div>

                                    <h3 className="tourCard__title text-18 text-white fw-500 mt-5">
                                      <span>{trip.title}</span>
                                    </h3>

                                    <div className="tourCard__rating d-flex items-center text-13 mt-5">
                                      {firstHotel && (
                                        <>
                                          <div className="d-flex items-center x-gap-5">
                                            <Stars
                                              font={12}
                                              star={firstHotel.stars}
                                            />
                                          </div>
                                          <span className="text-white ml-10">
                                            {firstHotel.stars}.0
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {pricing && (
                                    <div className="text-right text-white">
                                      <div className="text-13 lh-14">
                                        {t("home.from")}
                                      </div>
                                      <div className="text-18 fw-500">
                                        {pricing.currency}{" "}
                                        {pricing.price.toLocaleString()}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          </SwiperSlide>
                        );
                      })}
                </Swiper>
              </div>
            </div>

            <div className="navRegular mt-40 md:mt-30">
              <button className="navRegular__button bg-white js-slider1-prev">
                <i className="icon-arrow-left text-20"></i>
              </button>

              <button className="navRegular__button bg-white js-slider1-next">
                <i className="icon-arrow-right text-20"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
