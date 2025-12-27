"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import HotelInformation from "../HotelInformation";
import HotelAmenities from "../HotelAmenities";
import Included from "../Included";
import Gallery1 from "../Galleries/Gallery1";
import OptionalTrips from "../OptionalTrips";
import Policies from "../Policies";
import HotelSidebar from "../HotelSidebar";
import Faq from "../Faq";

export default function HotelDetail({ hotel, offer, hotelOption }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  if (!hotel) {
    return (
      <div className="py-30 mt-80">
        <div className="container">
          <div className="text-center py-60">
            <h2 className="text-30">{t("hotel.notFound")}</h2>
            <p className="text-light-2 mt-10">
              {t("hotel.notFoundDescription")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare map coordinates if available
  const mapCoordinates =
    hotel.coordinates?.latitude && hotel.coordinates?.longitude
      ? {
          lat: hotel.coordinates.latitude,
          lng: hotel.coordinates.longitude,
        }
      : null;

  return (
    <div className="py-30 mt-80">
      {/* Main Header Section */}
      <section className="">
        <div className="container">
          <HotelInformation hotel={hotel} offer={offer} />
          <Gallery1 hotel={hotel} />
        </div>
      </section>

      {/* Content Section */}
      <section className="layout-pt-md js-pin-container">
        <div className="container">
          <div
            className="row y-gap-30 justify-between"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {/* Sidebar - shows on LEFT in EN, RIGHT in AR */}
            <div className="col-xl-4">
              <div className="d-block d-xl-flex js-pin-content">
                <HotelSidebar
                  hotel={hotel}
                  offer={offer}
                  hotelOption={hotelOption}
                />
              </div>
            </div>

            {/* Main Content - shows on RIGHT in EN, LEFT in AR */}
            <div
              className="col-xl-8"
              dir={isRTL ? "rtl" : "ltr"}
              style={{ textAlign: isRTL ? "right" : "left" }}
            >
              {/* Hotel Description */}
              {hotel.description && (
                <>
                  <h2 className="text-30">{t("hotel.aboutHotel")}</h2>
                  <div
                    className="mt-20 text-15 text-light-2"
                    dangerouslySetInnerHTML={{ __html: hotel.description }}
                  />
                  <div className="line mt-40 mb-40"></div>
                </>
              )}

              {/* Short Description (if no full description) */}
              {!hotel.description && hotel.shortDescription && (
                <>
                  <h2 className="text-30">{t("hotel.aboutHotel")}</h2>
                  <p className="mt-20 text-15 text-light-2">
                    {hotel.shortDescription}
                  </p>
                  <div className="line mt-40 mb-40"></div>
                </>
              )}

              {/* Amenities */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <>
                  <h2 className="text-30">{t("hotel.amenitiesFacilities")}</h2>
                  <HotelAmenities amenities={hotel.amenities} />
                  <div className="line mt-60 mb-60"></div>
                </>
              )}

              {/* Hotel Location Map */}
              {mapCoordinates && hotel.address && (
                <>
                  <h2 className="text-30 mb-30">{t("hotel.hotelLocation")}</h2>
                  <div className="bg-light-1 rounded-12 px-20 py-20">
                    <div className="d-flex items-start">
                      <i
                        className={`icon-pin text-20 text-accent-1 mt-5 ${
                          isRTL ? "ml-15" : "mr-15"
                        }`}
                      ></i>
                      <div>
                        <h5 className="text-16 fw-500 mb-5">{hotel.name}</h5>
                        <p className="text-15 text-light-2">{hotel.address}</p>
                        {hotel.location && (
                          <p className="text-14 text-light-2 mt-5">
                            {hotel.location.name}
                            {hotel.location.country &&
                              `, ${hotel.location.country}`}
                          </p>
                        )}
                        {mapCoordinates && (
                          <a
                            href={`https://www.google.com/maps?q=${mapCoordinates.lat},${mapCoordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-14 text-accent-1 mt-10 d-inline-block"
                          >
                            {t("hotel.viewOnMap")}{" "}
                            <i className="icon-arrow-top-right text-12 ml-5"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="line mt-60 mb-60"></div>
                </>
              )}

              {/* Offer Inclusions & Exclusions */}
              {offer &&
                ((offer.inclusions && offer.inclusions.length > 0) ||
                  (offer.exclusions && offer.exclusions.length > 0)) && (
                  <>
                    <h2 className="text-30">{t("hotel.whatsIncluded")}</h2>
                    <Included
                      inclusions={offer.inclusions}
                      exclusions={offer.exclusions}
                    />
                    <div className="line mt-60 mb-60"></div>
                  </>
                )}

              {/* Optional Trips */}
              {offer?.optionalTrips && offer.optionalTrips.length > 0 && (
                <>
                  <OptionalTrips optionalTrips={offer.optionalTrips} />
                  <div className="line mt-60 mb-60"></div>
                </>
              )}

              {/* Policies */}
              {offer?.policies && (
                <>
                  <Policies policies={offer.policies} />
                  <div className="line mt-60 mb-60"></div>
                </>
              )}

              {/* FAQ Section */}
              <h2 className="text-30">{t("hotel.frequentlyAskedQuestions")}</h2>
              <div className="accordion -simple row y-gap-20 mt-30 js-accordion">
                <Faq />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
