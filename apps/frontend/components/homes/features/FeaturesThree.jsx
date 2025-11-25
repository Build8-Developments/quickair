"use client";
import { features } from "@/data/features";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import React from "react";

export default function FeaturesThree() {
  const { t } = useTranslation();

  // Map feature IDs to translation keys
  const getFeatureKey = (id) => {
    const keys = {
      1: "flexibility",
      2: "experiences",
      3: "quality",
      4: "support",
    };
    return keys[id] || "flexibility";
  };

  return (
    <section className="">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-auto">
            <h2 data-aos="fade-left" data-aos-delay="" className="text-30">
              {t("home.whyChoose")}
            </h2>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay=""
          className="row md:x-gap-20 pt-40 sm:pt-20 mobile-css-slider -w-280"
        >
          {features.map((elm, i) => (
            <div key={i} className="col-lg-3 col-sm-6">
              <div className="featureIcon -type-1 text-center px-20 py-60 rounded-12 hover-shadow-1">
                <div className="featureIcon__icon">
                  <Image width="60" height="60" src={elm.iconSrc} alt="icon" />
                </div>

                <h3 className="featureIcon__title text-18 fw-500 mt-30">
                  {t(`home.features.${getFeatureKey(elm.id)}.title`)}
                </h3>
                <p className="featureIcon__text mt-10">
                  {t(`home.features.${getFeatureKey(elm.id)}.text`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
