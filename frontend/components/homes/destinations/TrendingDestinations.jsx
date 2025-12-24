"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getFeaturedLocations } from "@/lib/api/services/location";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { getStrapiURL } from "@/lib/strapi";

export default function TrendingDestinations() {
  const { getLocale } = useLanguage();
  const { t } = useTranslation();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      const locale = getLocale();
      // Fetch all featured locations first
      const featuredData = await getFeaturedLocations({ locale, limit: 20 });

      // If we have less than 6 featured locations, fetch from all locations
      let availableLocations = featuredData;
      if (featuredData.length < 6) {
        const { getAllLocations } = await import("@/lib/api/services/location");
        const allData = await getAllLocations({ locale, limit: 20 });
        // Combine featured (prioritized) with all locations, remove duplicates
        availableLocations = [
          ...featuredData,
          ...allData.filter(
            (loc) =>
              !featuredData.some(
                (featured) => featured.documentId === loc.documentId
              )
          ),
        ];
      }

      // Take up to 6 locations for the grid
      const finalLocations = availableLocations.slice(0, 6);

      setLocations(finalLocations);
      setLoading(false);
    };
    fetchLocations();
  }, [getLocale]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/img/tourCards/1/1.png"; // Use existing fallback image
    if (imageUrl.startsWith("http")) return imageUrl;
    return getStrapiURL(imageUrl);
  };

  // Dynamic grid class based on number of items
  const getGridClass = (count) => {
    if (count <= 0) return "";
    if (count === 1) return "grid -destinations-1";
    if (count === 2) return "grid -destinations-2";
    if (count === 3) return "grid -destinations-3";
    if (count === 4) return "grid -destinations-4";
    if (count === 5) return "grid -destinations-5";
    return "grid -type-2"; // 6 or more uses the original bento grid
  };

  if (loading || locations.length === 0) return null;

  return (
    <section id="trending" className="layout-pt-lg-2 layout-pb-lg-2">
      <div className="container">
        <div className="row justify-between items-end y-gap-10">
          <div className="col-auto">
            <h2 data-aos="fade-up" data-aos-delay="" className="text-30">
              {t("home.trendingDestinations")}
            </h2>
          </div>

          <div className="col-auto">
            <Link
              href={"/hotels"}
              data-aos="fade-right"
              data-aos-delay=""
              className="buttonArrow d-flex items-center "
            >
              <span>{t("common.seeAll")}</span>
              <i className="icon-arrow-top-right text-16 ml-10"></i>
            </Link>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay=""
          className={`${getGridClass(locations.length)} pt-40 sm:pt-20`}
        >
          {locations.map((location, i) => (
            <Link
              href={`/hotels?location=${location.slug}`}
              key={location.documentId || i}
              className="featureCard -type-1 overflow-hidden rounded-12 px-30 py-30 -hover-image-scale"
            >
              <div className="featureCard__image -hover-image-scale__image">
                <Image
                  width={780}
                  height={780}
                  style={{ objectFit: "cover" }}
                  src={getImageUrl(location.image?.url)}
                  alt={location.image?.name || location.name}
                />
              </div>

              <div className="featureCard__content">
                <h4 className="text-white">{location.name}</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
