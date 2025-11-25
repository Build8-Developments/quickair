"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import OffersList from "@/components/offers/OffersList";
import { getAllOffers } from "@/lib/api/services/offer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function OffersPage() {
  const { t } = useTranslation();
  const { getLocale, language } = useLanguage();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isRTL = language === "ar";

  useEffect(() => {
    const fetchOffers = async () => {
      const locale = getLocale();
      const data = await getAllOffers({
        locale,
        limit: 100,
        sort: "createdAt:desc",
      });
      setOffers(data);
      setLoading(false);
    };
    fetchOffers();
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
                    {t("offersList.pageTitle")}
                  </h1>

                  <p className="pageHeader__text">
                    {t("offersList.pageDescription")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Offers List */}
        <OffersList
          initialOffers={offers}
          totalCount={offers.length}
          isLoading={loading}
        />

        <FooterTwo />
      </main>
    </>
  );
}
