"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import OffersSidebar from "./OffersSidebar";
import OfferCardSkeleton from "./OfferCardSkeleton";
import Pagination from "../common/Pagination";
import Image from "next/image";
import LocalizedLink from "../common/LocalizedLink";
import { STRAPI_CONFIG } from "@/config/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCurrencyByCountry } from "@/utils/currency";
import {
  calculatePaginationRange,
  buildFilteredUrl,
  parseFiltersFromUrl,
} from "@/utils/pagination";

/**
 * OffersList component with server-side pagination support
 *
 * @param {Object} props
 * @param {Array} props.initialOffers - Offers for the current page from server
 * @param {number} props.totalCount - Total number of offers in database
 * @param {number} props.currentPage - Current page number (1-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.pageSize - Items per page
 * @param {boolean} props.isLoading - Whether data is loading
 * @param {string} props.locale - Current locale (en/ar)
 */
export default function OffersList({
  initialOffers = [],
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  pageSize = 12,
  isLoading = false,
  locale = "en",
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for offers data
  const [offers, setOffers] = useState(initialOffers);
  const [filteredOffers, setFilteredOffers] = useState(initialOffers);

  // UI state
  const [sortOption, setSortOption] = useState("");
  const [ddActives, setDdActives] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showCards, setShowCards] = useState(true);
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Client-side pagination state (only used when filters are active)
  const [clientPage, setClientPage] = useState(1);

  // Initialize filter state from URL parameters (Requirements: 6.3)
  const initialFilters = parseFiltersFromUrl(
    Object.fromEntries(searchParams.entries()),
    ["locations", "months"]
  );

  // Filter state
  const [filters, setFilters] = useState(initialFilters);

  const dropDownContainer = useRef();

  // Navigate to page 1 with cleared filters (Requirements: 6.4)
  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      locations: [],
      months: [],
    };
    setFilters(clearedFilters);
    setClientPage(1);

    // Navigate to page 1 without filter params
    router.push(pathname);
  }, [pathname, router]);

  const hasActiveFilters =
    filters.locations.length > 0 || filters.months.length > 0;
  const isRTL = language === "ar";

  // Handle filter changes - navigate to page 1 with filter params (Requirements: 2.5, 6.1, 6.2)
  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      setClientPage(1);

      // Build URL with filter params and navigate to page 1
      const newUrl = buildFilteredUrl(pathname, newFilters, 1);
      router.push(newUrl);
    },
    [pathname, router]
  );

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

  // Close dropdown when clicking outside
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
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Update offers when initialOffers changes (server-side pagination)
  useEffect(() => {
    setOffers(initialOffers);
    // Only reset filtered offers if no filters are active
    if (!hasActiveFilters) {
      setFilteredOffers(initialOffers);
    }
  }, [initialOffers]);

  // Apply filters and sorting with loading state (client-side filtering)
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
          return filters.locations.includes(offer.location.slug);
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
      setClientPage(1); // Reset to first page when filters change
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

  // Get currency based on offer location (Egypt = EGP, others = USD)
  const getOfferCurrency = (offer) => {
    // First check if any hotel option has a currency set
    if (offer.hotelOptions && offer.hotelOptions.length > 0) {
      const firstOptionWithCurrency = offer.hotelOptions.find(
        (opt) => opt.currency
      );
      if (firstOptionWithCurrency) {
        return firstOptionWithCurrency.currency;
      }
      // Check hotel location
      const firstHotelWithLocation = offer.hotelOptions.find(
        (opt) => opt.hotel?.location?.country
      );
      if (firstHotelWithLocation) {
        return getCurrencyByCountry(
          firstHotelWithLocation.hotel.location.country,
          "USD"
        );
      }
    }
    // Fall back to offer location
    return getCurrencyByCountry(offer.location?.country, "USD");
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/img/tourCards/1/1.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${STRAPI_CONFIG.url}${imageUrl}`;
  };

  // Determine which pagination mode to use
  // - Server-side: when no filters are active (use URL-based pagination)
  // - Client-side: when filters are active (filter current page's data)
  const useServerPagination = !hasActiveFilters;

  // Calculate display data based on pagination mode
  let displayOffers;
  let displayTotalPages;
  let displayCurrentPage;
  let displayTotalCount;
  let paginationRange;

  if (useServerPagination) {
    // Server-side pagination: display offers from server
    displayOffers = filteredOffers;
    displayTotalPages = totalPages;
    displayCurrentPage = currentPage;
    displayTotalCount = totalCount;
    paginationRange = calculatePaginationRange(
      currentPage,
      pageSize,
      totalCount
    );
  } else {
    // Client-side pagination: paginate filtered results
    const indexOfLastItem = clientPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    displayOffers = filteredOffers.slice(indexOfFirstItem, indexOfLastItem);
    displayTotalPages = Math.ceil(filteredOffers.length / pageSize);
    displayCurrentPage = clientPage;
    displayTotalCount = filteredOffers.length;
    paginationRange = calculatePaginationRange(
      clientPage,
      pageSize,
      filteredOffers.length
    );
  }

  // Build base URL for server-side pagination with preserved filter params (Requirements: 6.3)
  const baseUrl = pathname;
  const preserveParams = {};
  if (filters.locations.length > 0) {
    preserveParams.locations = filters.locations.join(",");
  }
  if (filters.months.length > 0) {
    preserveParams.months = filters.months.join(",");
  }

  return (
    <section className="layout-pb-xl">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-4">
            <div className="lg:d-none">
              <OffersSidebar
                offers={offers}
                filters={filters}
                setFilters={handleFilterChange}
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
                      setFilters={handleFilterChange}
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
                // Show skeleton loaders while loading or filtering (Requirements: 4.2, 4.3)
                Array.from({ length: pageSize }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="col-lg-4 col-sm-6">
                    <OfferCardSkeleton />
                  </div>
                ))
              ) : displayOffers.length > 0 ? (
                displayOffers.map((offer, i) => (
                  <div
                    key={offer.documentId || i}
                    className={`col-lg-4 col-sm-6 ${
                      showCards ? "offer-card-enter" : ""
                    }`}
                  >
                    <LocalizedLink
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
                                  {getMinPrice(offer).toLocaleString()}{" "}
                                  {getOfferCurrency(offer)}
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
                    </LocalizedLink>
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

            {/* Pagination Controls (Requirements: 3.1, 3.6) */}
            {displayTotalPages > 1 && (
              <div className="d-flex justify-center flex-column mt-60">
                {useServerPagination ? (
                  // URL-based pagination for server-side (Requirements: 3.1, 3.2, 3.3, 3.4)
                  <Pagination
                    currentPage={displayCurrentPage}
                    totalPages={displayTotalPages}
                    baseUrl={baseUrl}
                    preserveParams={preserveParams}
                    isLoading={isLoading}
                  />
                ) : (
                  // Controlled pagination for client-side filtered results
                  <Pagination
                    currentPage={displayCurrentPage}
                    totalPages={displayTotalPages}
                    onPageChange={setClientPage}
                  />
                )}

                {/* Results summary (Requirements: 3.5, 5.1, 5.2) */}
                <div
                  className="text-14 text-center mt-20"
                  style={{ direction: isRTL ? "rtl" : "ltr" }}
                >
                  {t("offersList.showingResults")} {paginationRange.start}-
                  {paginationRange.end} {t("offersList.of")} {displayTotalCount}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
