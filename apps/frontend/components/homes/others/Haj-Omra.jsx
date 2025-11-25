"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HajOmra() {
  return (
    <section className="layout-pt-xl layout-pb-xl">
      <div className="container">
        <div className="row y-gap-30 justify-between">
          {/* First Image */}
          <div
            className="col-lg-6 col-md-6 col-sm-12"
            data-aos="fade-up"
            data-aos-delay=""
          >
            <Link href="/haj" className="d-block overflow-hidden rounded-12">
              <Image
                src="https://placehold.co/750x600/webp?text=haj%20750x600"
                alt="Haj"
                width={750}
                height={600}
                className="w-100 h-auto"
                style={{
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            </Link>
          </div>

          {/* Second Image */}
          <div
            className="col-lg-6 col-md-6 col-sm-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Link href="/omra" className="d-block overflow-hidden rounded-12">
              <Image
                src="https://placehold.co/750x600/webp?text=omra%20750x600"
                alt="Omra"
                width={750}
                height={600}
                className="w-100 h-auto"
                style={{
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
