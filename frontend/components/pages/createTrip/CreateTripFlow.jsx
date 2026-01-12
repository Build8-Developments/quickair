"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import StepIndicator from "./StepIndicator";
import StepDestination from "./steps/StepDestination";
import StepTripType from "./steps/StepTripType";
import StepLocation from "./steps/StepLocation";
import StepHotel from "./steps/StepHotel";
import StepBudget from "./steps/StepBudget";
import StepVisa from "./steps/StepVisa";
import StepTravelers from "./steps/StepTravelers";
import StepDates from "./steps/StepDates";
import StepPreferences from "./steps/StepPreferences";
import StepSummary from "./steps/StepSummary";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./CreateTripFlow.module.css";
import FlightSearch from "@/components/homes/heros/FlightSearch";

const TRIP_TYPES_MAP = {
  package: {
    id: "package",
    titleAr: "باقة متكاملة",
    titleEn: "Complete Package",
    descAr: "رحلة كاملة مع كل شيء",
    descEn: "Full vacation with everything included",
    icon: "package",
  },
  "flight-hotel": {
    id: "flight-hotel",
    titleAr: "طيران فقط",
    titleEn: "Flight Only",
    descAr: "حجز رحلات طيران",
    descEn: "Book flights",
    icon: "flight",
  },
  "hotel-only": {
    id: "hotel-only",
    titleAr: "فندق فقط",
    titleEn: "Hotel Only",
    descAr: "تصفح الفنادق",
    descEn: "Browse our hotels",
    icon: "hotel",
  },
};

const STEPS = [
  { id: 1, title: "Purpose", icon: "icon-flag" },
  { id: 2, title: "Location", icon: "icon-globe" },
  { id: 3, title: "Destination", icon: "icon-location" },
  { id: 4, title: "Hotel", icon: "icon-bed" },
  { id: 5, title: "Travelers", icon: "icon-user" },
  { id: 6, title: "Dates", icon: "icon-calendar" },
  { id: 7, title: "Budget", icon: "icon-wallet" },
  { id: 8, title: "Visa", icon: "icon-passport" },
  { id: 9, title: "Preferences", icon: "icon-heart" },
  { id: 10, title: "Summary", icon: "icon-check" },
];

export default function CreateTripFlow() {
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type");

  // تحديد الخطوة الأولى والنوع بناءً على الـ URL
  const initialTripType = typeFromUrl && TRIP_TYPES_MAP[typeFromUrl] ? TRIP_TYPES_MAP[typeFromUrl] : null;
  const initialStep = initialTripType ? 2 : 1;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [showFlightSearch, setShowFlightSearch] = useState(false);
  const [tripData, setTripData] = useState({
    tripType: initialTripType,
    locationType: null,
    destination: null,
    hotel: null,
    travelers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    dates: {
      startDate: null,
      endDate: null,
      flexible: false,
    },
    budget: {
      amount: null,
      currency: "USD",
      perPerson: true,
    },
    visa: {
      needed: null,
      hasVisa: null,
      assistanceRequired: false,
    },
    preferences: {
      accommodation: [],
      activities: [],
      mealPlan: null,
      specialRequests: "",
    },
    contact: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const updateTripData = (field, value) => {
    setTripData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const { language } = useLanguage();
  const isArabic = language === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  const nextStep = (selectedTripType = null) => {
    const effectiveTripType = selectedTripType || tripData.tripType;

    // Smart routing based on trip type and current step
    if (currentStep === 1 && effectiveTripType) {
      // After selecting trip type
      if (effectiveTripType.id === "hotel-only") {
        // Hotel Only - redirect to hotels page
        window.location.href = "/hotels";
        return;
      }
      if (effectiveTripType.id === "flight-hotel") {
        // Flight Only - render search component
        setShowFlightSearch(true);
        return;
      }
    }

    // Normal flow for Complete Package
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= STEPS.length) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepTripType
            data={tripData.tripType}
            onUpdate={(value) => updateTripData("tripType", value)}
            onNext={nextStep}
            t={t}
          />
        );
      case 2:
        return (
          <StepLocation
            data={tripData.locationType}
            onUpdate={(value) => updateTripData("locationType", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <StepDestination
            data={tripData.destination}
            locationType={tripData.locationType}
            onUpdate={(value) => updateTripData("destination", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <StepHotel
            data={tripData.hotel}
            destination={tripData.destination}
            locationType={tripData.locationType}
            onUpdate={(value) => updateTripData("hotel", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <StepTravelers
            data={tripData.travelers}
            onUpdate={(value) => updateTripData("travelers", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 6:
        return (
          <StepDates
            data={tripData.dates}
            onUpdate={(value) => updateTripData("dates", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 7:
        return (
          <StepBudget
            data={tripData.budget}
            onUpdate={(value) => updateTripData("budget", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 8:
        return (
          <StepVisa
            data={tripData.visa}
            destination={tripData.destination}
            onUpdate={(value) => updateTripData("visa", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 9:
        return (
          <StepPreferences
            data={tripData.preferences}
            onUpdate={(value) => updateTripData("preferences", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 10:
        return (
          <StepSummary
            tripData={tripData}
            onEdit={goToStep}
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className={`layout-pb-lg ${styles.createTripSection}`} style={{ paddingTop: "140px" }} dir={isArabic ? "rtl" : "ltr"}>
      <div className="container">
        <div className="row justify-center">
          <div className="col-xl-10">
            {/* Header */}
            <div className="text-center mb-60">
              <div className="header-icon-wrapper mb-20">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#019fb1" strokeWidth="2">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </div>
              <h1 className={styles.pageTitle}>
                {t("خطط رحلتك المثالية", "Create Your Dream Trip")}
              </h1>
              <p className={styles.pageSubtitle}>
                {t("أخبرنا بما تحلم به وسنصمم لك التجربة المثالية", "Tell us what you want and we'll craft the perfect journey")}
              </p>
            </div>

            {/* Step Indicator */}
            {!showFlightSearch && (
              <StepIndicator
                steps={STEPS}
                currentStep={currentStep}
                onStepClick={goToStep}
              />
            )}

            {/* Step Content */}
            <div className="mt-60">
              {showFlightSearch ? (
                <FlightSearch onBack={() => setShowFlightSearch(false)} />
              ) : (
                renderStep()
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
