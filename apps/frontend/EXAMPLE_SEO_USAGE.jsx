// Example: How to use both SEO systems together

// ============================================
// STATIC PAGES (Use existing SEO component)
// ============================================

// pages/about/page.jsx
import SEO from "@/components/common/SEO";

export default function AboutPage() {
  return (
    <>
      <SEO page="about" />
      <div className="about-content">
        {/* About page content */}
      </div>
    </>
  );
}

// pages/contact/page.jsx
import SEO from "@/components/common/SEO";

export default function ContactPage() {
  return (
    <>
      <SEO page="contact" />
      <div className="contact-content">
        {/* Contact page content */}
      </div>
    </>
  );
}

// ============================================
// DYNAMIC PAGES (Use new DynamicSEO component)
// ============================================

// pages/offers/[slug]/page.jsx
"use client";
import { useParams } from "next/navigation";
import DynamicSEO from "@/components/common/DynamicSEO";

export default function OfferDetailPage() {
  const params = useParams();
  
  return (
    <>
      <DynamicSEO 
        contentType="offer"
        slug={params.slug}
        fallbackPage="home"
      />
      
      <div className="offer-detail">
        {/* Offer content fetched from Strapi */}
      </div>
    </>
  );
}

// pages/tours/[slug]/page.jsx
"use client";
import { useParams } from "next/navigation";
import DynamicSEO from "@/components/common/DynamicSEO";

export default function TourDetailPage() {
  const params = useParams();
  
  return (
    <>
      <DynamicSEO 
        contentType="tour"
        slug={params.slug}
        fallbackPage="tourSingle"
      />
      
      <div className="tour-detail">
        {/* Tour content */}
      </div>
    </>
  );
}

// ============================================
// MIXING STATIC LIST + DYNAMIC DETAIL PAGES
// ============================================

// pages/tours/page.jsx - List page (static SEO)
import SEO from "@/components/common/SEO";

export default function ToursListPage() {
  return (
    <>
      <SEO page="tourList" />
      <div className="tours-grid">
        {/* List of tours */}
      </div>
    </>
  );
}

// pages/tours/[slug]/page.jsx - Detail page (dynamic SEO)
"use client";
import { useParams } from "next/navigation";
import DynamicSEO from "@/components/common/DynamicSEO";

export default function TourDetailPage() {
  const params = useParams();
  
  return (
    <>
      <DynamicSEO 
        contentType="tour"
        slug={params.slug}
        fallbackPage="tourSingle"
      />
      <div className="tour-detail">
        {/* Individual tour */}
      </div>
    </>
  );
}

// ============================================
// CUSTOM SEO OVERRIDE EXAMPLE
// ============================================

// For special promotions or campaigns
export default function SpecialOfferPage() {
  return (
    <>
      <DynamicSEO 
        contentType="offer"
        slug="black-friday-2024"
        customSEO={{
          title: "🔥 Black Friday Sale - Up to 70% Off | QuickAir",
          description: "Don't miss our biggest sale of the year! Book your dream vacation now."
        }}
      />
      
      <div className="special-offer">
        {/* Special promotion content */}
      </div>
    </>
  );
}
