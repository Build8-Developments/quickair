import React from "react";

export default function HotelCardSkeleton() {
  return (
    <div className="tourCard -type-1 py-10 px-10 border-1 rounded-12">
      <div className="tourCard__header">
        <div className="tourCard__image ratio ratio-28:20">
          <div className="skeleton-image skeleton-pulse rounded-12"></div>
        </div>
      </div>

      <div className="tourCard__content px-10 pt-10">
        <div className="tourCard__location d-flex items-center text-13">
          <div className="skeleton-location skeleton-pulse"></div>
        </div>

        <div className="tourCard__title text-16 fw-500 mt-5">
          <div className="skeleton-title skeleton-pulse"></div>
        </div>

        <div className="mt-5">
          <div className="skeleton-description skeleton-pulse mb-5"></div>
          <div
            className="skeleton-description skeleton-pulse"
            style={{ width: "80%" }}
          ></div>
        </div>

        <div className="tourCard__rating d-flex items-center text-13 mt-10">
          <div className="skeleton-date skeleton-pulse"></div>
        </div>

        <div className="d-flex justify-center items-center border-1-top pt-10 mt-10">
          <div className="skeleton-price skeleton-pulse"></div>
        </div>
      </div>
    </div>
  );
}
