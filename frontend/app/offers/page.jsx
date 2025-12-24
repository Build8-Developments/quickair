import { redirect } from "next/navigation";

/**
 * Legacy offers page - redirects to locale version
 */
export default function OffersPage() {
  redirect("/en/offers");
}
