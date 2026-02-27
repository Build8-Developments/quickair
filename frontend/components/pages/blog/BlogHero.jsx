import PageHero from "@/components/common/PageHero";

const CONTENT = {
  en: {
    title: "Our Blog",
    badge: "Travel Stories & Insights",
    description:
      "Discover the latest travel tips, hidden destinations, and expert guides to make your journey unforgettable",
  },
  ar: {
    title: "مدونتنا",
    badge: "قصص وأفكار السفر",
    description:
      "اكتشف أحدث نصائح السفر والوجهات المخفية وأدلة الخبراء لجعل رحلتك لا تُنسى",
  },
};

export default function BlogHero({ locale }) {
  const t = CONTENT[locale] || CONTENT.en;
  return (
    <PageHero
      locale={locale}
      title={t.title}
      badge={t.badge}
      description={t.description}
      icon="blog"
    />
  );
}
