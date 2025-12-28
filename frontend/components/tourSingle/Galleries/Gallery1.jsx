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

  // Prepare images array - prioritize externalImageUrl, then images/gallery, then coverImage
  let images = [];

  // First priority: externalImageUrl (for hotels)
  if (data?.externalImageUrl) {
    images.push({
      id: 0,
      image: data.externalImageUrl,
      alt: title,
    });
  }

  // Add images from images array
  if (data?.images && data.images.length > 0) {
    const startId = images.length;
    images = images.concat(
      data.images.map((img, index) => ({
        id: startId + index,
        image: getStrapiURL(img.url),
        alt: img.alternativeText || title,
      }))
    );
  } else if (data?.gallery && data.gallery.length > 0) {
    const startId = images.length;
    images = images.concat(
      data.gallery.map((img, index) => ({
        id: startId + index,
        image: getStrapiURL(img.url),
        alt: img.alternativeText || title,
      }))
    );
  }

  // Fallback to coverImage if no images yet
  if (images.length === 0 && data?.coverImage) {
    images.push({
      id: 0,
      image: getStrapiURL(data.coverImage.url),
      alt: data.coverImage.alternativeText || title,
    });
  }

  // If no images, don't render
  if (images.length === 0) return null;

  // Single image - display full width and height
  if (images.length === 1) {
    return (
      <div className="tourSingleGrid -type-1 mt-30">
        <div className="single-image-container">
          <Image
            fill
            src={images[0].image}
            alt={images[0].alt || title}
            className="rounded-12"
            style={{ objectFit: "cover", backgroundPosition: "center" }}
          />
        </div>
        <style jsx>{`
          .single-image-container {
            width: 100%;
            height: 500px;
            position: relative;
          }
          @media (max-width: 767px) {
            .single-image-container {
              height: 300px;
            }
          }
        `}</style>
      </div>
    );
  }

  // Get first 4 images for grid display
  const gridImages = images.slice(0, 4);
  const hasMoreImages = images.length > 4;

  return (
    <>
      <div className="tourSingleGrid -type-1 mt-30">
        {/* Desktop Grid */}
        <div className="tourSingleGrid__grid desktop-gallery">
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

        {/* Mobile Gallery */}
        <div className="mobile-gallery">
          <div className="mobile-gallery__main">
            <Image
              width={800}
              height={500}
              src={images[0].image}
              alt={images[0].alt || `${title} - Main`}
              className="w-100 h-100 object-cover rounded-12"
            />
          </div>
          {images.length > 1 && (
            <div className="mobile-gallery__thumbs">
              {images.slice(1, 4).map((img, index) => (
                <div key={img.id} className="mobile-gallery__thumb">
                  <Image
                    width={200}
                    height={150}
                    src={img.image}
                    alt={img.alt || `${title} - Image ${index + 2}`}
                    className="w-100 h-100 object-cover rounded-8"
                  />
                </div>
              ))}
            </div>
          )}
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

      <style jsx>{`
        .desktop-gallery {
          display: grid;
          gap: 10px;
          grid-template-columns: 770px 250px 250px;
          grid-template-rows: 250px 250px;
          border-radius: 12px;
        }
        .desktop-gallery > *:nth-child(1) {
          grid-row: 2 span;
        }
        .desktop-gallery > *:nth-child(2) {
          grid-column: 2 span;
        }
        .mobile-gallery {
          display: none;
        }
        @media (max-width: 991px) {
          .desktop-gallery {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 300px 150px;
          }
        }
        @media (max-width: 767px) {
          .desktop-gallery {
            display: none;
          }
          .mobile-gallery {
            display: block;
          }
          .mobile-gallery__main {
            width: 100%;
            height: 250px;
            position: relative;
            overflow: hidden;
            border-radius: 12px;
          }
          .mobile-gallery__thumbs {
            display: flex;
            gap: 8px;
            margin-top: 8px;
            overflow-x: auto;
            padding-bottom: 5px;
          }
          .mobile-gallery__thumb {
            flex: 0 0 100px;
            height: 75px;
            overflow: hidden;
            border-radius: 8px;
          }
        }
      `}</style>

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
