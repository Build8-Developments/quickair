"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getStrapiURL } from "@/lib/strapi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import Calender from "@/components/common/dropdownSearch/Calender";
import BookingModal from "./BookingModal";

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
        return `${kidsPricing.ageFrom}-${kidsPricing.ageTo} ${t(
          "hotel.years"
        )}`;
      }
    }
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

  const handleDownloadPDF = () => {
    if (offer?.pdfFile?.url) {
      window.open(getStrapiURL(offer.pdfFile.url), "_blank");
    }
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hello! I'm interested in ${hotel.name}${
        offer ? ` for ${offer.month} ${offer.year}` : ""
      }`
    );
    window.open(`https://wa.me/number?text=${message}`, "_blank");
  };

  const handleBookNow = () => {
    // For now, redirect to WhatsApp - will be integrated later
    handleWhatsAppContact();
  };

  return (
    <div className="tourSingleSidebar">
      {/* Pricing Header */}
      <div className="d-flex items-center">
        <div>{t("hotel.from")}</div>
        {hotelOption?.roomPricing && hotelOption.roomPricing.length > 0 && (
          <div className="text-20 fw-500 ml-10">
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
            {hotelOption.currency}
          </div>
        )}
      </div>

      {/* Date Selection */}
      <div className="searchForm -type-1 -sidebar mt-20">
        <div className="searchForm__form">
          <div className="searchFormItem js-select-control js-form-dd js-calendar">
            <div className="searchFormItem__button" data-x-click="calendar">
              <div className="searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center">
                <i className="text-20 icon-calendar"></i>
              </div>
              <div className="searchFormItem__content">
                <h5>{t("hotel.dates")}</h5>
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
                <i className="icon-chevron-down d-flex text-18"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets */}
      <h5 className="text-18 fw-500 mb-20 mt-20">{t("hotel.tickets")}</h5>

      {/* Adults */}
      <div className="border-1 rounded-8 px-15 py-15">
        <div className="d-flex items-center justify-between mb-10">
          <div>
            <div className="text-14 fw-500">{t("hotel.adult")}</div>
            {getAdultPrice() > 0 && (
              <div className="text-12 text-light-2">
                {getAdultPrice().toLocaleString()}{" "}
                {hotelOption?.currency || "USD"} {t("hotel.perPerson")}
                {adultNumber === 1 && (
                  <span className="text-accent-1">
                    {" "}
                    ({t("hotel.singleOccupancy")})
                  </span>
                )}
                {adultNumber === 2 && (
                  <span className="text-accent-1">
                    {" "}
                    ({t("hotel.doubleOccupancy")})
                  </span>
                )}
                {adultNumber >= 3 && (
                  <span className="text-accent-1">
                    {" "}
                    ({t("hotel.tripleOccupancy")})
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="d-flex items-center js-counter">
            <button
              onClick={() => setAdultNumber((pre) => (pre > 1 ? pre - 1 : pre))}
              className="button size-30 border-1 rounded-full js-down"
            >
              <i className="icon-minus text-10"></i>
            </button>

            <div className="flex-center ml-10 mr-10">
              <div className="text-14 size-20 js-count fw-500">
                {adultNumber}
              </div>
            </div>

            <button
              onClick={() => setAdultNumber((pre) => pre + 1)}
              className="button size-30 border-1 rounded-full js-up"
            >
              <i className="icon-plus text-10"></i>
            </button>
          </div>
        </div>
        {adultNumber > 0 && getAdultPrice() > 0 && (
          <div className="text-12 text-accent-1 fw-500">
            {t("hotel.subtotal")}:{" "}
            {(adultNumber * getAdultPrice()).toLocaleString()}{" "}
            {hotelOption?.currency || "USD"}
          </div>
        )}

        {/* Show occupancy pricing details */}
        {getSelectedRoomPricing() && (
          <div className="mt-10 pt-10 border-top-1">
            <div className="text-11 text-light-2">
              {getSelectedRoomPricing().singleOccupancyPrice && (
                <div className="d-flex justify-between mb-5">
                  <span>{t("hotel.singleOccupancy")}:</span>
                  <span className="fw-500">
                    {getSelectedRoomPricing().singleOccupancyPrice.toLocaleString()}{" "}
                    {hotelOption?.currency}
                  </span>
                </div>
              )}
              {getSelectedRoomPricing().doubleOccupancyPrice && (
                <div className="d-flex justify-between mb-5">
                  <span>{t("hotel.doubleOccupancy")}:</span>
                  <span className="fw-500">
                    {getSelectedRoomPricing().doubleOccupancyPrice.toLocaleString()}{" "}
                    {hotelOption?.currency}
                  </span>
                </div>
              )}
              {getSelectedRoomPricing().tripleOccupancyPrice && (
                <div className="d-flex justify-between">
                  <span>{t("hotel.tripleOccupancy")}:</span>
                  <span className="fw-500">
                    {getSelectedRoomPricing().tripleOccupancyPrice.toLocaleString()}{" "}
                    {hotelOption?.currency}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Children */}
      <div className="mt-15 border-1 rounded-8 px-15 py-15">
        <div className="d-flex items-center justify-between mb-10">
          <div>
            <div className="text-14 fw-500">
              {t("hotel.children")}
              {getChildrenAgeRange() && (
                <span className="text-light-2"> ({getChildrenAgeRange()})</span>
              )}
            </div>
            {hotelOption?.kidsPricing && hotelOption.kidsPricing.length > 0 && (
              <div className="text-12 text-light-2">
                {hotelOption.kidsPricing[0].isFree ? (
                  t("hotel.free")
                ) : (
                  <>
                    {getChildPrice().toLocaleString()}{" "}
                    {hotelOption?.currency || "USD"} {t("hotel.perPerson")}
                    {hotelOption.kidsPricing[0].discount && (
                      <span className="text-accent-1 ml-5">
                        (-{hotelOption.kidsPricing[0].discount}%)
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
              className="button size-30 border-1 rounded-full js-down"
            >
              <i className="icon-minus text-10"></i>
            </button>

            <div className="flex-center ml-10 mr-10">
              <div className="text-14 size-20 js-count fw-500">
                {childrenNumber}
              </div>
            </div>

            <button
              onClick={() => setChildrenNumber((pre) => pre + 1)}
              className="button size-30 border-1 rounded-full js-up"
            >
              <i className="icon-plus text-10"></i>
            </button>
          </div>
        </div>
        {childrenNumber > 0 && getChildPrice() > 0 && (
          <div className="text-12 text-accent-1 fw-500">
            {t("hotel.subtotal")}:{" "}
            {(childrenNumber * getChildPrice()).toLocaleString()}{" "}
            {hotelOption?.currency || "USD"}
          </div>
        )}
      </div>

      {/* Optional Trips */}
      {offer?.optionalTrips && offer.optionalTrips.length > 0 && (
        <>
          <h5 className="text-18 fw-500 mb-20 mt-20">{t("hotel.addExtra")}</h5>

          {offer.optionalTrips.map((trip, index) => (
            <div key={index} className="mb-15">
              <div className="d-flex items-start justify-between">
                <div className="d-flex items-start">
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

                  <div className="ml-10">
                    <div className="text-14 fw-500">{trip.title}</div>
                    {trip.description && (
                      <div className="text-13 text-light-2 mt-5">
                        {trip.description}
                      </div>
                    )}
                    <div className="text-13 text-accent-1 mt-5">
                      {trip.pricePerPerson.toLocaleString()} {trip.currency} /{" "}
                      {t("hotel.person")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Person counter for this trip */}
              {selectedTrips[index] && (
                <div className="d-flex items-center justify-end mt-10">
                  <span className="text-13 text-light-2 mr-10">
                    {t("hotel.persons")}:
                  </span>
                  <div className="d-flex items-center">
                    <button
                      onClick={() => updateTripPersonCount(index, -1)}
                      className="button size-25 border-1 rounded-full"
                    >
                      <i className="icon-minus text-8"></i>
                    </button>

                    <div className="flex-center ml-8 mr-8">
                      <div className="text-13 size-20">
                        {tripPersonCounts[index] || 1}
                      </div>
                    </div>

                    <button
                      onClick={() => updateTripPersonCount(index, 1)}
                      className="button size-25 border-1 rounded-full"
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
      <div className="line mt-20 mb-20"></div>

      <div className="d-flex items-center justify-between">
        <div className="text-18 fw-500">{t("hotel.total")}:</div>
        <div className="text-18 fw-500">
          {calculateTotal().toLocaleString()} {hotelOption?.currency || "USD"}
        </div>
      </div>

      {/* Send to WhatsApp Button */}
      <button
        onClick={handleSendWhatsApp}
        className="button -md -dark-1 col-12 bg-accent-1 text-white mt-20"
      >
        {t("hotel.sendUs")}
        <i className="icon-arrow-top-right ml-10"></i>
      </button>

      {/* Additional Info */}
      <div className="mt-20 pt-20 border-top-1">
        <div className="text-14 text-light-2">
          <div className="d-flex items-start">
            <i
              className={`icon-info text-16 mt-5 ${isRTL ? "ml-10" : "mr-10"}`}
            ></i>
            <span>{t("hotel.bookingNotice")}</span>
          </div>
        </div>
      </div>

      {/* Back to Offer */}
      {offer && (
        <div className="mt-15">
          <Link
            href={`/offers/${offer.documentId}`}
            className="d-flex items-center text-accent-1 text-14"
          >
            <i className="icon-arrow-left text-14 mr-10"></i>
            {t("hotel.backToOffer")}
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
    </div>
  );
}
