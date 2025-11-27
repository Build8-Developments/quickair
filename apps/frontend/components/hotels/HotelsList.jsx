"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import HotelsSidebar from "./HotelsSidebar";
import HotelCardSkeleton from "./HotelCardSkeleton";
import Pagination from "../common/Pagination";
import Image from "next/image";
import Link from "next/link";
import { STRAPI_CONFIG } from "@/config/api";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HotelsList({
  initialHotels = [],
  totalCount = 0,
  isLoading = false,
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [hotels, setHotels] = useState(initialHotels);
  const [filteredHotels, setFilteredHotels] = useState(initialHotels);
  const [sortOption, setSortOption] = useState("");
  const [ddActives, setDdActives] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showCards, setShowCards] = useState(true);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [filters, setFilters] = useState({
    locations: [],
    amenities: [],
  });

  const itemsPerPage = 12;
  const dropDownContainer = useRef();

  const clearAllFilters = () => {
    setFilters({
      locations: [],
      amenities: [],
    });
  };

  const hasActiveFilters =
    filters.locations.length > 0 || filters.amenities.length > 0;
  const isRTL = language === "ar";

  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setDdActives(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // Update hotels when initialHotels changes (after loading)
  useEffect(() => {
    if (initialHotels.length > 0) {
      setHotels(initialHotels);
      setFilteredHotels(initialHotels);
    }
  }, [initialHotels]);

  // Apply filters and sorting with loading state
  useEffect(() => {
    // Skip filtering animation on initial mount
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    setIsFiltering(true);
    setShowCards(false);

    // Simulate filtering delay for smooth UX
    const filterTimeout = setTimeout(() => {
      let result = [...hotels];

      // Filter by location
      if (filters.locations.length > 0) {
        result = result.filter((hotel) => {
          if (!hotel.location || !hotel.location.slug) {
            console.warn("Hotel missing location:", hotel.name);
            return false;
          }
          const matches = filters.locations.includes(hotel.location.slug);
          return matches;
        });
      }

      // Filter by amenities
      if (filters.amenities.length > 0) {
        result = result.filter((hotel) => {
          if (!hotel.amenities || hotel.amenities.length === 0) {
            return false;
          }
          // Check if hotel has ALL selected amenities
          return filters.amenities.every((selectedAmenity) =>
            hotel.amenities.some((amenity) => amenity.name === selectedAmenity)
          );
        });
      }

      // Apply sorting
      if (sortOption === "Price Low to High") {
        result.sort((a, b) => {
          // Since hotels don't have direct pricing, sort by stars
          return (a.stars || 0) - (b.stars || 0);
        });
      } else if (sortOption === "Price High to Low") {
        result.sort((a, b) => {
          return (b.stars || 0) - (a.stars || 0);
        });
      } else if (sortOption === "Newest") {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortOption === "Name A-Z") {
        result.sort((a, b) => a.name.localeCompare(b.name));
      }

      setFilteredHotels(result);
      setCurrentPage(1); // Reset to first page when filters change
      setIsFiltering(false);

      // Trigger card animations
      setTimeout(() => setShowCards(true), 50);
    }, 300);

    return () => clearTimeout(filterTimeout);
  }, [filters, sortOption, hotels]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/img/tourCards/1/1.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${STRAPI_CONFIG.url}${imageUrl}`;
  };

  // Render stars rating
  const renderStars = (stars) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <i
        key={i}
        className={`icon-star text-10 ${
          i < stars ? "text-accent-1" : "text-light-1"
        }`}
      ></i>
    ));
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  return (
    <section className="layout-pb-xl">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-4">
            <div className="lg:d-none">
              <HotelsSidebar
                hotels={hotels}
                filters={filters}
                setFilters={setFilters}
              />
            </div>

            <div className="accordion d-none mb-30 lg:d-flex js-accordion">
              <div
                className={`accordion__item col-12 ${
                  sidebarActive ? "is-active" : ""
                } `}
              >
                <button
                  className="accordion__button button -dark-1 bg-light-1 px-25 py-10 border-1 rounded-12"
                  onClick={() => setSidebarActive((pre) => !pre)}
                >
                  <i
                    className={`icon-sort-down text-16 ${
                      isRTL ? "ml-10" : "mr-10"
                    }`}
                  ></i>
                  {t("hotelsList.filter")}
                </button>

                <div
                  className="accordion__content"
                  style={sidebarActive ? { maxHeight: "2000px" } : {}}
                >
                  <div className="pt-20">
                    <HotelsSidebar
                      hotels={hotels}
                      filters={filters}
                      setFilters={setFilters}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-9 col-lg-8">
            {hasActiveFilters && (
              <div
                className={`d-flex ${
                  isRTL ? "justify-start" : "justify-start"
                } mb-20 clear-filters-enter`}
                style={{ direction: isRTL ? "rtl" : "ltr" }}
              >
                <button
                  onClick={clearAllFilters}
                  className="button -sm -outline-accent-1 text-accent-1 px-20 py-10 rounded-8 d-flex items-center gap-10"
                >
                  <i className="icon-close text-14"></i>
                  <span className="text-14">
                    {t("hotelsList.clearAllFilters")}
                  </span>
                </button>
              </div>
            )}

            <div className="row y-gap-30">
              {isLoading || isFiltering ? (
                // Show skeleton loaders while loading or filtering
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="col-lg-4 col-sm-6">
                    <HotelCardSkeleton />
                  </div>
                ))
              ) : currentHotels.length > 0 ? (
                currentHotels.map((hotel, i) => (
                  <div
                    key={hotel.documentId || i}
                    className={`col-lg-4 col-sm-6 ${
                      showCards ? "hotel-card-enter" : ""
                    }`}
                  >
                    <Link
                      href={`/hotels/${hotel.documentId}`}
                      className="tourCard -type-1 py-10 px-10 border-1 rounded-12 -hover-shadow"
                    >
                      <div className="tourCard__header">
                        <div className="tourCard__image ratio ratio-28:20">
                          <Image
                            width={421}
                            height={301}
                            src={getImageUrl(hotel.coverImage?.url)}
                            alt={
                              hotel.coverImage?.alternativeText || hotel.name
                            }
                            className="img-ratio rounded-12"
                          />
                        </div>
                      </div>

                      <div
                        className="tourCard__content px-10 pt-10"
                        style={{ textAlign: isRTL ? "right" : "left" }}
                      >
                        <div className="tourCard__location d-flex items-center text-13 text-light-2">
                          <i
                            className={`icon-pin d-flex text-16 text-light-2 ${
                              isRTL ? "ml-5" : "mr-5"
                            }`}
                          ></i>
                          {hotel.location?.name}
                          {hotel.location?.country &&
                            `, ${hotel.location.country}`}
                        </div>

                        <h3 className="tourCard__title text-16 fw-500 mt-5">
                          <span>{hotel.name}</span>
                        </h3>

                        {hotel.shortDescription && (
                          <p className="text-13 text-dark-1 mt-5 lh-16">
                            {hotel.shortDescription.length > 80
                              ? `${hotel.shortDescription.substring(0, 80)}...`
                              : hotel.shortDescription}
                          </p>
                        )}

                        <div className="tourCard__rating d-flex items-center text-13 mt-10">
                          <div className="d-flex items-center gap-5">
                            {hotel.stars && renderStars(hotel.stars)}
                          </div>

                          {hotel.amenities && hotel.amenities.length > 0 && (
                            <span
                              className={`text-light-2 ${
                                isRTL ? "mr-10" : "ml-10"
                              }`}
                            >
                              • {hotel.amenities.length}{" "}
                              {hotel.amenities.length > 1
                                ? t("hotelsList.amenities")
                                : t("hotelsList.amenity")}
                            </span>
                          )}
                        </div>

                        <div className="d-flex justify-center items-center border-1-top text-13 text-dark-1 pt-10 mt-10">
                          <div>
                            <span className="text-14">
                              {t("hotelsList.viewDetails")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="text-center py-60">
                    <h3 className="text-24 fw-500 mb-20">
                      {t("hotelsList.noHotelsFound")}
                    </h3>
                    <p className="text-15 text-light-1">
                      {t("hotelsList.noHotelsDescription")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {filteredHotels.length > itemsPerPage && (
              <div className="d-flex justify-center flex-column mt-60">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />

                <div className="text-14 text-center mt-20">
                  {t("hotelsList.showingResults")} {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, filteredHotels.length)}{" "}
                  {t("hotelsList.of")} {filteredHotels.length}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
