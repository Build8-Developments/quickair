import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Valid cache tags (must match config/api.js CACHE_CONFIG.tags)
const VALID_TAGS = ["offers", "tours", "destinations", "blogs"];

// Map Strapi model names to cache tags
const MODEL_TO_TAG = {
  blog: "blogs",
  offer: "offers",
  tour: "tours",
  destination: "destinations",
  location: "destinations", // location model maps to destinations tag
  hotel: "offers", // hotels are part of offers
};

export async function POST(request) {
  try {
    // Verify secret token (check header first, then query param for backwards compat)
    const secret =
      request.headers.get("x-revalidation-secret") ||
      request.nextUrl.searchParams.get("secret");

    const envSecret = process.env.REVALIDATION_SECRET;

    if (secret !== envSecret) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    // Get tag or path from query params
    let tag = request.nextUrl.searchParams.get("tag");
    const path = request.nextUrl.searchParams.get("path");
    const all = request.nextUrl.searchParams.get("all");

    // If no tag specified, try to parse Strapi webhook payload
    if (!tag && !path && !all) {
      try {
        const body = await request.json();
        const model = body.model || body.uid?.split(".").pop();

        if (model && MODEL_TO_TAG[model]) {
          tag = MODEL_TO_TAG[model];
          console.log(`📦 Strapi webhook: model "${model}" → tag "${tag}"`);
        }
      } catch {
        // No JSON body or parse error - that's fine, check other params
      }
    }

    // Handle "all" - revalidate everything
    if (all === "true" || all === "1") {
      VALID_TAGS.forEach((t) => revalidateTag(t));
      console.log(`✅ Revalidated ALL tags: ${VALID_TAGS.join(", ")}`);
      return NextResponse.json({
        revalidated: true,
        tags: VALID_TAGS,
        timestamp: Date.now(),
      });
    }

    // Handle tag-based revalidation
    if (tag) {
      if (!VALID_TAGS.includes(tag)) {
        return NextResponse.json(
          { error: `Invalid tag. Valid tags: ${VALID_TAGS.join(", ")}` },
          { status: 400 },
        );
      }
      revalidateTag(tag);
      console.log(`✅ Revalidated tag: ${tag}`);
      return NextResponse.json({
        revalidated: true,
        tag,
        timestamp: Date.now(),
      });
    }

    // Handle path-based revalidation
    if (path) {
      revalidatePath(path);
      console.log(`✅ Revalidated path: ${path}`);
      return NextResponse.json({
        revalidated: true,
        path,
        timestamp: Date.now(),
      });
    }

    return NextResponse.json(
      {
        error:
          "Missing 'tag', 'path', or 'all' parameter. Or send Strapi webhook payload.",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("❌ Revalidation error:", error);
    return NextResponse.json(
      { error: "Revalidation failed", details: error.message },
      { status: 500 },
    );
  }
}

// Also support GET for easy testing (remove in production if preferred)
export async function GET(request) {
  return POST(request);
}
