"use client";

import React, { useState } from "react";
import ImageLightBox from "./ImageLightBox";
import Image from "next/image";
import { getStrapiURL } from "@/lib/strapi";

export default function Gallery1({ offer, hotel }) {
  const [activeLightBox, setActiveLightBox] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);

  // Determine which data to use
  const data = hotel || offer;
  const title = data?.title || data?.name || "Gallery";

  // Prepare images array - prioritize images/gallery, then fallback to coverImage
  const images =
    data?.images && data.images.length > 0
      ? data.images.map((img, index) => ({
          id: index,
          image: getStrapiURL(img.url),
          alt: img.alternativeText || title,
        }))
      : data?.gallery && data.gallery.length > 0
      ? data.gallery.map((img, index) => ({
          id: index,
          image: getStrapiURL(img.url),
          alt: img.alternativeText || title,
        }))
      : data?.coverImage
      ? [
          {
            id: 0,
            image: getStrapiURL(data.coverImage.url),
            alt: data.coverImage.alternativeText || title,
          },
        ]
      : [];

  // If no images, don't render
  if (images.length === 0) return null;

  // Get first 4 images for grid display
  const gridImages = images.slice(0, 4);
  const hasMoreImages = images.length > 4;

  return (
    <>
      <div className="tourSingleGrid -type-1 mt-30">
        <div className="tourSingleGrid__grid mobile-css-slider-2">
          {gridImages.map((img, index) => (
            <div key={img.id} className="tourSingleGrid__item">
              <Image
                width={index === 0 ? 1155 : index === 1 ? 765 : 375}
                height={index === 0 ? 765 : index === 1 ? 375 : 375}
                src={img.image}
                alt={img.alt || `${title} - Image ${index + 1}`}
                className="w-100 h-100 object-cover"
              />
            </div>
          ))}
        </div>

        <div className="tourSingleGrid__button">
          <div
            style={{ cursor: "pointer" }}
            className="js-gallery"
            data-gallery="gallery1"
          >
            <span
              onClick={() => setActiveLightBox(true)}
              className="button -accent-1 py-10 px-20 rounded-200 bg-dark-1 lh-16 text-white"
            >
              See all photos {hasMoreImages && `(${images.length})`}
            </span>
          </div>
        </div>
      </div>
      <ImageLightBox
        images={images}
        activeLightBox={activeLightBox}
        setActiveLightBox={setActiveLightBox}
        currentSlideIndex={currentSlideIndex}
        setCurrentSlideIndex={setCurrentSlideIndex}
      />
    </>
  );
}
