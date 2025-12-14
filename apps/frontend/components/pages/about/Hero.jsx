"use client";

import Image from "next/image";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className="pageHeader -type-1">
      <div className="pageHeader__bg">
        <Image
          width={1800}
          height={500}
          src="/img/pageHeader/1.jpg"
          alt="image"
        />
        <Image
          width="1800"
          height="40"
          style={{ height: "auto" }}
          src="/img/hero/1/shape.svg"
          alt="image"
        />
      </div>

      <div className="container">
        <div className="row justify-center">
          <div className="col-12">
            <div className="pageHeader__content">
              <h1 className="pageHeader__title">
                {isArabic ? "من نحن" : "About Us"}
              </h1>

              <p className="pageHeader__text">
                {isArabic 
                  ? "شريكك الموثوق في السفر منذ عام 1986 - خدمة أكثر من مليوني عميل"
                  : "Your Trusted Travel Partner Since 1986 - Serving Over 2 Million Customers"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
