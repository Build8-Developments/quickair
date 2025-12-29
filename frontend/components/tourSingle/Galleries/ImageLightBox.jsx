"use client";

import Image from "next/image";
import React from "react";

export default function ImageLightBox({
  images,
  setActiveLightBox,
  activeLightBox,
  currentSlideIndex,
  setCurrentSlideIndex,
}) {
  return (
    <div
      id="myModal"
      className={`modal ${activeLightBox ? "activeImageLightBox" : ""}`}
    >
      <div
        className="close cursor"
        style={{ zIndex: 1001 }}
        onClick={() => {
          setActiveLightBox(false);
        }}
      >
        <span>&times;</span>
      </div>
      <div className="modal-content">
        {images.map((elm, i) => (
          <div
            key={i}
            className={`mySlides ${currentSlideIndex == i ? "fadein" : ""} `}
            style={
              currentSlideIndex == i
                ? { display: "flex", height: "100%", justifyContent: "center", alignItems: "center" }
                : { display: "none", height: "100%" }
            }
          >
            <div className="numbertext">
              {i + 1} / {images.length}
            </div>
            <Image
              width={1200}
              height={800}
              src={elm.image}
              style={{
                height: "auto",
                width: "100%",
                maxHeight: "85vh",
                objectFit: "contain",
              }}
              alt="image"
              priority={currentSlideIndex === i}
            />
          </div>
        ))}

        <a
          className="prev"
          onClick={() =>
            setCurrentSlideIndex((pre) =>
              pre == 0 ? images.length - 1 : pre - 1,
            )
          }
        >
          &#10094;
        </a>
        <a
          className="next"
          onClick={() =>
            setCurrentSlideIndex((pre) =>
              pre == images.length - 1 ? 0 : pre + 1,
            )
          }
        >
          &#10095;
        </a>
      </div>
    </div>
  );
}
