import { redirect } from "next/navigation";

/**
 * Legacy locations/[slug] page - redirects to locale version
 */
export default async function LocationPage({ params }) {
  const { slug } = await params;
  redirect(`/en/locations/${slug}`);
}
