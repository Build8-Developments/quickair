import React from "react";
import Image from "next/image";
import Stars from "../common/Stars";

export default function HotelOptions({ hotelOptions }) {
  if (!hotelOptions || hotelOptions.length === 0) return null;

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return Number(price).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="row y-gap-30">
      {hotelOptions.map((option, index) => (
        <div key={index} className="col-12">
          <div className="border-1 rounded-12 px-20 py-20">
            {/* Hotel Header */}
            <div className="row x-gap-20 y-gap-20 items-center">
              <div className="col-auto">
                {option.hotel?.coverImage && (
                  <Image
                    width={120}
                    height={120}
                    src={option.hotel.coverImage.url}
                    alt={
                      option.hotel.coverImage.alternativeText ||
                      option.hotel.name
                    }
                    className="rounded-12 object-cover"
                  />
                )}
              </div>

              <div className="col">
                <div className="d-flex items-center mb-5">
                  <h3 className="text-22 fw-600 mr-10">
                    {option.hotel?.name || "Hotel"}
                  </h3>
                  {option.hotel?.stars && (
                    <div className="d-flex x-gap-5">
                      <Stars star={option.hotel.stars} font={14} />
                    </div>
                  )}
                </div>

                <div className="row x-gap-20 y-gap-10 pt-5">
                  {option.nights && (
                    <div className="col-auto">
                      <div className="d-flex items-center text-14 text-light-2">
                        <i className="icon-night text-16 mr-5"></i>
                        {option.nights} Night{option.nights > 1 ? "s" : ""}
                      </div>
                    </div>
                  )}

                  {option.mealPlan && (
                    <div className="col-auto">
                      <div className="d-flex items-center text-14 text-light-2">
                        <i className="icon-bread text-16 mr-5"></i>
                        {option.mealPlan.name} ({option.mealPlan.code})
                      </div>
                    </div>
                  )}

                  {option.hotel?.location && (
                    <div className="col-auto">
                      <div className="d-flex items-center text-14 text-light-2">
                        <i className="icon-pin text-16 mr-5"></i>
                        {option.hotel.location.name}
                      </div>
                    </div>
                  )}
                </div>

                {option.hotel?.shortDescription && (
                  <p className="text-14 text-light-2 mt-10">
                    {option.hotel.shortDescription}
                  </p>
                )}

                {option.specialOffer && (
                  <div className="mt-10">
                    <span className="button -blue-1 py-5 px-15 text-12 bg-blue-1-05 text-blue-1 rounded-200">
                      🎉 {option.specialOffer}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Room Pricing */}
            {option.roomPricing && option.roomPricing.length > 0 && (
              <div className="mt-30">
                <h4 className="text-18 fw-500 mb-15">Room Pricing</h4>
                <div className="overflow-scroll">
                  <table className="table-3 -border-bottom col-12 text-14">
                    <thead className="bg-light-1">
                      <tr>
                        <th>Room Type</th>
                        <th className="text-center">Single</th>
                        <th className="text-center">Double</th>
                        <th className="text-center">Triple</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {option.roomPricing.map((pricing, idx) => (
                        <tr key={idx}>
                          <td className="fw-500">{pricing.roomType}</td>
                          <td className="text-center">
                            {pricing.singlePrice
                              ? `${formatPrice(pricing.singlePrice)} ${
                                  option.currency
                                }`
                              : "-"}
                          </td>
                          <td className="text-center">
                            {pricing.doublePrice
                              ? `${formatPrice(pricing.doublePrice)} ${
                                  option.currency
                                }`
                              : "-"}
                          </td>
                          <td className="text-center">
                            {pricing.triplePrice
                              ? `${formatPrice(pricing.triplePrice)} ${
                                  option.currency
                                }`
                              : "-"}
                          </td>
                          <td className="text-light-2 text-12">
                            {pricing.notes || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Kids Pricing */}
            {option.kidsPricing && option.kidsPricing.length > 0 && (
              <div className="mt-25">
                <h4 className="text-18 fw-500 mb-15">Kids Pricing</h4>
                <div className="row x-gap-10 y-gap-10">
                  {option.kidsPricing.map((kids, idx) => (
                    <div key={idx} className="col-auto">
                      <div className="border-1 rounded-8 px-15 py-10">
                        <div className="text-14 fw-500">
                          Age {kids.ageFrom} - {kids.ageTo}
                        </div>
                        <div className="text-14 text-accent-1 mt-5">
                          {kids.isFree
                            ? "FREE"
                            : kids.price
                            ? `${formatPrice(kids.price)} ${option.currency}`
                            : kids.discount
                            ? `${kids.discount}% OFF`
                            : "Contact us"}
                        </div>
                        {kids.notes && (
                          <div className="text-12 text-light-2 mt-5">
                            {kids.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotel Amenities */}
            {option.hotel?.amenities && option.hotel.amenities.length > 0 && (
              <div className="mt-25">
                <h4 className="text-18 fw-500 mb-15">Hotel Amenities</h4>
                <div className="row x-gap-20 y-gap-10">
                  {option.hotel.amenities.slice(0, 8).map((amenity, idx) => (
                    <div key={idx} className="col-auto">
                      <div className="d-flex items-center text-14">
                        {amenity.icon && (
                          <i className={`${amenity.icon} text-16 mr-10`}></i>
                        )}
                        {amenity.name}
                      </div>
                    </div>
                  ))}
                  {option.hotel.amenities.length > 8 && (
                    <div className="col-auto">
                      <div className="text-14 text-accent-1">
                        +{option.hotel.amenities.length - 8} more
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Meal Plan Details */}
            {option.mealPlan?.inclusions &&
              option.mealPlan.inclusions.length > 0 && (
                <div className="mt-25">
                  <h4 className="text-18 fw-500 mb-15">
                    Meal Plan Includes ({option.mealPlan.code})
                  </h4>
                  <div className="row x-gap-15 y-gap-10">
                    {option.mealPlan.inclusions.map((inclusion, idx) => (
                      <div key={idx} className="col-auto">
                        <div className="d-flex items-center text-14">
                          <i className="icon-check text-12 text-green-2 mr-5"></i>
                          {inclusion.item}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Notes */}
            {option.notes && (
              <div className="mt-25 pt-20 border-top-1">
                <div className="d-flex">
                  <i className="icon-info text-16 mr-10 mt-5"></i>
                  <div className="text-14 text-light-2">{option.notes}</div>
                </div>
              </div>
            )}

            {/* Availability Status */}
            <div className="mt-20 pt-20 border-top-1">
              <div className="d-flex items-center justify-between">
                <div>
                  {option.available ? (
                    <span className="text-14 text-green-2 fw-500">
                      <i className="icon-check text-12 mr-5"></i>
                      Available
                    </span>
                  ) : (
                    <span className="text-14 text-red-3 fw-500">
                      <i className="icon-close text-12 mr-5"></i>
                      Not Available
                    </span>
                  )}
                </div>
                <div className="text-14 text-light-2">
                  Currency: {option.currency}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
