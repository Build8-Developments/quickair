import BrandsOne from "@/components/homes/brands/BrandsOne";
import OfferDestinations from "@/components/homes/destinations/OfferDestinations";
import TrendingDestinations from "@/components/homes/destinations/TrendingDestinations";
import FeaturesFour from "@/components/homes/features/FeaturesFour";
import FeaturesThree from "@/components/homes/features/FeaturesThree";
import Hero3 from "@/components/homes/heros/Hero3";
import HajOmra from "@/components/homes/others/Haj-Omra";
import TestimonialsThree from "@/components/homes/testimonials/TestimonialsThree";
import TourSlider5 from "@/components/homes/tours/TourSlider5";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import Faq from "@/components/common/Faq";
import SEO from "@/components/common/SEO";

const page = () => {
  return (
    <>
      <SEO page="home" />
      <main>
        <Header3 />
        <Hero3 />
        <OfferDestinations />
        <BrandsOne />

        <HajOmra />
        <TrendingDestinations />
        <FeaturesFour />
        <TourSlider5 />
        <FeaturesThree />
        <TestimonialsThree />
        <Faq />
        <FooterTwo />
      </main>
    </>
  );
};

export default page;
