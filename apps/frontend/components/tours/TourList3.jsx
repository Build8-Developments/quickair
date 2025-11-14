"use client";

import { speedFeatures, toursTypes } from "@/data/tourFilteringOptions";
import Pagination from "../common/Pagination";
import { tourDataThree } from "@/data/tours";
import Stars from "../common/Stars";
import ToggleSidebar from "./ToggleSidebar";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function TourList3() {
  const [sortOption, setSortOption] = useState("");
  const [ddActives, setDdActives] = useState(false);
  const [tourTypeActive, settourTypeActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropDownContainer = useRef();
  const dropDownContainer2 = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setDdActives(false);
      }
      if (
        dropDownContainer2.current &&
        !dropDownContainer2.current.contains(event.target)
      ) {
        settourTypeActive(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <>
      <section className="layout-pb-xl">
        <div className="container">
          <div className="row custom-dd-container justify-between items-center relative z-5">
            <div className="col-auto"></div>

            <div ref={dropDownContainer} className="col-auto">
              <div
                className={`dropdown -type-2 js-dropdown js-form-dd ${
                  ddActives ? "is-active" : ""
                } `}
                data-main-value=""
              >
                <div
                  className="dropdown__button js-button"
                  onClick={() => setDdActives((pre) => !pre)}
                >
                  <span>Sort by: </span>
                  <span className="js-title">
                    {sortOption ? sortOption : "Featured"}
                  </span>
                  <i className="icon-chevron-down"></i>
                </div>

                <div className="dropdown__menu js-menu-items">
                  {speedFeatures.map((elm, i) => (
                    <div
                      onClick={() => {
                        setSortOption((pre) => (pre == elm ? "" : elm));
                        setDdActives(false);
                      }}
                      key={i}
                      className="dropdown__item"
                      data-value="fast"
                    >
                      {elm}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row y-gap-30 pt-30">
            {tourDataThree.map((elm, i) => (
              <div key={i} className="col-lg-3 col-sm-6">
                <Link
                  href={`/tour-single-1/${elm.id}`}
                  className="tourCard -type-1 py-10 px-10 border-1 rounded-12  -hover-shadow"
                >
                  <div className="tourCard__header">
                    <div className="tourCard__image ratio ratio-28:20">
                      <Image
                        width={421}
                        height={301}
                        src={elm.imageSrc}
                        alt="image"
                        className="img-ratio rounded-12"
                      />
                    </div>

                    <button className="tourCard__favorite">
                      <i className="icon-heart"></i>
                    </button>
                  </div>

                  <div className="tourCard__content px-10 pt-10">
                    <div className="tourCard__location d-flex items-center text-13 text-light-2">
                      <i className="icon-pin d-flex text-16 text-light-2 mr-5"></i>
                      {elm.location}
                    </div>

                    <h3 className="tourCard__title text-16 fw-500 mt-5">
                      <span>{elm.title}</span>
                    </h3>

                    <div className="tourCard__rating d-flex items-center text-13 mt-5">
                      <div className="d-flex x-gap-5">
                        {<Stars star={elm.rating} />}
                      </div>

                      <span className="text-dark-1 ml-10">
                        {elm.rating} ({elm.ratingCount})
                      </span>
                    </div>

                    <div className="d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10">
                      <div className="d-flex items-center">
                        <i className="icon-clock text-16 mr-5"></i>
                        {elm.duration}
                      </div>

                      <div>
                        From{" "}
                        <span className="text-16 fw-500">${elm.price}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="d-flex justify-center flex-column mt-60">
            <Pagination />

            <div className="text-14 text-center mt-20">
              Showing results 1-30 of 1,415
            </div>
          </div>
        </div>
      </section>
      <ToggleSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </>
  );
}
