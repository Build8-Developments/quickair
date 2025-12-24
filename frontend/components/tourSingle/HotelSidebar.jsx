"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getStrapiURL } from "@/lib/strapi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import Calender from "@/components/common/dropdownSearch/Calender";
import BookingModal from "./BookingModal";
import {
  Star,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  Ticket,
  Info,
  Shield,
  Clock,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Moon,
  Coffee,
  Car,
  Headphones,
  Utensils,
} from "lucide-react";

export default function HotelSidebar({ hotel, offer, hotelOption }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // Ticket counters
  const [adultNumber, setAdultNumber] = useState(2);
  const [childrenNumber, setChildrenNumber] = useState(0);

  // Date selection - Initialize with default dates
  const [selectedDates, setSelectedDates] = useState(() => {
    if (typeof window !== "undefined") {
      const { DateObject } = require("react-multi-date-picker");
      return [
        new DateObject().setDay(5),
        new DateObject().setDay(14).add(1, "month"),
      ];
    }
    return [];
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Optional trips selection
  const [selectedTrips, setSelectedTrips] = useState({});
  const [tripPersonCounts, setTripPersonCounts] = useState({});

  // UI state
  const [showPricingDetails, setShowPricingDetails] = useState(false);
  const [showWhatsIncluded, setShowWhatsIncluded] = useState(true);

  // Initialize trip person counts when trips change
  useEffect(() => {
    if (offer?.optionalTrips) {
      const initialCounts = {};
      offer.optionalTrips.forEach((trip, index) => {
        initialCounts[index] = 1;
      });
      setTripPersonCounts(initialCounts);
    }
  }, [offer?.optionalTrips]);

  // Get selected room pricing (always use first/default room type)
  const getSelectedRoomPricing = () => {
    if (hotelOption?.roomPricing && hotelOption.roomPricing.length > 0) {
      return hotelOption.roomPricing[0];
    }
    return null;
  };

  // Get pricing for display
  const getAdultPrice = () => {
    const roomPricing = getSelectedRoomPricing();
    if (roomPricing) {
      // Show price based on number of adults
      if (adultNumber === 1) {
        return (
          roomPricing.singleOccupancyPrice ||
          roomPricing.doubleOccupancyPrice ||
          0
        );
      } else if (adultNumber === 2) {
        return roomPricing.doubleOccupancyPrice || 0;
      } else if (adultNumber >= 3) {
        return (
          roomPricing.tripleOccupancyPrice ||
          roomPricing.doubleOccupancyPrice ||
          0
        );
      }
      return roomPricing.doubleOccupancyPrice || 0;
    }
    return 0;
  };

  const getChildPrice = () => {
    if (hotelOption?.kidsPricing && hotelOption.kidsPricing.length > 0) {
      const kidsPricing = hotelOption.kidsPricing[0];
      if (kidsPricing.isFree) return 0;
      if (kidsPricing.price) return kidsPricing.price;
      if (kidsPricing.discount) {
        return getAdultPrice() * (1 - kidsPricing.discount / 100);
      }
    }
    return getAdultPrice();
  };

  // Get age range for children
  const getChildrenAgeRange = () => {
    if (hotelOption?.kidsPricing && hotelOption.kidsPricing.length > 0) {
      const kidsPricing = hotelOption.kidsPricing[0];
      if (
        kidsPricing.ageFrom !== undefined &&
        kidsPricing.ageTo !== undefined
      ) {
        return `${kidsPricing.ageFrom}-${kidsPricing.ageTo} ${
          t("hotel.years") || "years"
        }`;
      }
    }
    return "";
  };

  // Get occupancy type text
  const getOccupancyText = () => {
    if (adultNumber === 1) return t("hotel.singleOccupancy") || "Single";
    if (adultNumber === 2) return t("hotel.doubleOccupancy") || "Double";
    if (adultNumber >= 3) return t("hotel.tripleOccupancy") || "Triple";
    return "";
  };

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;

    // Add room pricing based on per-person occupancy
    const roomPricing = getSelectedRoomPricing();
    if (roomPricing) {
      const totalAdults = adultNumber;

      // Calculate cost based on occupancy distribution
      let remainingAdults = totalAdults;
      let adultsCost = 0;

      // Prefer double occupancy (most common)
      const doublePrice = roomPricing.doubleOccupancyPrice || 0;
      const singlePrice = roomPricing.singleOccupancyPrice || doublePrice;
      const triplePrice = roomPricing.tripleOccupancyPrice || doublePrice;

      // Fill double rooms first
      const doubleRooms = Math.floor(remainingAdults / 2);
      adultsCost += doubleRooms * 2 * doublePrice;
      remainingAdults -= doubleRooms * 2;

      // Handle remaining single adult
      if (remainingAdults === 1) {
        adultsCost += singlePrice;
      }

      total += adultsCost;

      // Add children pricing if available
      if (
        childrenNumber > 0 &&
        hotelOption.kidsPricing &&
        hotelOption.kidsPricing.length > 0
      ) {
        // Use first kids pricing rule (you might want to add age selection in UI)
        const kidsPricing = hotelOption.kidsPricing[0];
        if (kidsPricing.isFree) {
          // Kids are free
        } else if (kidsPricing.discount) {
          total +=
            childrenNumber * doublePrice * (1 - kidsPricing.discount / 100);
        } else if (kidsPricing.price) {
          total += childrenNumber * kidsPricing.price;
        }
      } else {
        // No kids pricing defined, apply regular double price
        total += childrenNumber * doublePrice;
      }
    }

    // Add optional trips
    if (offer?.optionalTrips) {
      offer.optionalTrips.forEach((trip, index) => {
        if (selectedTrips[index]) {
          total += trip.pricePerPerson * (tripPersonCounts[index] || 1);
        }
      });
    }

    return total;
  };

  const toggleTrip = (index) => {
    setSelectedTrips((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const updateTripPersonCount = (index, delta) => {
    setTripPersonCounts((prev) => ({
      ...prev,
      [index]: Math.max(1, (prev[index] || 1) + delta),
    }));
  };

  const handleSendWhatsApp = () => {
    // Prepare booking details
    const optionalTripsData = [];
    if (offer?.optionalTrips) {
      offer.optionalTrips.forEach((trip, index) => {
        if (selectedTrips[index]) {
          optionalTripsData.push({
            title: trip.title,
            persons: tripPersonCounts[index] || 1,
          });
        }
      });
    }

    // Format selected dates
    let checkInDate = "";
    let checkOutDate = "";
    if (selectedDates && selectedDates.length === 2) {
      checkInDate = selectedDates[0]?.format?.("MMMM DD, YYYY") || "";
      checkOutDate = selectedDates[1]?.format?.("MMMM DD, YYYY") || "";
    }

    const bookingDetails = {
      hotelName: hotel.name,
      period: offer ? `${offer.month} ${offer.year}` : "",
      checkInDate,
      checkOutDate,
      nights: hotelOption?.nights || 0,
      adults: adultNumber,
      children: childrenNumber,
      optionalTrips: optionalTripsData,
      total: calculateTotal().toLocaleString(),
      currency: hotelOption?.currency || "USD",
    };

    // Open modal instead of WhatsApp
    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (formData) => {
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send booking");
      }

      // Close modal after successful submission
      setIsModalOpen(false);

      // Show success message
      alert(
        t("booking.successMessage") ||
          "Booking request sent successfully! We will contact you shortly."
      );
    } catch (error) {
      console.error("Booking submission error:", error);
      throw error; // Let BookingModal handle the error display
    }
  };

  return (
    <div className="tourSingleSidebar w-100">
      {/* Enhanced Pricing Header */}
      <div className="premium-price-card">
        <div className="price-badge">
          <Star size={14} fill="currentColor" />
          <span className="text-12 fw-500 ml-5">
            {t("hotel.bestValue") || "Best Value"}
          </span>
        </div>
        <div className="d-flex items-center justify-between">
          <div>
            <div className="text-14 text-light-2 mb-5">
              {t("hotel.from") || "From"}
            </div>
            {hotelOption?.roomPricing && hotelOption.roomPricing.length > 0 && (
              <div className="text-30 fw-700 text-accent-1">
                {Math.min(
                  ...hotelOption.roomPricing
                    .map((p) =>
                      Math.min(
                        p.singleOccupancyPrice || Infinity,
                        p.doubleOccupancyPrice || Infinity,
                        p.tripleOccupancyPrice || Infinity
                      )
                    )
                    .filter((p) => p !== Infinity)
                ).toLocaleString()}{" "}
                <span className="text-18 text-dark-1">
                  {hotelOption.currency}
                </span>
              </div>
            )}
            <div className="text-13 text-light-2 mt-5">
              <Users size={14} className="inline mr-5" />
              {t("hotel.perPerson") || "per person"}
            </div>
          </div>
          {hotelOption?.nights && (
            <div className="nights-badge">
              <div className="text-24 fw-700">{hotelOption.nights}</div>
              <div className="text-11">{t("hotel.nights") || "nights"}</div>
            </div>
          )}
        </div>
      </div>

      {/* What's Included Section */}
      <div className="mt-20">
        <div
          className="collapsible-header"
          onClick={() => setShowWhatsIncluded(!showWhatsIncluded)}
        >
          <div className="d-flex items-center">
            <CheckCircle size={20} className="text-accent-1 mr-10" />
            <h5 className="text-16 fw-600">
              {t("hotel.whatsIncluded") || "What's Included"}
            </h5>
          </div>
          {showWhatsIncluded ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
        </div>
        {showWhatsIncluded && (
          <div className="included-list">
            <div className="included-item">
              <Moon size={14} className="text-accent-1" />
              <span>
                {hotelOption?.nights || 0} {t("hotel.nights") || "nights"}{" "}
                {t("hotel.accommodation") || "accommodation"}
              </span>
            </div>
            <div className="included-item">
              <Headphones size={14} className="text-accent-1" />
              <span>{t("hotel.support247") || "24/7 Customer Support"}</span>
            </div>
            {hotelOption?.mealPlan?.name && (
              <div className="included-item">
                <Utensils size={14} className="text-accent-1" />
                <span>{hotelOption.mealPlan.name}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Date Selection */}
      <div className="searchForm -type-1 -sidebar mt-20">
        <div className="searchForm__form">
          <div className="searchFormItem js-select-control js-form-dd js-calendar">
            <div className="searchFormItem__button" data-x-click="calendar">
              <div className="searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center">
                <Calendar size={20} />
              </div>
              <div className="searchFormItem__content">
                <h5>{t("hotel.dates") || "Dates"}</h5>
                <div>
                  <span className="js-first-date">
                    <Calender
                      dates={selectedDates}
                      setDates={setSelectedDates}
                    />
                  </span>
                  <span className="js-last-date"></span>
                </div>
              </div>
              <div className="searchFormItem__icon_chevron">
                <ChevronDown size={18} className="d-flex" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guests Section */}
      <h5 className="text-18 fw-600 mb-20 mt-25">
        <Users size={18} className="text-accent-1 inline mr-10" />
        {t("hotel.guests") || "Guests"}
      </h5>

      {/* Adults */}
      <div className="guest-card">
        <div className="d-flex items-center justify-between mb-10">
          <div className="flex-1">
            <div className="text-15 fw-600 mb-5">
              {t("hotel.adult") || "Adults"}
            </div>
            {getAdultPrice() > 0 && (
              <div className="price-info-row">
                <span className="text-13 text-light-2">
                  {getAdultPrice().toLocaleString()}{" "}
                  {hotelOption?.currency || "USD"}
                </span>
                <span className="occupancy-type-badge">
                  {getOccupancyText()}
                </span>
              </div>
            )}
          </div>

          <div className="d-flex items-center js-counter">
            <button
              onClick={() => setAdultNumber((pre) => (pre > 1 ? pre - 1 : pre))}
              className="counter-btn"
            >
              <i className="icon-minus text-10"></i>
            </button>

            <div className="counter-display">
              <div className="text-16 fw-600">{adultNumber}</div>
            </div>

            <button
              onClick={() => setAdultNumber((pre) => pre + 1)}
              className="counter-btn"
            >
              <i className="icon-plus text-10"></i>
            </button>
          </div>
        </div>

        {/* Pricing Details Toggle */}
        {getSelectedRoomPricing() && (
          <div className="mt-15">
            <button
              className="pricing-details-toggle"
              onClick={() => setShowPricingDetails(!showPricingDetails)}
            >
              <span className="text-13 text-accent-1">
                {t("hotel.viewPricingDetails") || "View pricing details"}
              </span>
              {showPricingDetails ? (
                <ChevronUp size={12} className="ml-5" />
              ) : (
                <ChevronDown size={12} className="ml-5" />
              )}
            </button>
            {showPricingDetails && (
              <div className="pricing-details-content">
                {getSelectedRoomPricing().singleOccupancyPrice && (
                  <div className="pricing-detail-row">
                    <span>
                      {t("hotel.singleOccupancy") || "Single Occupancy"}:
                    </span>
                    <span className="fw-500">
                      {getSelectedRoomPricing().singleOccupancyPrice.toLocaleString()}{" "}
                      {hotelOption?.currency}
                    </span>
                  </div>
                )}
                {getSelectedRoomPricing().doubleOccupancyPrice && (
                  <div className="pricing-detail-row">
                    <span>
                      {t("hotel.doubleOccupancy") || "Double Occupancy"}:
                    </span>
                    <span className="fw-500">
                      {getSelectedRoomPricing().doubleOccupancyPrice.toLocaleString()}{" "}
                      {hotelOption?.currency}
                    </span>
                  </div>
                )}
                {getSelectedRoomPricing().tripleOccupancyPrice && (
                  <div className="pricing-detail-row">
                    <span>
                      {t("hotel.tripleOccupancy") || "Triple Occupancy"}:
                    </span>
                    <span className="fw-500">
                      {getSelectedRoomPricing().tripleOccupancyPrice.toLocaleString()}{" "}
                      {hotelOption?.currency}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Children */}
      <div className="guest-card mt-15">
        <div className="d-flex items-center justify-between mb-10">
          <div className="flex-1">
            <div className="text-15 fw-600 mb-5">
              {t("hotel.children") || "Children"}
              {getChildrenAgeRange() && (
                <span className="age-range-badge">{getChildrenAgeRange()}</span>
              )}
            </div>
            {hotelOption?.kidsPricing && hotelOption.kidsPricing.length > 0 && (
              <div className="text-13 text-light-2 mt-5">
                {hotelOption.kidsPricing[0].isFree ? (
                  <span className="free-badge">
                    <Check size={12} className="inline mr-5" />
                    {t("hotel.free") || "Free"}
                  </span>
                ) : (
                  <>
                    {getChildPrice().toLocaleString()}{" "}
                    {hotelOption?.currency || "USD"}
                    {hotelOption.kidsPricing[0].discount && (
                      <span className="discount-badge">
                        -{hotelOption.kidsPricing[0].discount}%
                      </span>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="d-flex items-center js-counter">
            <button
              onClick={() =>
                setChildrenNumber((pre) => (pre > 0 ? pre - 1 : pre))
              }
              className="counter-btn"
            >
              <i className="icon-minus text-10"></i>
            </button>

            <div className="counter-display">
              <div className="text-16 fw-600">{childrenNumber}</div>
            </div>

            <button
              onClick={() => setChildrenNumber((pre) => pre + 1)}
              className="counter-btn"
            >
              <i className="icon-plus text-10"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Optional Trips */}
      {offer?.optionalTrips && offer.optionalTrips.length > 0 && (
        <>
          <h5 className="text-18 fw-600 mb-20 mt-25">
            <Ticket size={18} className="text-accent-1 inline mr-10" />
            {t("hotel.addExtra") || "Optional Extras"}
          </h5>

          {offer.optionalTrips.map((trip, index) => (
            <div key={index} className="optional-trip-card mb-15">
              <div className="d-flex items-start justify-between">
                <div className="d-flex items-start flex-1">
                  <div className="form-checkbox mt-5">
                    <input
                      type="checkbox"
                      checked={selectedTrips[index] || false}
                      onChange={() => toggleTrip(index)}
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

                  <div className="ml-15 flex-1">
                    <div className="text-15 fw-600">{trip.title}</div>
                    {trip.description && (
                      <div className="text-13 text-light-2 mt-5">
                        {trip.description}
                      </div>
                    )}
                    <div className="trip-price-tag">
                      {trip.pricePerPerson.toLocaleString()} {trip.currency} /{" "}
                      {t("hotel.person") || "person"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Person counter for this trip */}
              {selectedTrips[index] && (
                <div className="d-flex items-center justify-end mt-15">
                  <span className="text-13 text-light-2 mr-10">
                    {t("hotel.persons") || "Persons"}:
                  </span>
                  <div className="d-flex items-center">
                    <button
                      onClick={() => updateTripPersonCount(index, -1)}
                      className="counter-btn-sm"
                    >
                      <i className="icon-minus text-8"></i>
                    </button>

                    <div className="flex-center ml-8 mr-8">
                      <div className="text-14 fw-600">
                        {tripPersonCounts[index] || 1}
                      </div>
                    </div>

                    <button
                      onClick={() => updateTripPersonCount(index, 1)}
                      className="counter-btn-sm"
                    >
                      <i className="icon-plus text-8"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* Total */}
      <div className="total-section">
        <div className="d-flex items-center justify-between">
          <div className="text-16 text-light-2">
            {t("hotel.total") || "Total"}:
          </div>
          <div className="text-26 fw-700 text-dark-1">
            {calculateTotal().toLocaleString()}{" "}
            <span className="text-18">{hotelOption?.currency || "USD"}</span>
          </div>
        </div>
      </div>

      {/* Book Now Button */}
      <button onClick={handleSendWhatsApp} className="premium-book-btn">
        <span>{t("hotel.sendUs") || "Book Now"}</span>
        <ArrowUpRight size={18} className="ml-10" />
      </button>

      {/* Important Notice */}
      <div className="notice-card">
        <Info size={16} className="text-accent-1 flex-shrink-0" />
        <div className="ml-10">
          <div className="text-13 fw-500 mb-5">
            {t("hotel.importantNotice") || "Important Notice"}
          </div>
          <div className="text-12 text-light-2">
            {t("hotel.bookingNotice") ||
              "Prices are subject to availability. Final confirmation will be sent after booking."}
          </div>
        </div>
      </div>

      {/* Booking Policies */}
      <div className="policies-section">
        <div className="policy-item">
          <Calendar size={14} className="text-accent-1" />
          <span className="text-12">
            {t("hotel.freeCancellation") || "Free cancellation up to 48 hours"}
          </span>
        </div>
        <div className="policy-item">
          <Shield size={14} className="text-accent-1" />
          <span className="text-12">
            {t("hotel.secureBooking") || "Secure booking & payment"}
          </span>
        </div>
        <div className="policy-item">
          <Clock size={14} className="text-accent-1" />
          <span className="text-12">
            {t("hotel.instantConfirmation") || "Instant confirmation"}
          </span>
        </div>
      </div>

      {/* Back to Offer */}
      {offer && (
        <div className="mt-15">
          <Link href={`/offers/${offer.documentId}`} className="back-link">
            <ArrowLeft size={14} className="inline mr-10" />
            {t("hotel.backToOffer") || "Back to Offer"}
          </Link>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bookingDetails={{
          hotelName: hotel.name,
          period: offer ? `${offer.month} ${offer.year}` : "",
          nights: hotelOption?.nights || 0,
          adults: adultNumber,
          children: childrenNumber,
          optionalTrips:
            offer?.optionalTrips
              ?.filter((_, index) => selectedTrips[index])
              .map((trip, index) => ({
                title: trip.title,
                persons:
                  tripPersonCounts[
                    Object.keys(selectedTrips).find(
                      (k) => selectedTrips[k] && offer.optionalTrips[k] === trip
                    )
                  ] || 1,
              })) || [],
          total: calculateTotal().toLocaleString(),
          currency: hotelOption?.currency || "USD",
        }}
        onSubmit={handleBookingSubmit}
      />

      <style jsx>{`
        .premium-price-card {
          background: linear-gradient(
            135deg,
            rgba(1, 159, 177, 0.08) 0%,
            rgba(1, 159, 177, 0.02) 100%
          );
          border: 2px solid var(--color-accent-1);
          border-radius: 16px;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .price-badge {
          position: absolute;
          top: 5px;
          right: 2px;
          background: linear-gradient(135deg, #ffd700 0%, #ffa800 100%);
          padding: 5px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          color: white;
          box-shadow: 0 2px 8px rgba(255, 168, 0, 0.3);
        }

        .nights-badge {
          background: var(--color-accent-1);
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          text-align: center;
          min-width: 80px;
        }

        .collapsible-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          background: var(--color-light-1);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .collapsible-header:hover {
          background: #ebebeb;
        }

        .included-list {
          padding: 15px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0 0 12px 12px;
          border-top: none;
        }

        .included-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          font-size: 14px;
          color: var(--color-dark-1);
        }

        .guest-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 18px;
          transition: all 0.3s ease;
        }

        .guest-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border-color: var(--color-accent-1);
        }

        .price-info-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .occupancy-type-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          background: rgba(1, 159, 177, 0.1);
          color: var(--color-accent-1);
        }

        .counter-btn {
          width: 36px;
          height: 36px;
          border: 2px solid var(--color-accent-1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          color: var(--color-accent-1);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .counter-btn:hover {
          background: var(--color-accent-1);
          color: white;
          transform: scale(1.05);
        }

        .counter-display {
          min-width: 50px;
          text-align: center;
          margin: 0 12px;
        }

        .counter-btn-sm {
          width: 28px;
          height: 28px;
          border: 1px solid var(--color-accent-1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          color: var(--color-accent-1);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .counter-btn-sm:hover {
          background: var(--color-accent-1);
          color: white;
        }

        .age-range-badge {
          display: inline-block;
          padding: 2px 8px;
          background: var(--color-light-1);
          border-radius: 4px;
          font-size: 11px;
          color: var(--color-light-2);
          font-weight: 500;
        }

        .free-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(52, 168, 83, 0.1);
          color: var(--color-green-3);
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 600;
        }

        .discount-badge {
          display: inline-block;
          background: rgba(255, 168, 0, 0.1);
          color: var(--color-yellow-1);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          margin-left: 8px;
        }

        .subtotal-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          margin-top: 12px;
          border-top: 1px solid #e5e7eb;
          font-size: 13px;
          color: var(--color-accent-1);
        }

        .pricing-details-toggle {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 0;
          width: 100%;
        }

        .pricing-details-content {
          background: var(--color-light-1);
          padding: 12px;
          border-radius: 8px;
          margin-top: 10px;
        }

        .pricing-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          font-size: 12px;
          color: var(--color-dark-1);
        }

        .optional-trip-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
        }

        .optional-trip-card:hover {
          border-color: var(--color-accent-1);
          box-shadow: 0 4px 12px rgba(1, 159, 177, 0.1);
        }

        .trip-price-tag {
          display: inline-block;
          background: linear-gradient(
            135deg,
            rgba(1, 159, 177, 0.1) 0%,
            rgba(1, 159, 177, 0.05) 100%
          );
          color: var(--color-accent-1);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 8px;
        }

        .total-section {
          background: linear-gradient(
            135deg,
            var(--color-light-1) 0%,
            white 100%
          );
          padding: 20px;
          border-radius: 12px;
          margin-top: 25px;
          border: 2px solid #e5e7eb;
        }

        .premium-book-btn {
          width: 100%;
          background: linear-gradient(
            135deg,
            var(--color-accent-1) 0%,
            #017a89 100%
          );
          color: white;
          padding: 18px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 20px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(1, 159, 177, 0.3);
        }

        .premium-book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(1, 159, 177, 0.4);
        }

        .notice-card {
          display: flex;
          align-items: start;
          background: rgba(1, 159, 177, 0.05);
          border-left: 3px solid var(--color-accent-1);
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }

        .policies-section {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          margin-top: 15px;
        }

        .policy-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          color: var(--color-dark-1);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          color: var(--color-accent-1);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .back-link:hover {
          color: #017a89;
          transform: translateX(-4px);
        }

        .inline {
          display: inline;
        }

        @media (max-width: 768px) {
          .premium-price-card {
            padding: 16px;
          }

          .price-badge {
            top: 10px;
            right: 10px;
            font-size: 11px;
            padding: 4px 10px;
          }

          .nights-badge {
            padding: 10px 14px;
            min-width: 70px;
          }

          .guest-card {
            padding: 15px;
          }

          .counter-btn {
            width: 32px;
            height: 32px;
          }

          .total-section {
            padding: 16px;
          }

          .premium-book-btn {
            padding: 16px;
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}
