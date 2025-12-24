"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import OffersSidebar from "./OffersSidebar";
import OfferCardSkeleton from "./OfferCardSkeleton";
import { speedFeatures } from "@/data/tourFilteringOptions";
import Pagination from "../common/Pagination";
import Image from "next/image";
import Link from "next/link";
import { STRAPI_CONFIG } from "@/config/api";
import { useLanguage } from "@/contexts/LanguageContext";

export default function OffersList({
  initialOffers = [],
  totalCount = 0,
  isLoading = false,
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [offers, setOffers] = useState(initialOffers);
  const [filteredOffers, setFilteredOffers] = useState(initialOffers);
  const [sortOption, setSortOption] = useState("");
  const [ddActives, setDdActives] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showCards, setShowCards] = useState(true);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [filters, setFilters] = useState({
    locations: [],
    months: [],
  });

  const itemsPerPage = 12;
  const dropDownContainer = useRef();

  const clearAllFilters = () => {
    setFilters({
      locations: [],
      months: [],
    });
  };

  const hasActiveFilters =
    filters.locations.length > 0 || filters.months.length > 0;
  const isRTL = language === "ar";

  // Translate English month names to Arabic
  const translateMonth = (monthName) => {
    if (!monthName || language !== "ar") return monthName;

    const monthMap = {
      January: "يناير",
      February: "فبراير",
      March: "مارس",
      April: "أبريل",
      May: "مايو",
      June: "يونيو",
      July: "يوليو",
      August: "أغسطس",
      September: "سبتمبر",
      October: "أكتوبر",
      November: "نوفمبر",
      December: "ديسمبر",
    };

    return monthMap[monthName] || monthName;
  };

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

  // Update offers when initialOffers changes (after loading)
  useEffect(() => {
    if (initialOffers.length > 0) {
      setOffers(initialOffers);
      setFilteredOffers(initialOffers);
    }
  }, [initialOffers]);

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
      let result = [...offers];

      // Filter by location
      if (filters.locations.length > 0) {
        result = result.filter((offer) => {
          if (!offer.location || !offer.location.slug) {
            console.warn("Offer missing location:", offer.title);
            return false;
          }
          const matches = filters.locations.includes(offer.location.slug);
          console.log("Location filter check:", {
            offerTitle: offer.title,
            locationSlug: offer.location.slug,
            filterLocations: filters.locations,
            matches,
          });
          return matches;
        });
      }

      // Filter by month
      if (filters.months.length > 0) {
        result = result.filter((offer) => filters.months.includes(offer.month));
      }

      // Apply sorting
      if (sortOption === "Price Low to High") {
        result.sort((a, b) => {
          const priceA = getMinPrice(a);
          const priceB = getMinPrice(b);
          return priceA - priceB;
        });
      } else if (sortOption === "Price High to Low") {
        result.sort((a, b) => {
          const priceA = getMinPrice(a);
          const priceB = getMinPrice(b);
          return priceB - priceA;
        });
      } else if (sortOption === "Newest") {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortOption === "Name A-Z") {
        result.sort((a, b) => a.title.localeCompare(b.title));
      }

      setFilteredOffers(result);
      setCurrentPage(1); // Reset to first page when filters change
      setIsFiltering(false);

      // Trigger card animations
      setTimeout(() => setShowCards(true), 50);
    }, 300);

    return () => clearTimeout(filterTimeout);
  }, [filters, sortOption, offers]);

  const getMinPrice = (offer) => {
    if (!offer.hotelOptions || offer.hotelOptions.length === 0) return 0;

    // Get all prices from all hotels and all room types
    const allPrices = offer.hotelOptions
      .flatMap(
        (option) =>
          option.roomPricing?.flatMap((room) => [
            room.doubleOccupancyPrice || 0,
            room.singleOccupancyPrice || 0,
            room.tripleOccupancyPrice || 0,
          ]) || [0]
      )
      .filter((price) => price > 0);

    return allPrices.length > 0 ? Math.min(...allPrices) : 0;
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/img/tourCards/1/1.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${STRAPI_CONFIG.url}${imageUrl}`;
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);

  return (
    <section className="layout-pb-xl">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-4">
            <div className="lg:d-none">
              <OffersSidebar
                offers={offers}
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
                  {t("offersList.filter")}
                </button>

                <div
                  className="accordion__content"
                  style={sidebarActive ? { maxHeight: "2000px" } : {}}
                >
                  <div className="pt-20">
                    <OffersSidebar
                      offers={offers}
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
                    {t("offersList.clearAllFilters")}
                  </span>
                </button>
              </div>
            )}

            <div className="row y-gap-30">
              {isLoading || isFiltering ? (
                // Show skeleton loaders while loading or filtering
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="col-lg-4 col-sm-6">
                    <OfferCardSkeleton />
                  </div>
                ))
              ) : currentOffers.length > 0 ? (
                currentOffers.map((offer, i) => (
                  <div
                    key={offer.documentId || i}
                    className={`col-lg-4 col-sm-6 ${
                      showCards ? "offer-card-enter" : ""
                    }`}
                  >
                    <Link
                      href={`/offers/${offer.documentId}`}
                      className="tourCard -type-1 py-10 px-10 border-1 rounded-12 -hover-shadow"
                    >
                      <div className="tourCard__header">
                        <div className="tourCard__image ratio ratio-28:20">
                          <Image
                            width={421}
                            height={301}
                            src={getImageUrl(offer.coverImage?.url)}
                            alt={
                              offer.coverImage?.alternativeText || offer.title
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
                          {offer.location?.name}
                          {offer.location?.country &&
                            `, ${offer.location.country}`}
                        </div>

                        <h3 className="tourCard__title text-16 fw-500 mt-5">
                          <span>{offer.title}</span>
                        </h3>

                        {offer.description && (
                          <p className="text-13 text-dark-1 mt-5 lh-16">
                            {offer.description.length > 80
                              ? `${offer.description.substring(0, 80)}...`
                              : offer.description}
                          </p>
                        )}

                        <div className="tourCard__rating d-flex items-center text-13 mt-10">
                          <div className="d-flex items-center">
                            <i
                              className={`icon-calendar text-16 text-accent-1 ${
                                isRTL ? "ml-5" : "mr-5"
                              }`}
                            ></i>
                            <span className="text-dark-1">
                              <bdi>{translateMonth(offer.month)}</bdi>{" "}
                              {offer.year}
                            </span>
                          </div>

                          {offer.hotelOptions &&
                            offer.hotelOptions.length > 0 && (
                              <span
                                className={`text-light-2 ${
                                  isRTL ? "mr-10" : "ml-10"
                                }`}
                              >
                                • {offer.hotelOptions.length}{" "}
                                {offer.hotelOptions.length > 1
                                  ? t("offersList.hotels")
                                  : t("offersList.hotel")}
                              </span>
                            )}
                        </div>

                        <div className="d-flex justify-center items-center border-1-top text-13 text-dark-1 pt-10 mt-10">
                          <div>
                            {getMinPrice(offer) > 0 ? (
                              <>
                                {t("offersList.from")}{" "}
                                <span className="text-16 fw-500">
                                  ${getMinPrice(offer).toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <span className="text-14">
                                {t("offersList.contactUs")}
                              </span>
                            )}
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
                      {t("offersList.noOffersFound")}
                    </h3>
                    <p className="text-15 text-light-1">
                      {t("offersList.noOffersDescription")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {filteredOffers.length > itemsPerPage && (
              <div className="d-flex justify-center flex-column mt-60">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />

                <div className="text-14 text-center mt-20">
                  {t("offersList.showingResults")} {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, filteredOffers.length)}{" "}
                  {t("offersList.of")} {filteredOffers.length}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
