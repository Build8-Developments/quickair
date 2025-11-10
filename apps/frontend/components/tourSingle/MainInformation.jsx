import React from "react";

export default function MainInformation({ offer }) {
  if (!offer) return null;

  return (
    <>
      <div className="row y-gap-20 justify-between items-end">
        <div className="col-auto">
          <div className="row x-gap-10 y-gap-10 items-center">
            <div className="col-auto">
              <button className="button -accent-1 text-14 py-5 px-15 bg-accent-1-05 text-accent-1 rounded-200">
                {offer.month} {offer.year}
              </button>
            </div>
            {offer.hotelOptions?.some((opt) => opt.specialOffer) && (
              <div className="col-auto">
                <button className="button -blue-1 text-14 py-5 px-15 bg-blue-1-05 text-blue-1 rounded-200">
                  Special Offer
                </button>
              </div>
            )}
          </div>

          <h2 className="text-40 sm:text-30 lh-14 mt-20">{offer.title}</h2>

          <div className="row x-gap-20 y-gap-20 items-center pt-20">
            <div className="col-auto">
              <div className="d-flex items-center">
                <i className="icon-pin text-16 mr-5"></i>
                {offer.location?.name}
                {offer.location?.country && `, ${offer.location.country}`}
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex items-center">
                <i className="icon-calendar text-16 mr-5"></i>
                {offer.month} {offer.year}
              </div>
            </div>

            {offer.hotelOptions && offer.hotelOptions.length > 0 && (
              <div className="col-auto">
                <div className="d-flex items-center">
                  <i className="icon-bed text-16 mr-5"></i>
                  {offer.hotelOptions.length} Hotel{" "}
                  {offer.hotelOptions.length > 1 ? "Options" : "Option"}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-auto">
          <div className="d-flex x-gap-30 y-gap-10">
            <a href="#" className="d-flex items-center">
              <i className="icon-share flex-center text-16 mr-10"></i>
              Share
            </a>

            <a href="#" className="d-flex items-center">
              <i className="icon-heart flex-center text-16 mr-10"></i>
              Wishlist
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
