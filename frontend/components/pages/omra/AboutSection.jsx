"use client";
import React from "react";
import Image from "next/image";
import { usePilgrimageContent } from "@/contexts/PilgrimageContentContext";

/**
 * AboutSection Component for Omra Page
 * Displays introductory text about Umrah with a two-column layout
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */
export default function AboutSection({ isRTL }) {
  const { pt } = usePilgrimageContent();

  return (
    <section
      className="about-section layout-pt-lg layout-pb-lg"
      style={{
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div className="container">
        <div className="row y-gap-30 items-center">
          {/* Image Column */}
          <div
            className={`col-lg-6 ${isRTL ? "order-lg-1" : "order-lg-2"}`}
            data-aos="fade-left"
            data-aos-duration="800"
          >
            <div
              className="ratio ratio-4:3 rounded-12 overflow-hidden"
              style={{
                boxShadow: "0 20px 60px rgba(1, 159, 177, 0.15)",
                border: "1px solid rgba(1, 159, 177, 0.1)",
              }}
            >
              <Image
                src="/omra.png"
                alt={pt("about.imageAlt")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Content Column */}
          <div
            className={`col-lg-6 ${isRTL ? "order-lg-2" : "order-lg-1"}`}
            data-aos="fade-right"
            data-aos-duration="800"
          >
            <div
              className={isRTL ? "text-right pl-lg-40" : "pr-lg-40"}
              style={{ textAlign: isRTL ? "right" : "left" }}
            >
              {/* Section Label */}
              <span
                className="text-accent-1 text-15 fw-500 mb-10 d-block"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {pt("about.sectionTitle")}
              </span>

              {/* Title */}
              <h2
                className="text-30 md:text-24 fw-700 text-dark-1 mb-20"
                data-aos="fade-up"
                data-aos-delay="200"
                style={{ lineHeight: 1.4 }}
              >
                {pt("about.title")}
              </h2>

              {/* Paragraph 1 */}
              <p
                className="text-15 text-light-2 mb-20 lh-18"
                data-aos="fade-up"
                data-aos-delay="300"
                style={{ lineHeight: 1.8 }}
              >
                {pt("about.paragraph1")}
              </p>

              {/* Paragraph 2 */}
              <p
                className="text-15 text-light-2 mb-30 lh-18"
                data-aos="fade-up"
                data-aos-delay="400"
                style={{ lineHeight: 1.8 }}
              >
                {pt("about.paragraph2")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
