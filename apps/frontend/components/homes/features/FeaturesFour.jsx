"use client";
import { featuresThree } from "@/data/features";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import React from "react";

export default function FeaturesFour() {
  const { t } = useTranslation();

  // Map the feature IDs to translation keys
  const getTranslationKey = (id) => {
    const keys = {
      1: "totalDonations",
      2: "campaignsClosed",
      3: "happyPeople",
      4: "ourVolunteers",
    };
    return keys[id] || "";
  };

  return (
    <section className="layout-pt-xl">
      <div className="container">
        <div data-aos="fade-up" data-aos-delay="" className="row y-gap-30">
          {featuresThree.map((elm, i) => (
            <div key={i} className="col-lg-3 col-6">
              <div className="text-center">
                <Image width="60" height="61" src={elm.icon} alt="icon" />

                <h3 className="text-40 md:text-30 lh-14 fw-700 mt-30 md:mt-15">
                  {elm.value}
                </h3>
                <p className="lh-15">{t(`home.stats.${getTranslationKey(elm.id)}`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
