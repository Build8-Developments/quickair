"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import HotelsList from "@/components/hotels/HotelsList";
import { getAllHotels } from "@/lib/api/services/hotel";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HotelsPage() {
  const { t } = useTranslation();
  const { getLocale, language } = useLanguage();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const isRTL = language === "ar";

  useEffect(() => {
    const fetchHotels = async () => {
      const locale = getLocale();
      const data = await getAllHotels({ locale });
      setHotels(data);
      setLoading(false);
    };
    fetchHotels();
  }, [getLocale]);

  return (
    <>
      <main style={{ overflowX: "hidden" }}>
        <div className="header-margin"></div>
        <Header3 />

        {/* Page Header */}
        <section className="pageHeader -type-3">
          <div className="pageHeader__bg">
            <div className="bg-image js-lazy"></div>
          </div>

          <div className="container">
            <div className="row justify-center">
              <div className="col-12">
                <div
                  className="pageHeader__content"
                  style={{ textAlign: isRTL ? "right" : "left" }}
                >
                  <h1 className="pageHeader__title">
                    {t("hotelsList.pageTitle")}
                  </h1>

                  <p className="pageHeader__text">
                    {t("hotelsList.pageDescription")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hotels List */}
        <HotelsList
          initialHotels={hotels}
          totalCount={hotels.length}
          isLoading={loading}
        />

        <FooterTwo />
      </main>
    </>
  );
}
