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
import {
  Search,
  Clock,
  ArrowDownAZ,
  TrendingUp,
  TrendingDown,
  X,
} from "lucide-react";

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

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Client-side pagination state (only used when filters are active)
  const [clientPage, setClientPage] = useState(1);

  // Initialize filter state from URL parameters (Requirements: 6.3)
  const initialFilters = parseFiltersFromUrl(
    Object.fromEntries(searchParams.entries()),
    ["locations", "months"],
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
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSortOption("Newest");
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
    [pathname, router],
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

      // Filter by search query
      if (debouncedSearchQuery.trim() !== "") {
        const query = debouncedSearchQuery.toLowerCase();
        result = result.filter(
          (offer) =>
            offer.title?.toLowerCase().includes(query) ||
            offer.description?.toLowerCase().includes(query),
        );
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
  }, [filters, sortOption, offers, debouncedSearchQuery]);

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
          ]) || [0],
      )
      .filter((price) => price > 0);

    return allPrices.length > 0 ? Math.min(...allPrices) : 0;
  };

  // Get currency based on offer location (Egypt = EGP, others = USD)
  const getOfferCurrency = (offer) => {
    // First check if any hotel option has a currency set
    if (offer.hotelOptions && offer.hotelOptions.length > 0) {
      const firstOptionWithCurrency = offer.hotelOptions.find(
        (opt) => opt.currency,
      );
      if (firstOptionWithCurrency) {
        return firstOptionWithCurrency.currency;
      }
      // Check hotel location
      const firstHotelWithLocation = offer.hotelOptions.find(
        (opt) => opt.hotel?.location?.country,
      );
      if (firstHotelWithLocation) {
        return getCurrencyByCountry(
          firstHotelWithLocation.hotel.location.country,
          "USD",
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
      totalCount,
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
      filteredOffers.length,
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
    <section className="layout-pt-md layout-pb-xl">
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
                      "offersList.searchPlaceholder",
                      "Search offers...",
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
                        {sortOption === "Newest" && t("hotelsList.sortNewest")}
                        {sortOption === "Price Low to High" &&
                          t("hotelsList.sortPriceLow", "Price (Low to High)")}
                        {sortOption === "Price High to Low" &&
                          t("hotelsList.sortPriceHigh", "Price (High to Low)")}
                        {sortOption === "Name A-Z" &&
                          t("hotelsList.sortNameAZ")}
                        {!sortOption && t("hotelsList.sortNewest")}
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
                      zIndex: 10,
                    }}
                  >
                    <div
                      className={`dropdown__item ${
                        !sortOption || sortOption === "Newest"
                          ? "is-active"
                          : ""
                      }`}
                      onClick={() => {
                        setSortOption("Newest");
                        setDdActives(false);
                      }}
                      style={{
                        backgroundColor:
                          !sortOption || sortOption === "Newest"
                            ? "#019fb1"
                            : "transparent",
                        color:
                          !sortOption || sortOption === "Newest"
                            ? "white"
                            : "inherit",
                        fontWeight:
                          !sortOption || sortOption === "Newest"
                            ? "500"
                            : "normal",
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
                        sortOption === "Price Low to High" ? "is-active" : ""
                      }`}
                      onClick={() => {
                        setSortOption("Price Low to High");
                        setDdActives(false);
                      }}
                      style={{
                        backgroundColor:
                          sortOption === "Price Low to High"
                            ? "#019fb1"
                            : "transparent",
                        color:
                          sortOption === "Price Low to High"
                            ? "white"
                            : "inherit",
                        fontWeight:
                          sortOption === "Price Low to High" ? "500" : "normal",
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
                      <TrendingUp size={16} />
                      {t("hotelsList.sortPriceLow", "Price (Low to High)")}
                    </div>
                    <div
                      className={`dropdown__item ${
                        sortOption === "Price High to Low" ? "is-active" : ""
                      }`}
                      onClick={() => {
                        setSortOption("Price High to Low");
                        setDdActives(false);
                      }}
                      style={{
                        backgroundColor:
                          sortOption === "Price High to Low"
                            ? "#019fb1"
                            : "transparent",
                        color:
                          sortOption === "Price High to Low"
                            ? "white"
                            : "inherit",
                        fontWeight:
                          sortOption === "Price High to Low" ? "500" : "normal",
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
                      <TrendingDown size={16} />
                      {t("hotelsList.sortPriceHigh", "Price (High to Low)")}
                    </div>
                    <div
                      className={`dropdown__item ${
                        sortOption === "Name A-Z" ? "is-active" : ""
                      }`}
                      onClick={() => {
                        setSortOption("Name A-Z");
                        setDdActives(false);
                      }}
                      style={{
                        backgroundColor:
                          sortOption === "Name A-Z" ? "#019fb1" : "transparent",
                        color: sortOption === "Name A-Z" ? "white" : "inherit",
                        fontWeight:
                          sortOption === "Name A-Z" ? "500" : "normal",
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
                      <ArrowDownAZ size={16} />
                      {t("hotelsList.sortNameAZ")}
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
                      offers.find((o) => o.location?.slug === loc)?.location
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

                  {/* Month Chips */}
                  {filters.months.map((month) => (
                    <button
                      key={`month-${month}`}
                      onClick={() => {
                        const newFilters = {
                          ...filters,
                          months: filters.months.filter((m) => m !== month),
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
                      <span className="fw-500">{translateMonth(month)}</span>
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
