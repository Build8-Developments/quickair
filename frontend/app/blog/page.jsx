import { redirect } from "next/navigation";

/**
 * Legacy blog page - redirects to locale version
 */
export default function BlogPage() {
  redirect("/en/blog");
}
