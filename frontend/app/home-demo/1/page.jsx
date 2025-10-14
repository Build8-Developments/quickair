import OfferDestinations from "@/components/homes/destinations/OfferDestinations";
import TrendingDestinations from "@/components/homes/destinations/TrendingDestinations";
import FeaturesFour from "@/components/homes/features/FeaturesFour";
import FeaturesThree from "@/components/homes/features/FeaturesThree";
import Hero1 from "@/components/homes/heros/Hero1";
import HajOmra from "@/components/homes/others/Haj-Omra";
import TestimonialsThree from "@/components/homes/testimonials/TestimonialsThree";
import TourSlider5 from "@/components/homes/tours/TourSlider5";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header1 from "@/components/layout/header/Header1";
import Faq from "@/components/pages/helpCenter/Faq";

const page = () => {
  return (
    <main>
      <Header1 />
      <Hero1 />
      <OfferDestinations />
      <HajOmra />
      <TrendingDestinations />
      <FeaturesFour />
      <TourSlider5 />
      <FeaturesThree />
      <TestimonialsThree />
      <Faq />
      <FooterTwo />
    </main>
  );
};

export default page;
