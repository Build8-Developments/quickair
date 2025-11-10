import React from "react";
import Image from "next/image";
import Link from "next/link";
import Stars from "../common/Stars";
import { getStrapiURL } from "@/lib/strapi";

export default function HotelCards({ hotelOptions }) {
  if (!hotelOptions || hotelOptions.length === 0) return null;

  return (
    <div className="row y-gap-30">
      {hotelOptions.map((option, index) => {
        const hotel = option.hotel;
        if (!hotel) return null;

        return (
          <div key={index} className="col-lg-6 col-md-6">
            <Link
              href={`/hotel/${hotel.slug || hotel.documentId}`}
              className="tourCard -type-1 -hover-shadow border-1 rounded-12 bg-white"
            >
              <div className="tourCard__header">
                <div className="tourCard__image ratio ratio-28:20">
                  <Image
                    width={450}
                    height={325}
                    src={getStrapiURL(hotel.coverImage?.url)}
                    alt={hotel.coverImage?.alternativeText || hotel.name}
                    className="img-ratio rounded-12"
                  />
                </div>

                {option.specialOffer && (
                  <div className="tourCard__badge">
                    <div className="bg-blue-1 text-white px-15 py-5 text-12 fw-500 rounded-right-4">
                      {option.specialOffer}
                    </div>
                  </div>
                )}
              </div>

              <div className="tourCard__content px-20 py-20">
                <div className="d-flex items-center mb-10">
                  <h3 className="text-18 fw-500 mr-10">{hotel.name}</h3>
                  {hotel.stars && (
                    <div className="d-flex x-gap-5">
                      <Stars star={hotel.stars} font={12} />
                    </div>
                  )}
                </div>

                {hotel.location && (
                  <div className="d-flex items-center text-14 text-light-2 mb-10">
                    <i className="icon-pin text-16 mr-5"></i>
                    {hotel.location.name}
                    {hotel.location.country && `, ${hotel.location.country}`}
                  </div>
                )}

                {hotel.shortDescription && (
                  <p className="text-14 text-light-2 mb-15 line-clamp-2">
                    {hotel.shortDescription}
                  </p>
                )}

                <div className="row x-gap-20 y-gap-10 pt-10 border-top-1">
                  <div className="col-auto">
                    <div className="d-flex items-center text-14">
                      <i className="icon-night text-16 mr-5"></i>
                      {option.nights} Night{option.nights > 1 ? "s" : ""}
                    </div>
                  </div>

                  {option.mealPlan && (
                    <div className="col-auto">
                      <div className="d-flex items-center text-14">
                        <i className="icon-bread text-16 mr-5"></i>
                        {option.mealPlan.code}
                      </div>
                    </div>
                  )}

                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="col-auto">
                      <div className="d-flex items-center text-14">
                        <i className="icon-check text-16 mr-5"></i>
                        {hotel.amenities.length} Amenities
                      </div>
                    </div>
                  )}
                </div>

                {option.roomPricing && option.roomPricing.length > 0 && (
                  <div className="d-flex items-center justify-between pt-15 mt-15 border-top-1">
                    <div className="text-14 text-light-2">Starting from</div>
                    <div className="text-18 fw-500 text-accent-1">
                      {Math.min(
                        ...option.roomPricing
                          .map((p) =>
                            Math.min(
                              p.singlePrice || Infinity,
                              p.doublePrice || Infinity,
                              p.triplePrice || Infinity
                            )
                          )
                          .filter((p) => p !== Infinity)
                      ).toLocaleString()}{" "}
                      {option.currency}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
