import { redirect } from "next/navigation";

/**
 * Legacy trip-confirmation page - redirects to locale version
 */
export default function TripConfirmation() {
  redirect("/en/trip-confirmation");
}
