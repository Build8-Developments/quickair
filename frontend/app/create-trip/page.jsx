import { redirect } from "next/navigation";

/**
 * Legacy create-trip page - redirects to locale version
 */
export default function CreateTripPage() {
  redirect("/en/create-trip");
}
