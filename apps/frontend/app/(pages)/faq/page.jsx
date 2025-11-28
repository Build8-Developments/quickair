import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";
import FaqHero from "@/components/pages/faq/FaqHero";
import FaqContent from "@/components/pages/faq/FaqContent";
import { generatePageMetadata } from "@/utils/seo";
import { getServerLocale } from "@/lib/locale";

export async function generateMetadata() {
  const locale = await getServerLocale();
  return generatePageMetadata("faq", locale);
}

export default function FaqPage() {
  return (
    <>
      <main>
        <Header3 />
        <FaqHero />
        <FaqContent />
        <FooterTwo />
      </main>
    </>
  );
}
