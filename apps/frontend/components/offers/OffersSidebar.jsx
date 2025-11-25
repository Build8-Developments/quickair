"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { getAllLocations } from "@/lib/api/services/location";
import { useLanguage } from "@/contexts/LanguageContext";

export default function OffersSidebar({ offers, filters, setFilters }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [ddActives, setDdActives] = useState(["location", "month"]);
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

  // Extract unique months from offers
  const uniqueMonths = Array.from(
    new Set(offers.filter((offer) => offer.month).map((offer) => offer.month))
  ).sort((a, b) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months.indexOf(a) - months.indexOf(b);
  });

  const handleLocationChange = (slug) => {
    setFilters((prev) => ({
      ...prev,
      locations: prev.locations.includes(slug)
        ? prev.locations.filter((loc) => loc !== slug)
        : [...prev.locations, slug],
    }));
  };

  const handleMonthChange = (month) => {
    setFilters((prev) => ({
      ...prev,
      months: prev.months.includes(month)
        ? prev.months.filter((m) => m !== month)
        : [...prev.months, month],
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
                  {t("offersList.destination")}
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
                        {t("offersList.noDestinationsAvailable")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Month Filter */}
        <div className="sidebar__item">
          <div className="accordion -simple-2 js-accordion">
            <div
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes("month") ? "is-active" : ""
              } `}
            >
              <div
                className="accordion__button d-flex items-center justify-between"
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("month")
                      ? [...pre.filter((elm) => elm !== "month")]
                      : [...pre, "month"]
                  )
                }
              >
                <h5 className="text-18 fw-500">
                  {t("offersList.travelMonth")}
                </h5>

                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div
                className="accordion__content filter-accordion-enter"
                style={
                  ddActives.includes("month") ? { maxHeight: "400px" } : {}
                }
              >
                <div className="pt-15">
                  <div className="d-flex flex-column y-gap-15">
                    {uniqueMonths.length > 0 ? (
                      uniqueMonths.map((month, i) => (
                        <div key={i}>
                          <div className="d-flex items-center">
                            <div className="form-checkbox">
                              <input
                                type="checkbox"
                                checked={filters.months.includes(month)}
                                onChange={() => handleMonthChange(month)}
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

                            <div className="lh-11 ml-10">{month}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-14 text-light-1">
                        No months available
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
