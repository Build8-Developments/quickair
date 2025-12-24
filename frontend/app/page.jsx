import { redirect } from "next/navigation";
import { i18nConfig } from "@/lib/i18n-config";

/**
 * Root page - redirects to default locale
 * All actual content is served from /[locale]/ routes
 */
export default function RootPage() {
  redirect(`/${i18nConfig.defaultLocale}`);
}
