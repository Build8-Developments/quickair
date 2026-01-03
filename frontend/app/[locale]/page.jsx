import BrandsOne from "@/components/homes/brands/BrandsOne";
import ChatbotWidget from "@/components/homes/chatbot/ChatbotWidget";
import OfferDestinations from "@/components/homes/destinations/OfferDestinations";
import TrendingDestinations from "@/components/homes/destinations/TrendingDestinations";
import FeaturesFour from "@/components/homes/features/FeaturesFour";
import FeaturesThree from "@/components/homes/features/FeaturesThree";
import Hero3 from "@/components/homes/heros/Hero3";
import HajOmra from "@/components/homes/others/Haj-Omra";
import Honeymoon from "@/components/homes/others/Honeymoon";
import TripTypeSelector from "@/components/homes/others/TripTypeSelector";
import TestimonialsThree from "@/components/homes/testimonials/TestimonialsThree";
import TourSlider5 from "@/components/homes/tours/TourSlider5";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import HomeFaq from "@/components/homes/faq/HomeFaq";
import ContactForm from "@/components/pages/contact/ContactForm";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const metadata = generateLocalizedMetadata("home", locale);
  const baseUrl = siteInfo.siteUrl;

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        ar: `${baseUrl}/ar`,
        "x-default": `${baseUrl}/en`,
      },
    },
  };
}

export default async function HomePage({ params }) {
  const { locale } = await params;

  return (
    <>
      <main>
        <Header3 locale={locale} />
        <Hero3 locale={locale} />
        <TripTypeSelector locale={locale} />
        <ChatbotWidget />
        <OfferDestinations locale={locale} />
        <BrandsOne locale={locale} />
        <HajOmra locale={locale} />
        <Honeymoon locale={locale} />
        <TrendingDestinations locale={locale} />
        <FeaturesFour locale={locale} />
        <TourSlider5 locale={locale} />
        <FeaturesThree locale={locale} />
        <TestimonialsThree locale={locale} />
        <HomeFaq locale={locale} />
        <ContactForm locale={locale} />
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
