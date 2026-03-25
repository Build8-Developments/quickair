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
import { Clock, Star, ArrowDownAZ, Sparkles, Search, X } from "lucide-react";

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
 * @param {string} props.initialSort - Initial sort option from URL
 */
export default function HotelsList({
  initialHotels = [],
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  pageSize = 12,
  isLoading = false,
  locale = "en",
  initialSort = "newest",
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
  const [sortOption, setSortOption] = useState(initialSort);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [ddActives, setDdActives] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showCards, setShowCards] = useState(true);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  // Client-side pagination state (only used when filters are active)
  const [clientPage, setClientPage] = useState(1);

  // Initialize filter state from URL parameters (Requirements: 6.3)
  const initialFilters = parseFiltersFromUrl(
    Object.fromEntries(searchParams.entries()),
    ["locations", "amenities"],
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
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setClientPage(1);
    setSortOption("newest");
    setIsNavigating(true); // Indicate server-side navigation is happening

    // Navigate to page 1 without filter params (sort will also reset to default)
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
      setIsNavigating(true); // Indicate server-side navigation is happening

      // Build URL with filter params and navigate to page 1, preserving sort
      const params = new URLSearchParams();
      if (newFilters.locations.length > 0) {
        params.set("locations", newFilters.locations.join(","));
      }
      if (newFilters.amenities.length > 0) {
        params.set("amenities", newFilters.amenities.join(","));
      }
      if (sortOption !== "newest") {
        params.set("sort", sortOption);
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newUrl);
    },
    [pathname, router, sortOption],
  );

  // Handle sort changes - navigate with sort param
  const handleSortChange = useCallback(
    (newSort) => {
      setSortOption(newSort);
      setIsNavigating(true);

      // Build URL with current filters and new sort
      const params = new URLSearchParams();

      if (filters.locations.length > 0) {
        params.set("locations", filters.locations.join(","));
      }
      if (filters.amenities.length > 0) {
        params.set("amenities", filters.amenities.join(","));
      }
      if (newSort !== "newest") {
        params.set("sort", newSort);
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newUrl);
    },
    [pathname, router, filters],
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

  // Debounce search query to prevent excessive UI flickering
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Update hotels when initialHotels changes (server-side pagination)
  useEffect(() => {
    setHotels(initialHotels);
    setFilteredHotels(initialHotels);
    setIsNavigating(false); // Clear navigating state when server data arrives
    setShowCards(true); // Show cards immediately with new server data
  }, [initialHotels]);

  // Apply amenities filter only (location filtering is now server-side)
  useEffect(() => {
    // Skip filtering animation on initial mount
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    // Skip client-side filtering when navigating (server handles it)
    if (isNavigating) {
      return;
    }

    // Apply client-side filters (amenities, search)
    // Location filtering is handled server-side
    if (filters.amenities.length > 0 || debouncedSearchQuery.trim() !== "") {
      setIsFiltering(true);
      setShowCards(false);

      const filterTimeout = setTimeout(() => {
        let result = [...hotels];

        // Filter by search query
        if (debouncedSearchQuery.trim() !== "") {
          const query = debouncedSearchQuery.toLowerCase();
          result = result.filter(
            (hotel) =>
              hotel.name?.toLowerCase().includes(query) ||
              hotel.shortDescription?.toLowerCase().includes(query),
          );
        }

        // Filter by amenities (client-side fallback)
        if (filters.amenities.length > 0) {
          result = result.filter((hotel) => {
            if (!hotel.amenities || hotel.amenities.length === 0) {
              return false;
            }
            // Check if hotel has ALL selected amenities
            return filters.amenities.every((selectedAmenity) =>
              hotel.amenities.some(
                (amenity) => amenity.name === selectedAmenity,
              ),
            );
          });
        }

        setFilteredHotels(result);
        setClientPage(1);
        setIsFiltering(false);

        // Trigger card animations
        setTimeout(() => setShowCards(true), 50);
      }, 300);

      return () => clearTimeout(filterTimeout);
    } else {
      // No client-side filtering needed
      setFilteredHotels(hotels);
    }
  }, [
    filters.amenities,
    debouncedSearchQuery,
    hotels,
    isInitialMount,
    isNavigating,
  ]);

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
  // Now that we have server-side filtering, always use server-side pagination
  const useServerPagination = true;

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
      totalCount,
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
      filteredHotels.length,
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
  if (sortOption !== "newest") {
    preserveParams.sort = sortOption;
  }

  return (
    <section className="layout-pt-md layout-pb-xl">
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
                  className="accordion__button button -dark-1 bg-light-1 px-25 py-10 border-1"
                  onClick={() => setSidebarActive((pre) => !pre)}
                  style={{ borderRadius: "50px" }}
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
            {/* Sort and Filter Controls Bar */}
            <div
              className="d-flex flex-column gap-15 mb-20"
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            >
              {/* Top Row: Search and Sort */}
              <div
                className={`d-flex ${
                  isRTL ? "flex-row-reverse" : "flex-row"
                } justify-between items-center`}
                style={{ gap: "15px" }}
              >
                {/* (Filter Chips moved to bottom row) */}

                {/* Search Bar */}
                <div
                  className="search-bar d-flex items-center bg-white"
                  style={{
                    flex: 1,
                    maxWidth: "400px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    padding: "0 15px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#019fb1";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(1,159,177,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0,0,0,0.02)";
                  }}
                >
                  <div
                    style={{
                      color: "#6b7280",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder={t(
                      "hotelsList.searchPlaceholder",
                      "Search by hotel name...",
                    )}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="py-10"
                    style={{
                      border: "none",
                      outline: "none",
                      width: "100%",
                      padding: "0 10px",
                      background: "transparent",
                    }}
                  />
                </div>

                {/* Sort Dropdown */}
                <div
                  className={`dropdown -type-2 js-dropdown ${
                    ddActives ? "is-active" : ""
                  }`}
                  ref={dropDownContainer}
                >
                  <div
                    className="dropdown__button d-flex items-center px-20 py-10 border-1 bg-white"
                    onClick={() => setDdActives((prev) => !prev)}
                    style={{
                      cursor: "pointer",
                      minWidth: "200px",
                      justifyContent: "space-between",
                      borderRadius: "50px",
                    }}
                  >
                    <div className="d-flex items-center gap-5">
                      <span className="text-14">{t("hotelsList.sortBy")}:</span>
                      <span className="text-14 fw-500 js-title">
                        {sortOption === "newest" && t("hotelsList.sortNewest")}
                        {sortOption === "rating-high" &&
                          t("hotelsList.sortRatingHigh")}
                        {sortOption === "rating-low" &&
                          t("hotelsList.sortRatingLow")}
                        {sortOption === "name-az" && t("hotelsList.sortNameAZ")}
                        {sortOption === "featured" &&
                          t("hotelsList.sortFeatured")}
                      </span>
                    </div>
                    <i className="icon-chevron-down text-14"></i>
                  </div>

                  <div
                    className="dropdown__menu"
                    style={{
                      padding: "8px",
                      borderRadius: "24px",
                      minWidth: "max-content",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                  >
                    <div
                      className={`dropdown__item ${
                        sortOption === "newest" ? "is-active" : ""
                      }`}
                      onClick={() => {
                        handleSortChange("newest");
                        setDdActives(false);
                      }}
                      style={{
                        backgroundColor:
                          sortOption === "newest" ? "#019fb1" : "transparent",
                        color: sortOption === "newest" ? "white" : "inherit",
                        fontWeight: sortOption === "newest" ? "500" : "normal",
                        borderRadius: "50px",
                        padding: "8px 16px",
                        marginBottom: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Clock size={16} />
                      {t("hotelsList.sortNewest")}
                    </div>
                    <div
                      className={`dropdown__item ${
                        sortOption === "rating-high" ? "is-active" : ""
                      }`}
                      onClick={() => {
                        handleSortChange("rating-high");
                        setDdActives(false);
                      }}
                      style={{
                        backgroundColor:
                          sortOption === "rating-high"
                            ? "#019fb1"
                            : "transparent",
                        color:
                          sortOption === "rating-high" ? "white" : "inherit",
                        fontWeight:
                          sortOption === "rating-high" ? "500" : "normal",
                        borderRadius: "50px",
                        padding: "8px 16px",
                        marginBottom: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Star
                        size={16}
                        fill={sortOption === "rating-high" ? "white" : "none"}
                        strokeWidth={sortOption === "rating-high" ? 2 : 1.5}
                      />
                      {t("hotelsList.sortRatingHigh")}
                    </div>
                    <div
                      className={`dropdown__item ${
                        sortOption === "rating-low" ? "is-active" : ""
                      }`}
                      onClick={() => {
                        handleSortChange("rating-low");
                        setDdActives(false);
                      }}
                      style={{
                        backgroundColor:
                          sortOption === "rating-low"
                            ? "#019fb1"
                            : "transparent",
                        color:
                          sortOption === "rating-low" ? "white" : "inherit",
                        fontWeight:
                          sortOption === "rating-low" ? "500" : "normal",
                        borderRadius: "50px",
                        padding: "8px 16px",
                        marginBottom: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Star size={16} fill="none" strokeWidth={1.5} />
                      {t("hotelsList.sortRatingLow")}
                    </div>
                    <div
                      className={`dropdown__item ${
                        sortOption === "name-az" ? "is-active" : ""
                      }`}
                      onClick={() => {
                        handleSortChange("name-az");
                        setDdActives(false);
                      }}
                      style={{
                        backgroundColor:
                          sortOption === "name-az" ? "#019fb1" : "transparent",
                        color: sortOption === "name-az" ? "white" : "inherit",
                        fontWeight: sortOption === "name-az" ? "500" : "normal",
                        borderRadius: "50px",
                        padding: "8px 16px",
                        marginBottom: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <ArrowDownAZ size={16} />
                      {t("hotelsList.sortNameAZ")}
                    </div>
                    <div
                      className={`dropdown__item ${
                        sortOption === "featured" ? "is-active" : ""
                      }`}
                      onClick={() => {
                        handleSortChange("featured");
                        setDdActives(false);
                      }}
                      style={{
                        backgroundColor:
                          sortOption === "featured" ? "#019fb1" : "transparent",
                        color: sortOption === "featured" ? "white" : "inherit",
                        fontWeight:
                          sortOption === "featured" ? "500" : "normal",
                        borderRadius: "50px",
                        padding: "8px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Sparkles
                        size={16}
                        fill={sortOption === "featured" ? "white" : "none"}
                      />
                      {t("hotelsList.sortFeatured")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Active Filter Chips */}
              {(hasActiveFilters || searchQuery.trim() !== "") && (
                <div className="d-flex items-center flex-wrap gap-10 mt-10">
                  {/* Location Chips */}
                  {filters.locations.map((loc) => {
                    const locationName =
                      hotels.find((h) => h.location?.slug === loc)?.location
                        ?.name ||
                      loc
                        .split("-")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ");
                    return (
                      <button
                        key={`loc-${loc}`}
                        onClick={() => {
                          const newFilters = {
                            ...filters,
                            locations: filters.locations.filter(
                              (l) => l !== loc,
                            ),
                          };
                          handleFilterChange(newFilters);
                        }}
                        className="d-flex items-center gap-10 px-15 py-5 text-14"
                        style={{
                          backgroundColor: "white",
                          color: "#019fb1",
                          border: "1px solid #019fb1",
                          borderRadius: "50px",
                          transition: "all 0.2s ease",
                          flexDirection: isRTL ? "row-reverse" : "row",
                          margin: "0 5px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#019fb1";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "white";
                          e.currentTarget.style.color = "#019fb1";
                        }}
                      >
                        <span className="fw-500">{locationName}</span>
                        <X size={14} strokeWidth={2.5} />
                      </button>
                    );
                  })}
                  {/* Amenity Chips (Kept for compatibility if they exist in URL) */}
                  {filters.amenities.map((amenity) => (
                    <button
                      key={`am-${amenity}`}
                      onClick={() => {
                        const newFilters = {
                          ...filters,
                          amenities: filters.amenities.filter(
                            (a) => a !== amenity,
                          ),
                        };
                        handleFilterChange(newFilters);
                      }}
                      className="d-flex items-center gap-10 px-15 py-5 text-14"
                      style={{
                        backgroundColor: "white",
                        color: "#019fb1",
                        border: "1px solid #019fb1",
                        borderRadius: "50px",
                        transition: "all 0.2s ease",
                        flexDirection: isRTL ? "row-reverse" : "row",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#019fb1";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.color = "#019fb1";
                      }}
                    >
                      <span className="fw-500">{amenity}</span>
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  ))}
                  {/* Search Chip */}
                  {searchQuery.trim() !== "" && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setDebouncedSearchQuery("");
                      }}
                      className="d-flex items-center gap-10 px-15 py-5 text-14"
                      style={{
                        backgroundColor: "white",
                        color: "#019fb1",
                        border: "1px solid #019fb1",
                        borderRadius: "50px",
                        transition: "all 0.2s ease",
                        flexDirection: isRTL ? "row-reverse" : "row",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#019fb1";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.color = "#019fb1";
                      }}
                    >
                      <span className="fw-500">"{searchQuery}"</span>
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  )}
                  {/* Clear All Button */}
                  <button
                    onClick={clearAllFilters}
                    className={`text-14 text-accent-1 fw-500 underline ${isRTL ? "mr-10" : "ml-10"}`}
                  >
                    {t("hotelsList.clearAllFilters", "Clear All")}
                  </button>
                </div>
              )}
            </div>

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
