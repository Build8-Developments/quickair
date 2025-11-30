"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MapWidget() {
  const { language, t } = useLanguage();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // Dynamically load Leaflet CSS and JS
    if (typeof window !== "undefined") {
      // Load CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Load JS
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);

      return () => {
        if (mapInstance.current) {
          mapInstance.current.remove();
        }
      };
    }
  }, []);

  const initMap = () => {
    if (mapRef.current && window.L && !mapInstance.current) {
      // Ibn Battuta Street, Heliopolis, Cairo coordinates
      const ibnBattutaCoords = [30.0876, 31.3257];

      // Initialize map
      mapInstance.current = window.L.map(mapRef.current).setView(ibnBattutaCoords, 15);

      // Add OpenStreetMap tile layer
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapInstance.current);

      // Create custom icon
      const customIcon = window.L.divIcon({
        className: "custom-marker",
        html: `
          <div class="marker-pin">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      // Add marker
      window.L.marker(ibnBattutaCoords, { icon: customIcon })
        .addTo(mapInstance.current)
        .bindPopup(
          `
          <div class="popup-content">
            <h3>QuickAir</h3>
            <p>${language === "ar" ? "شارع ابن بطوطة، مصر الجديدة" : "Ibn Battuta Street, Heliopolis"}</p>
            <p>${language === "ar" ? "القاهرة، مصر" : "Cairo, Egypt"}</p>
          </div>
        `
        );
    }
  };

  return (
    <section className="layout-pt-md layout-pb-md">
      <div className="container">
        <div className="row justify-center mb-40">
          <div className="col-auto">
            <h2 className="section-title">{t("موقعنا", "Our Location")}</h2>
            <p className="section-subtitle">{t("تفضل بزيارتنا في مقرنا الرئيسي", "Visit us at our main office")}</p>
          </div>
        </div>
        <div className="row justify-center">
          <div className="col-xl-10 col-lg-11">
            <div className="map-container">
              <div ref={mapRef} className="map-canvas"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .section-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 10px;
          text-align: center;
        }

        .section-subtitle {
          font-size: 16px;
          color: #666;
          text-align: center;
          margin: 0;
        }

        .map-container {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border: 2px solid #e8e8e8;
        }

        :global(.map-canvas) {
          width: 100%;
          height: 500px;
          z-index: 1;
        }

        :global(.custom-marker) {
          background: none;
          border: none;
        }

        :global(.marker-pin) {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #019fb1 0%, #01c0d4 100%);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(1, 159, 177, 0.4);
        }

        :global(.marker-pin svg) {
          transform: rotate(45deg);
          width: 24px;
          height: 24px;
        }

        :global(.leaflet-popup-content-wrapper) {
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }

        :global(.popup-content) {
          padding: 5px;
        }

        :global(.popup-content h3) {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 700;
          color: #019fb1;
        }

        :global(.popup-content p) {
          margin: 4px 0;
          font-size: 13px;
          color: #666;
        }

        @media (max-width: 991px) {
          .section-title {
            font-size: 28px;
          }

          :global(.map-canvas) {
            height: 400px;
          }
        }

        @media (max-width: 575px) {
          .section-title {
            font-size: 24px;
          }

          :global(.map-canvas) {
            height: 350px;
          }

          .map-container {
            border-radius: 15px;
          }
        }
      `}</style>
    </section>
  );
}
