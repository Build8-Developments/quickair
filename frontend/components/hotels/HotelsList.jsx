"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import HotelsSidebar from "./HotelsSidebar";
import HotelCardSkeleton from "./HotelCardSkeleton";
import Pagination from "../common/Pagination";
import Image from "next/image";
import LocalizedLink from "../common/LocalizedLink";
import { STRAPI_CONFIG } from "@/config/api";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  calculatePaginationRange,
  buildFilteredUrl,
  parseFiltersFromUrl,
} from "@/utils/pagination";

/**
 * HotelsList component with server-side pagination support
 *
 * @param {Object} props
 * @param {Array} props.initialHotels - Hotels for the current page from server
 * @param {number} props.totalCount - Total number of hotels in database
 * @param {number} props.currentPage - Current page number (1-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.pageSize - Items per page
 * @param {boolean} props.isLoading - Whether data is loading
 * @param {string} props.locale - Current locale (en/ar)
 */
export default function HotelsList({
  initialHotels = [],
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

  // State for hotels data
  const [hotels, setHotels] = useState(initialHotels);
  const [filteredHotels, setFilteredHotels] = useState(initialHotels);

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
    ["locations", "amenities"]
  );

  // Filter state
  const [filters, setFilters] = useState(initialFilters);

  const dropDownContainer = useRef();

  // Navigate to page 1 with cleared filters (Requirements: 6.4)
  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      locations: [],
      amenities: [],
    };
    setFilters(clearedFilters);
    setClientPage(1);

    // Navigate to page 1 without filter params
    router.push(pathname);
  }, [pathname, router]);

  const hasActiveFilters =
    filters.locations.length > 0 || filters.amenities.length > 0;
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

  // Update hotels when initialHotels changes (server-side pagination)
  useEffect(() => {
    setHotels(initialHotels);
    // Only reset filtered hotels if no filters are active
    if (!hasActiveFilters) {
      setFilteredHotels(initialHotels);
    }
  }, [initialHotels]);

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
      let result = [...hotels];

      // Filter by location
      if (filters.locations.length > 0) {
        result = result.filter((hotel) => {
          if (!hotel.location || !hotel.location.slug) {
            return false;
          }
          return filters.locations.includes(hotel.location.slug);
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
        result.sort((a, b) => (a.stars || 0) - (b.stars || 0));
      } else if (sortOption === "Price High to Low") {
        result.sort((a, b) => (b.stars || 0) - (a.stars || 0));
      } else if (sortOption === "Newest") {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortOption === "Name A-Z") {
        result.sort((a, b) => a.name.localeCompare(b.name));
      }

      setFilteredHotels(result);
      setClientPage(1); // Reset to first page when filters change
      setIsFiltering(false);

      // Trigger card animations
      setTimeout(() => setShowCards(true), 50);
    }, 300);

    return () => clearTimeout(filterTimeout);
  }, [filters, sortOption, hotels]);

  const getImageUrl = (hotel) => {
    // Priority: externalImageUrl > coverImage > fallback
    if (hotel?.externalImageUrl) return hotel.externalImageUrl;
    if (hotel?.coverImage?.url) {
      const imageUrl = hotel.coverImage.url;
      if (imageUrl.startsWith("http")) return imageUrl;
      return `${STRAPI_CONFIG.url}${imageUrl}`;
    }
    return "/img/tourCards/1/1.png";
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

  // Determine which pagination mode to use
  // - Server-side: when no filters are active (use URL-based pagination)
  // - Client-side: when filters are active (filter current page's data)
  const useServerPagination = !hasActiveFilters;

  // Calculate display data based on pagination mode
  let displayHotels;
  let displayTotalPages;
  let displayCurrentPage;
  let displayTotalCount;
  let paginationRange;

  if (useServerPagination) {
    // Server-side pagination: display hotels from server
    displayHotels = filteredHotels;
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
    displayHotels = filteredHotels.slice(indexOfFirstItem, indexOfLastItem);
    displayTotalPages = Math.ceil(filteredHotels.length / pageSize);
    displayCurrentPage = clientPage;
    displayTotalCount = filteredHotels.length;
    paginationRange = calculatePaginationRange(
      clientPage,
      pageSize,
      filteredHotels.length
    );
  }

  // Build base URL for server-side pagination with preserved filter params (Requirements: 6.3)
  const baseUrl = pathname;
  const preserveParams = {};
  if (filters.locations.length > 0) {
    preserveParams.locations = filters.locations.join(",");
  }
  if (filters.amenities.length > 0) {
    preserveParams.amenities = filters.amenities.join(",");
  }

  return (
    <section className="layout-pb-xl">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-4">
            <div className="lg:d-none">
              <HotelsSidebar
                hotels={hotels}
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
                    {t("hotelsList.clearAllFilters")}
                  </span>
                </button>
              </div>
            )}

            <div className="row y-gap-30">
              {isLoading || isFiltering ? (
                // Show skeleton loaders while loading or filtering (Requirements: 4.1, 4.3)
                Array.from({ length: pageSize }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="col-lg-4 col-sm-6">
                    <HotelCardSkeleton />
                  </div>
                ))
              ) : displayHotels.length > 0 ? (
                displayHotels.map((hotel, i) => (
                  <div
                    key={hotel.documentId || i}
                    className={`col-lg-4 col-sm-6 ${
                      showCards ? "hotel-card-enter" : ""
                    }`}
                  >
                    <LocalizedLink
                      href={`/hotels/${hotel.documentId}`}
                      className="tourCard -type-1 py-10 px-10 border-1 rounded-12 -hover-shadow"
                    >
                      <div className="tourCard__header">
                        <div className="tourCard__image ratio ratio-28:20">
                          <Image
                            width={421}
                            height={301}
                            src={getImageUrl(hotel)}
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
                    </LocalizedLink>
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
                  {t("hotelsList.showingResults")} {paginationRange.start}-
                  {paginationRange.end} {t("hotelsList.of")} {displayTotalCount}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
