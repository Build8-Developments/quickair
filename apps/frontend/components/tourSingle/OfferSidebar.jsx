"use client";

import React from "react";
import Image from "next/image";
import { getStrapiURL } from "@/lib/strapi";

export default function OfferSidebar({ offer }) {
  if (!offer) return null;

  const handleDownloadPDF = () => {
    if (offer.pdfFile?.url) {
      window.open(getStrapiURL(offer.pdfFile.url), "_blank");
    }
  };

  return (
    <div className="tourSingleSidebar">
      {/* Location Image */}
      {offer.location?.image && (
        <div className="mb-20">
          <Image
            width={400}
            height={250}
            src={getStrapiURL(offer.location.image.url)}
            alt={offer.location.image.alternativeText || offer.location.name}
            className="w-100 rounded-12 object-cover"
          />
        </div>
      )}

      {/* Quick Info */}
      <div className="bg-light-1 rounded-12 px-20 py-20 mb-20">
        <h5 className="text-18 fw-500 mb-15">Trip Details</h5>

        <div className="d-flex items-center justify-between py-10 border-bottom-1">
          <div className="text-14 text-light-2">Offer Date</div>
          <div className="text-14 fw-500">
            {offer.month} {offer.year}
          </div>
        </div>

        {offer.hotelOptions && offer.hotelOptions.length > 0 && (
          <div className="d-flex items-center justify-between py-10 border-bottom-1">
            <div className="text-14 text-light-2">Hotel Options</div>
            <div className="text-14 fw-500">
              {offer.hotelOptions.length} Available
            </div>
          </div>
        )}

        {/* PDF Download */}
        {offer.pdfFile && (
          <button
            onClick={handleDownloadPDF}
            className="button -md -accent-1 col-12 bg-accent-1 text-white mt-15"
          >
            <i className="icon-download text-16 mr-10"></i>
            Full Offer (PDF)
          </button>
        )}
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/number"
        target="_blank"
        rel="noopener noreferrer"
        className="button -md -dark-1 col-12 bg-dark-1 text-white"
      >
        <i className="icon-phone text-16 mr-10"></i>
        Contact via WhatsApp
      </a>

      {/* Additional Info */}
      <div className="mt-30 pt-20 border-top-1">
        <div className="text-14 text-light-2">
          <div className="d-flex items-start mb-10">
            <i className="icon-info text-16 mr-10 mt-5"></i>
            <span>
              Prices vary based on hotel choice and room configuration. See
              hotel options below for detailed pricing.
            </span>
          </div>
        </div>
      </div>

      {/* Gallery Count */}
      {offer.gallery && offer.gallery.length > 0 && (
        <div className="mt-20">
          <div className="d-flex items-center text-14">
            <i className="icon-photo text-16 mr-10"></i>
            {offer.gallery.length} Photo{offer.gallery.length > 1 ? "s" : ""}{" "}
            Available
          </div>
        </div>
      )}
    </div>
  );
}
