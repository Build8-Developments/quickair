"use client";

import React, { useState } from "react";
import RangeSlider from "../common/RangeSlider";
import Image from "next/image";

export default function OffersSidebar({ offers, filters, setFilters }) {
  const [ddActives, setDdActives] = useState(["location", "month"]);

  // Extract unique locations from offers
  const uniqueLocations = Array.from(
    new Set(
      offers
        .filter((offer) => offer.location?.name)
        .map((offer) =>
          JSON.stringify({
            name: offer.location.name,
            slug: offer.location.slug,
            country: offer.location.country,
          })
        )
    )
  ).map((item) => JSON.parse(item));

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

  const handlePriceChange = (range) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: range,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      locations: [],
      months: [],
      priceRange: [0, 10000],
    });
  };

  const hasActiveFilters =
    filters.locations.length > 0 ||
    filters.months.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 10000;

  return (
    <div className="sidebar -type-1 rounded-12">
      <div className="sidebar__content">
        {hasActiveFilters && (
          <div className="sidebar__item pb-20">
            <button
              onClick={clearAllFilters}
              className="button -md -outline-accent-1 text-accent-1 w-100"
            >
              <i className="icon-close mr-10"></i>
              Clear All Filters
            </button>
          </div>
        )}

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
                <h5 className="text-18 fw-500">Destination</h5>

                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div
                className="accordion__content"
                style={
                  ddActives.includes("location") ? { maxHeight: "400px" } : {}
                }
              >
                <div className="pt-15">
                  <div className="d-flex flex-column y-gap-15">
                    {uniqueLocations.length > 0 ? (
                      uniqueLocations.map((location, i) => (
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
                        No destinations available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="sidebar__item">
          <div className="accordion -simple-2 js-accordion">
            <div
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes("pricerange") ? "is-active" : ""
              } `}
            >
              <div
                className="accordion__button mb-10 d-flex items-center justify-between"
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("pricerange")
                      ? [...pre.filter((elm) => elm !== "pricerange")]
                      : [...pre, "pricerange"]
                  )
                }
              >
                <h5 className="text-18 fw-500">Price Range</h5>

                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div
                className="accordion__content"
                style={
                  ddActives.includes("pricerange") ? { maxHeight: "300px" } : {}
                }
              >
                <div className="pt-15">
                  <RangeSlider
                    value={filters.priceRange}
                    onChange={handlePriceChange}
                  />
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
                <h5 className="text-18 fw-500">Travel Month</h5>

                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div
                className="accordion__content"
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

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="sidebar__item">
            <div className="pt-15 pb-15">
              <h6 className="text-15 fw-500 mb-10">Active Filters:</h6>
              <div className="d-flex flex-wrap gap-10">
                {filters.locations.length > 0 && (
                  <div className="bg-accent-1-05 px-10 py-5 rounded-8">
                    <span className="text-13">
                      {filters.locations.length} destination(s)
                    </span>
                  </div>
                )}
                {filters.months.length > 0 && (
                  <div className="bg-accent-1-05 px-10 py-5 rounded-8">
                    <span className="text-13">
                      {filters.months.length} month(s)
                    </span>
                  </div>
                )}
                {(filters.priceRange[0] !== 0 ||
                  filters.priceRange[1] !== 10000) && (
                  <div className="bg-accent-1-05 px-10 py-5 rounded-8">
                    <span className="text-13">
                      ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
