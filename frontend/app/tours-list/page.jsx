import { redirect } from "next/navigation";

/**
 * Legacy tours-list page - redirects to locale version
 */
export default function page() {
  redirect("/en/tours-list");
}
