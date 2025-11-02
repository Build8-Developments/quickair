"use client";
import { tourDataThree } from "@/data/tours";
import { useEffect, useRef, useState } from "react";
import Stars from "../common/Stars";
import Image from "next/image";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const [getLocation, setLocation] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const popupRef = useRef(null);

  const center = { lat: 27.411201277163975, lng: -96.12394824867293 };

  // location handler
  const locationHandler = (location) => {
    setLocation(location);
  };

  // close handler
  const closeCardHandler = () => {
    setLocation(null);
  };

  useEffect(() => {
    // Only initialize on client side
    if (
      typeof window !== "undefined" &&
      mapRef.current &&
      !mapInstanceRef.current
    ) {
      // Dynamic import of Leaflet
      Promise.all([
        import("leaflet"),
        import("leaflet.markercluster"),
        import("leaflet.markercluster/dist/MarkerCluster.css"),
        import("leaflet.markercluster/dist/MarkerCluster.Default.css"),
      ]).then(([L]) => {
        // Initialize map
        const map = L.map(mapRef.current).setView([center.lat, center.lng], 4);

        // Add OpenStreetMap tiles (free)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Create marker cluster group
        const markers = L.markerClusterGroup({
          maxClusterRadius: 50,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true,
        });

        // Custom icon
        const customIcon = L.divIcon({
          className: "custom-marker",
          html: '<div style="background-color: #eb662b; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        // Add markers for each tour
        tourDataThree.slice(0, 6).forEach((marker) => {
          const tourMarker = L.marker(
            [Number(marker.lat), Number(marker.long)],
            {
              icon: customIcon,
            }
          );

          tourMarker.on("click", () => {
            locationHandler(marker);
          });

          markers.addLayer(tourMarker);
          markersRef.current.push(tourMarker);
        });

        map.addLayer(markers);
        mapInstanceRef.current = map;
      });
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  return (
    <>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "500px",
          position: "relative",
        }}
      />

      {/* Custom Info Window Overlay */}
      {getLocation !== null && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            maxWidth: "400px",
            width: "90%",
          }}
        >
          <div style={{ position: "relative" }}>
            <button
              onClick={closeCardHandler}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "white",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                zIndex: 1001,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              ×
            </button>
            <Link
              href={`/tour-single-1/${getLocation.id}`}
              className="tourCard -type-1 py-10 px-10 border-1 rounded-12 -hover-shadow"
              style={{ background: "white", display: "block" }}
            >
              <div className="tourCard__header">
                <div className="tourCard__image ratio ratio-28:20">
                  <Image
                    width={421}
                    height={301}
                    src={getLocation.imageSrc}
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
                  {getLocation.location}
                </div>

                <h3 className="tourCard__title text-16 fw-500 mt-5">
                  <span>{getLocation.title}</span>
                </h3>

                <div className="tourCard__rating d-flex items-center text-13 mt-5">
                  <div className="d-flex x-gap-5">
                    <Stars star={getLocation.rating} />
                  </div>

                  <span className="text-dark-1 ml-10">
                    {getLocation.rating} ({getLocation.ratingCount})
                  </span>
                </div>

                <div className="d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10">
                  <div className="d-flex items-center">
                    <i className="icon-clock text-16 mr-5"></i>
                    {getLocation.duration}
                  </div>

                  <div>
                    From{" "}
                    <span className="text-16 fw-500">${getLocation.price}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
