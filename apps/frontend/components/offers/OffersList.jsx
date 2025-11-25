"use client";

import React, { useState, useEffect, useRef } from "react";
import OffersSidebar from "./OffersSidebar";
import { speedFeatures } from "@/data/tourFilteringOptions";
import Pagination from "../common/Pagination";
import Image from "next/image";
import Link from "next/link";
import { STRAPI_CONFIG } from "@/config/api";

export default function OffersList({ initialOffers = [], totalCount = 0 }) {
  const [offers, setOffers] = useState(initialOffers);
  const [filteredOffers, setFilteredOffers] = useState(initialOffers);
  const [sortOption, setSortOption] = useState("");
  const [ddActives, setDdActives] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    locations: [],
    months: [],
    priceRange: [0, 10000],
  });

  const itemsPerPage = 12;
  const dropDownContainer = useRef();

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

  // Apply filters and sorting
  useEffect(() => {
    let result = [...offers];

    // Filter by location
    if (filters.locations.length > 0) {
      result = result.filter((offer) =>
        filters.locations.includes(offer.location?.slug)
      );
    }

    // Filter by month
    if (filters.months.length > 0) {
      result = result.filter((offer) => filters.months.includes(offer.month));
    }

    // Filter by price range (check hotel options)
    result = result.filter((offer) => {
      if (!offer.hotelOptions || offer.hotelOptions.length === 0) return true;

      const minPrice = Math.min(
        ...offer.hotelOptions.flatMap(
          (option) =>
            option.roomPricing?.map((room) => room.doublePrice || 0) || [0]
        )
      );

      return (
        minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1]
      );
    });

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
  }, [filters, sortOption, offers]);

  const getMinPrice = (offer) => {
    if (!offer.hotelOptions || offer.hotelOptions.length === 0) return 0;

    const prices = offer.hotelOptions.flatMap(
      (option) =>
        option.roomPricing?.map((room) => room.doublePrice || 0) || [0]
    );

    return Math.min(...prices);
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
                  <i className="icon-sort-down mr-10 text-16"></i>
                  Filter
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
            <div className="row y-gap-5 justify-between">
              <div className="col-auto">
                <div>{filteredOffers.length} offers found</div>
              </div>

              <div ref={dropDownContainer} className="col-auto">
                <div
                  className={`dropdown -type-2 js-dropdown js-form-dd ${
                    ddActives ? "is-active" : ""
                  } `}
                  data-main-value=""
                >
                  <div
                    className="dropdown__button js-button"
                    onClick={() => setDdActives((pre) => !pre)}
                  >
                    <span>Sort by: </span>
                    <span className="js-title">
                      {sortOption ? sortOption : "Featured"}
                    </span>
                    <i className="icon-chevron-down"></i>
                  </div>

                  <div className="dropdown__menu js-menu-items">
                    {speedFeatures.map((elm, i) => (
                      <div
                        onClick={() => {
                          setSortOption((pre) => (pre == elm ? "" : elm));
                          setDdActives(false);
                        }}
                        key={i}
                        className="dropdown__item"
                        data-value={elm}
                      >
                        {elm}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="row y-gap-30 pt-30">
              {currentOffers.length > 0 ? (
                currentOffers.map((offer, i) => (
                  <div className="col-12" key={offer.documentId || i}>
                    <Link
                      href={`/offers/${offer.documentId}`}
                      className="tourCard -type-2"
                    >
                      <div className="tourCard__image">
                        <Image
                          width={360}
                          height={280}
                          src={getImageUrl(offer.coverImage?.url)}
                          alt={offer.coverImage?.alternativeText || offer.title}
                        />

                        {offer.specialOffer && (
                          <div className="tourCard__badge">
                            <div className="bg-accent-1 rounded-12 text-white lh-11 text-13 px-15 py-10">
                              SPECIAL OFFER
                            </div>
                          </div>
                        )}

                        <div className="tourCard__favorite">
                          <button className="button -accent-1 size-35 bg-white rounded-full flex-center">
                            <i className="icon-heart text-15"></i>
                          </button>
                        </div>
                      </div>

                      <div className="tourCard__content">
                        <div className="tourCard__location">
                          <i className="icon-pin"></i>
                          {offer.location?.name || "Location"}
                          {offer.location?.country &&
                            `, ${offer.location.country}`}
                        </div>

                        <h3 className="tourCard__title mt-5 text-18 lh-14">
                          <span>{offer.title}</span>
                        </h3>

                        {offer.description && (
                          <p className="tourCard__text mt-5 text-14 lh-16">
                            {offer.description.length > 120
                              ? `${offer.description.substring(0, 120)}...`
                              : offer.description}
                          </p>
                        )}

                        <div className="d-flex items-center mt-10">
                          <div className="text-13 text-accent-1">
                            <i className="icon-calendar mr-5"></i>
                            {offer.month} {offer.year}
                          </div>
                        </div>

                        {offer.hotelOptions &&
                          offer.hotelOptions.length > 0 && (
                            <div className="d-flex flex-wrap x-gap-15 pt-10">
                              {offer.hotelOptions
                                .slice(0, 2)
                                .map((option, idx) => (
                                  <div key={idx}>
                                    <div className="text-13">
                                      <i className="icon-bed mr-5"></i>
                                      {option.hotel?.name}
                                      {option.hotel?.stars && (
                                        <span className="ml-5 text-12">
                                          {"★".repeat(option.hotel.stars)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              {offer.hotelOptions.length > 2 && (
                                <div>
                                  <div className="text-13 text-accent-2">
                                    +{offer.hotelOptions.length - 2} more
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                      </div>

                      <div className="tourCard__info">
                        <div>
                          {offer.hotelOptions &&
                            offer.hotelOptions.length > 0 && (
                              <div className="d-flex items-center text-13 mb-5">
                                <i className="icon-clock mr-5"></i>
                                {offer.hotelOptions[0].nights} Nights
                              </div>
                            )}

                          <div className="tourCard__price">
                            {getMinPrice(offer) > 0 && (
                              <>
                                <div className="text-13 text-light-1">From</div>
                                <div className="d-flex items-center">
                                  <span className="text-18 fw-500">
                                    ${getMinPrice(offer).toLocaleString()}
                                  </span>
                                  <span className="text-12 text-light-1 ml-5">
                                    {offer.hotelOptions?.[0]?.currency || "USD"}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <button className="button -sm -outline-accent-1 text-accent-1">
                          View Details
                          <i className="icon-arrow-top-right ml-5"></i>
                        </button>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="text-center py-60">
                    <h3 className="text-24 fw-500 mb-20">No offers found</h3>
                    <p className="text-15 text-light-1">
                      Try adjusting your filters to find more offers
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
                  Showing results {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, filteredOffers.length)} of{" "}
                  {filteredOffers.length}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
