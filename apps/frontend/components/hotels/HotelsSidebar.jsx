"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { getAllLocations } from "@/lib/api/services/location";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HotelsSidebar({ hotels, filters, setFilters }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [ddActives, setDdActives] = useState(["location", "amenities"]);
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);

  // Fetch locations from API based on current language
  useEffect(() => {
    const fetchLocations = async () => {
      setLocationsLoading(true);
      const data = await getAllLocations({ locale: language });
      setLocations(data);
      setLocationsLoading(false);
    };
    fetchLocations();
  }, [language]);

  // Extract unique amenities from hotels
  const uniqueAmenities = Array.from(
    new Set(
      hotels
        .flatMap((hotel) => hotel.amenities || [])
        .map((amenity) => amenity.name)
    )
  ).sort();

  const handleLocationChange = (slug) => {
    setFilters((prev) => ({
      ...prev,
      locations: prev.locations.includes(slug)
        ? prev.locations.filter((loc) => loc !== slug)
        : [...prev.locations, slug],
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <div className="sidebar -type-1 rounded-12">
      <div className="sidebar__content">
        {/* Destination Filter */}
        <div className="sidebar__item">
          <div className="accordion -simple-2 js-accordion">
            <div
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes("location") ? "is-active" : ""
              } `}
            >
              <div
                className="accordion__button d-flex items-center justify-between"
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("location")
                      ? [...pre.filter((elm) => elm !== "location")]
                      : [...pre, "location"]
                  )
                }
              >
                <h5 className="text-18 fw-500">
                  {t("hotelsList.destination")}
                </h5>

                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div
                className="accordion__content filter-accordion-enter"
                style={
                  ddActives.includes("location") ? { maxHeight: "400px" } : {}
                }
              >
                <div className="pt-15">
                  <div className="d-flex flex-column y-gap-15">
                    {locationsLoading ? (
                      // Show skeleton loaders while fetching
                      Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="d-flex items-center">
                          <div className="skeleton-checkbox skeleton-pulse"></div>
                          <div className="skeleton-filter-text skeleton-pulse ml-10"></div>
                        </div>
                      ))
                    ) : locations.length > 0 ? (
                      locations.map((location, i) => (
                        <div key={i}>
                          <div className="d-flex items-center">
                            <div className="form-checkbox">
                              <input
                                type="checkbox"
                                checked={filters.locations.includes(
                                  location.slug
                                )}
                                onChange={() =>
                                  handleLocationChange(location.slug)
                                }
                              />
                              <div className="form-checkbox__mark">
                                <div className="form-checkbox__icon">
                                  <Image
                                    width="10"
                                    height="8"
                                    src="/img/icons/check.svg"
                                    alt="icon"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="lh-11 ml-10">
                              {location.name}
                              {location.country && (
                                <span className="text-light-1 ml-5">
                                  ({location.country})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-14 text-light-1">
                        {t("hotelsList.noDestinationsAvailable")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities Filter */}
        <div className="sidebar__item">
          <div className="accordion -simple-2 js-accordion">
            <div
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes("amenities") ? "is-active" : ""
              } `}
            >
              <div
                className="accordion__button d-flex items-center justify-between"
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("amenities")
                      ? [...pre.filter((elm) => elm !== "amenities")]
                      : [...pre, "amenities"]
                  )
                }
              >
                <h5 className="text-18 fw-500">{t("hotelsList.amenities")}</h5>

                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div
                className="accordion__content filter-accordion-enter"
                style={
                  ddActives.includes("amenities") ? { maxHeight: "400px" } : {}
                }
              >
                <div className="pt-15">
                  <div className="d-flex flex-column y-gap-15">
                    {uniqueAmenities.length > 0 ? (
                      uniqueAmenities.map((amenity, i) => (
                        <div key={i}>
                          <div className="d-flex items-center">
                            <div className="form-checkbox">
                              <input
                                type="checkbox"
                                checked={filters.amenities.includes(amenity)}
                                onChange={() => handleAmenityChange(amenity)}
                              />
                              <div className="form-checkbox__mark">
                                <div className="form-checkbox__icon">
                                  <Image
                                    width="10"
                                    height="8"
                                    src="/img/icons/check.svg"
                                    alt="icon"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="lh-11 ml-10">{amenity}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-14 text-light-1">
                        {t("hotelsList.noAmenitiesAvailable")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
