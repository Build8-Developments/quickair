import { redirect } from "next/navigation";

/**
 * Legacy offers/[id] page - redirects to locale version
 */
export default async function page(props) {
  const params = await props.params;
  const { id } = params;
  redirect(`/en/offers/${id}`);
}
