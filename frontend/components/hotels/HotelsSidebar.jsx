"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { getAllLocations } from "@/lib/api/services/location";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HotelsSidebar({ hotels, filters, setFilters }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const isRTL = language === "ar";

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
    <div
      className="sidebar -type-1 rounded-12"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <div className="sidebar__content">
        {/* Destination Filter */}
        <div className="sidebar__item">
          <h5
            className="text-18 fw-500 mb-15"
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {t("hotelsList.destination")}
          </h5>
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
                  <div
                    className="d-flex items-center"
                    style={{
                      flexDirection: isRTL ? "row-reverse" : "row",
                      justifyContent: isRTL ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      className="form-checkbox"
                      style={{ order: isRTL ? 1 : 0 }}
                    >
                      <input
                        type="checkbox"
                        checked={filters.locations.includes(location.slug)}
                        onChange={() => handleLocationChange(location.slug)}
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

                    <div
                      className={`lh-11 ${isRTL ? "mr-10" : "ml-10"}`}
                      style={{ textAlign: isRTL ? "right" : "left" }}
                    >
                      {location.name}
                      {location.country && (
                        <span
                          className={`text-light-2 ${isRTL ? "mr-5" : "ml-5"}`}
                        >
                          ({location.country})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="text-14 text-light-1"
                style={{ textAlign: isRTL ? "right" : "left" }}
              >
                {t("hotelsList.noDestinationsAvailable")}
              </div>
            )}
          </div>
        </div>

        {/* Amenities Filter */}
        <div className="sidebar__item mt-30">
          <h5
            className="text-18 fw-500 mb-15"
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {t("hotelsList.amenities")}
          </h5>
          <div className="d-flex flex-column y-gap-15">
            {uniqueAmenities.length > 0 ? (
              uniqueAmenities.map((amenity, i) => (
                <div key={i}>
                  <div
                    className="d-flex items-center"
                    style={{
                      flexDirection: isRTL ? "row-reverse" : "row",
                      justifyContent: isRTL ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      className="form-checkbox"
                      style={{ order: isRTL ? 1 : 0 }}
                    >
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

                    <div
                      className={`lh-11 ${isRTL ? "mr-10" : "ml-10"}`}
                      style={{ textAlign: isRTL ? "right" : "left" }}
                    >
                      {amenity}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="text-14 text-light-1"
                style={{ textAlign: isRTL ? "right" : "left" }}
              >
                {t("hotelsList.noAmenitiesAvailable")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
