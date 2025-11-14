import React from "react";
import MainInformation from "../MainInformation";
import Included from "../Included";
import Gallery1 from "../Galleries/Gallery1";
import HotelCards from "../HotelCards";
import OptionalTrips from "../OptionalTrips";
import Policies from "../Policies";
import OfferSidebar from "../OfferSidebar";
import Faq from "../Faq";

export default function OfferDetail({ offer }) {
  if (!offer) {
    return (
      <div className="py-30 mt-80">
        <div className="container">
          <div className="text-center py-60">
            <h2 className="text-30">Offer not found</h2>
            <p className="text-light-2 mt-10">
              The offer you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-30 mt-80">
      {/* Main Header Section */}
      <section className="">
        <div className="container">
          <MainInformation offer={offer} />
          <Gallery1 offer={offer} />
        </div>
      </section>

      {/* Content Section */}
      <section className="layout-pt-md js-pin-container">
        <div className="container">
          <div className="row y-gap-30 justify-between">
            {/* Main Content */}
            <div className="col-lg-8">
              {/* Location Description */}
              {offer.location?.description && (
                <>
                  <h2 className="text-30">About {offer.location.name}</h2>
                  <p className="mt-20 text-15 text-light-2">
                    {offer.location.description}
                  </p>
                  <div className="line mt-40 mb-40"></div>
                </>
              )}

              {/* Hotel Options Cards */}
              {offer.hotelOptions && offer.hotelOptions.length > 0 && (
                <>
                  <h2 className="text-30">Available Hotels</h2>
                  <p className="text-15 text-light-2 mt-10 mb-30">
                    Choose from our carefully selected hotels for this package.
                    Click on any hotel to view detailed information and pricing.
                  </p>
                  <HotelCards hotelOptions={offer.hotelOptions} />
                  <div className="line mt-60 mb-60"></div>
                </>
              )}

              {/* Inclusions & Exclusions */}
              {((offer.inclusions && offer.inclusions.length > 0) ||
                (offer.exclusions && offer.exclusions.length > 0)) && (
                <>
                  <h2 className="text-30">What's Included</h2>
                  <Included
                    inclusions={offer.inclusions}
                    exclusions={offer.exclusions}
                  />
                  <div className="line mt-60 mb-60"></div>
                </>
              )}

              {/* Optional Trips */}
              {offer.optionalTrips && offer.optionalTrips.length > 0 && (
                <>
                  <OptionalTrips optionalTrips={offer.optionalTrips} />
                  <div className="line mt-60 mb-60"></div>
                </>
              )}

              {/* Policies */}
              {offer.policies && <Policies policies={offer.policies} />}

              {/* FAQ Section */}
              <h2 className="text-30">Frequently Asked Questions</h2>
              <div className="accordion -simple row y-gap-20 mt-30 js-accordion">
                <Faq />
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="d-flex justify-end js-pin-content">
                <OfferSidebar offer={offer} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
