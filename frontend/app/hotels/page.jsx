import { redirect } from "next/navigation";

/**
 * Legacy hotels page - redirects to locale version
 */
export default function HotelsPage() {
  redirect("/en/hotels");
}
