"use client";
import { featuresThree } from "@/data/features";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

// Parse value string like "932M", "24M", "10M" into number and suffix
const parseValue = (value) => {
  const match = value.match(/^([\d,.]+)([A-Za-z+]*)$/);
  if (match) {
    const num = parseFloat(match[1].replace(/,/g, ""));
    const suffix = match[2] || "";
    return { num, suffix };
  }
  return { num: 0, suffix: "" };
};

// Counter hook with intersection observer
const useCounter = (end, duration = 2000, startOnView = true) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, hasStarted]);

  return { count, ref };
};

function CounterValue({ value }) {
  const { num, suffix } = parseValue(value);
  const { count, ref } = useCounter(num, 2000);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function FeaturesFour() {
  const { t } = useTranslation();

  // Map the feature IDs to translation keys
  const getTranslationKey = (id) => {
    const keys = {
      1: "totalDonations",
      2: "campaignsClosed",
      3: "happyPeople",
      4: "ourVolunteers",
    };
    return keys[id] || "";
  };

  return (
    <section className="layout-pt-xl">
      <div className="container">
        <div data-aos="fade-up" data-aos-delay="" className="row y-gap-30">
          {featuresThree.map((elm, i) => (
            <div key={i} className="col-lg-3 col-6">
              <div className="text-center">
                <Image width="60" height="61" src={elm.icon} alt="icon" />

                <h3 className="text-40 md:text-30 lh-14 fw-700 mt-30 md:mt-15">
                  <CounterValue value={elm.value} />
                </h3>
                <p className="lh-15">
                  {t(`home.stats.${getTranslationKey(elm.id)}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
