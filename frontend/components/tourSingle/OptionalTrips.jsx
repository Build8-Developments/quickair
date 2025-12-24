import React from "react";

export default function OptionalTrips({ optionalTrips }) {
  if (!optionalTrips || optionalTrips.length === 0) return null;

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <>
      <h2 className="text-30 mt-60">Optional Excursions & Adventures</h2>
      <div className="row y-gap-20 pt-30">
        {optionalTrips.map((trip, index) => (
          <div key={index} className="col-12">
            <div className="border-1 rounded-12 px-25 py-20">
              <div className="row x-gap-20 items-center justify-between">
                <div className="col-lg-8">
                  <h3 className="text-20 fw-600">{trip.title}</h3>

                  {trip.description && (
                    <p className="text-14 text-light-2 mt-10">
                      {trip.description}
                    </p>
                  )}

                  {trip.inclusions && trip.inclusions.length > 0 && (
                    <div className="mt-15">
                      <div className="text-14 fw-500 mb-10">Includes:</div>
                      <div className="row x-gap-15 y-gap-10">
                        {trip.inclusions.map((inclusion, idx) => (
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
                </div>

                <div className="col-lg-4">
                  <div className="text-right">
                    <div className="text-14 text-light-2 mb-5">
                      Price per person
                    </div>
                    <div className="text-26 fw-600 text-accent-1">
                      {formatPrice(trip.pricePerPerson)} {trip.currency}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
