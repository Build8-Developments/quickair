"use client";

import { homes, pages, tours } from "@/data/menu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Menu() {
  const pathname = usePathname();
  return (
    <>
      <div className="xl:d-none ml-30">
        <div className="desktopNav">
          <div className="desktopNav__item">
            <Link href="/">Home</Link>
          </div>

          <div className="desktopNav__item">
            <a href="#">
              Tour <i className="icon-chevron-down"></i>
            </a>

            <div className="desktopNavMega">
              <div className="desktopNavMega__container">
                <div className="desktopNavMega__lists">
                  {tours.map((elm, i) => (
                    <div key={i} className="desktopNavMega-list">
                      <div className="desktopNavMega-list__item">
                        <div className="desktopNavMega-list__title">
                          {elm.title}
                        </div>

                        <div className="desktopNavMega-list__list">
                          {elm.links.map((elm2, i2) => (
                            <div key={i2} className="desktopNavMega-list__link">
                              <Link href={elm2.href}>{elm2.title}</Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="desktopNavMega__info">
                  <div className="specialCardGrid row y-gap-30">
                    <div className="col-12">
                      <div className="specialCard">
                        <div className="specialCard__image">
                          <Image
                            width={615}
                            height={300}
                            src="/img/cta/10/1.jpg"
                            alt="image"
                          />
                        </div>

                        <div className="specialCard__content">
                          <div className="specialCard__subtitle">
                            Enjoy Upto
                          </div>
                          <h3 className="specialCard__title">60 % OFF</h3>
                          <div className="specialCard__text">
                            on Your Booking
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="specialCard">
                        <div className="specialCard__image">
                          <Image
                            width={615}
                            height={300}
                            src="/img/cta/10/2.jpg"
                            alt="image"
                          />
                        </div>

                        <div className="specialCard__content">
                          <div className="specialCard__subtitle">
                            80% Discount
                          </div>
                          <h3 className="specialCard__title">
                            Are You Ready
                            <br /> To Turkey Tour
                          </h3>
                          <div className="specialCard__text"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desktopNav__item">
            <a href="/flow">Create your trip</a>
          </div>

          <div className="desktopNav__item">
            <a href="/about">About</a>
          </div>

          <div className="desktopNav__item">
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </>
  );
}
