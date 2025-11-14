"use client";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAllLocations } from "@/lib/api/hooks/useLocation";

export default function Location({ active, setLocation }) {
  const { language } = useLanguage();
  const { locations, loading } = useAllLocations({
    locale: language,
    limit: 100,
  });

  return (
    <div
      className={`searchFormItemDropdown -location ${
        active ? "is-active" : ""
      } `}
      data-x="location"
      data-x-toggle="is-active"
    >
      <div className="searchFormItemDropdown__container">
        <div className="searchFormItemDropdown__list sroll-bar-1">
          {loading ? (
            <div className="searchFormItemDropdown__item">
              <button className="js-select-control-button">
                <span>
                  {language === "ar" ? "جاري التحميل..." : "Loading..."}
                </span>
              </button>
            </div>
          ) : locations.length === 0 ? (
            <div className="searchFormItemDropdown__item">
              <button className="js-select-control-button">
                <span>
                  {language === "ar" ? "لا توجد وجهات" : "No locations found"}
                </span>
              </button>
            </div>
          ) : (
            locations.map((location) => (
              <div
                onClick={() =>
                  setLocation((pre) =>
                    pre === location.name ? "" : location.name
                  )
                }
                key={location.documentId}
                className="searchFormItemDropdown__item"
              >
                <button className="js-select-control-button">
                  <span className="js-select-control-choice">
                    {location.name}
                  </span>
                  <span>{location.type}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
