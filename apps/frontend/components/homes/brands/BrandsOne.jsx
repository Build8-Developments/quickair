"use client";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { clients } from "@/data/clients";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import React from "react";

export default function BrandsOne() {
  const { isRTL } = useLanguage();
  const { t } = useTranslation();

  return (
    <section className="layout-pt-xl ">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-auto">
            <h2
              data-aos="fade-up"
              data-aos-delay=""
              className="text-30"
              style={{ textAlign: isRTL ? "right" : "left" }}
            >
              {t("home.trustedBrands")}
            </h2>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="" className="pt-40 sm:pt-20">
          <Swiper
            spaceBetween={30}
            className="w-100"
            modules={[Autoplay]}
            autoplay
            loop={true}
            breakpoints={{
              300: {
                slidesPerView: 2,
              },
              500: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
              1200: {
                slidesPerView: 6,
              },
            }}
          >
            {clients.map((elm, i) => (
              <SwiperSlide key={i}>
                <div
                  key={i}
                  className="d-flex justify-center items-center"
                  style={{ height: "120px" }}
                >
                  <Image
                    width={200}
                    height={120}
                    style={{
                      maxHeight: "100px",
                      maxWidth: "180px",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                    }}
                    src={elm}
                    alt="image"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
