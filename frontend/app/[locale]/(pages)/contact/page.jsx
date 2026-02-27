import FooterTwo from "@/components/layout/footers/FooterTwo";
import Header3 from "@/components/layout/header/Header3";
import ContactForm from "@/components/pages/contact/ContactForm";
import MapWidget from "@/components/pages/contact/MapWidget";
import PageHero from "@/components/common/PageHero";
import { generateLocalizedMetadata } from "@/utils/seo";
import { siteInfo } from "@/data/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const metadata = generateLocalizedMetadata("contact", locale);
  const baseUrl = siteInfo.siteUrl;

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/contact`,
      languages: {
        en: `${baseUrl}/en/contact`,
        ar: `${baseUrl}/ar/contact`,
        "x-default": `${baseUrl}/en/contact`,
      },
    },
  };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;

  return (
    <>
      <main>
        <Header3 locale={locale} />
        <PageHero
          locale={locale}
          title={locale === "ar" ? "تواصل معنا" : "Contact Us"}
          badge={locale === "ar" ? "نحن هنا لمساعدتك" : "We're Here to Help"}
          description={
            locale === "ar"
              ? "نحن هنا لمساعدتك في تخطيط رحلتك المثالية"
              : "We're here to help you plan your perfect trip"
          }
          icon="contact"
        />
        <ContactForm locale={locale} />
        <MapWidget locale={locale} />
        <FooterTwo locale={locale} />
      </main>
    </>
  );
}
